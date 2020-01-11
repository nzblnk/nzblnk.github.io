"use strict"

String.prototype.replacePlaceholder = function (A) {
    return this.replace(/{(\w+)}/g, function (B, C) {
        return A[C]
    })
}
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const $lnk = $('#reslnk')

let constuctLink = _ => {
    let mandatory = 'th'
    let params = {
        t: $('#tag').value,
        h: $('#header').value,
        g: $('#group').value,
        p: $('#pass').value
    }
    let nzblnk = []
    Object.keys(params).forEach(prop => {
        let val = params[prop]
        if ('' === val.trim()) return
        nzblnk.push(prop + '=' + encodeURIComponent(val).replace(/%20/g, '+'))
        mandatory = mandatory.replace(prop, '')
    })
    if ('' !== mandatory) {
        $lnk.href = '#'
        $lnk.textContent = 'Please fill all mandatory fields (marked with *).'
        $lnk.classList.add('invalid')
        return
    }
    $lnk.classList.remove('invalid')
    nzblnk = 'nzblnk:?' + nzblnk.join('&')
    $lnk.href = $lnk.textContent = nzblnk
}

$$('input.nzbparam').forEach(el => {
    el.addEventListener('keyup', constuctLink)
    el.addEventListener('blur', constuctLink)
})

$$('.btn').forEach(function (el) {
    el.addEventListener('click', ev => {
        if ($lnk.classList.contains('invalid')) return

        let node = document.createElement('input')
        node.className = 'hidden'
        node.value = ev.target.getAttribute('data-tpl').replacePlaceholder({
            'nzblnk': $lnk.textContent,
            'title': $('#tag').value
        })
        document.body.appendChild(node)
        node.select()
        document.execCommand('copy')
        document.body.removeChild(node)
    })
})

let dragCount = 0;

['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(ev => {
    window.addEventListener(ev, e => {
        e.preventDefault()
        e.stopPropagation()
    })
});

['dragenter'].forEach(ev => {
    window.addEventListener(ev, e => {
        dragCount++
        if (1 === dragCount)
            document.body.classList.add('drop')
    }, true)
})

let readFile = file => new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = _ => res({xml: reader.result, name: file.name})
    reader.onerror = error => rej(error)
    reader.readAsText(file)
})

let parseXml = (data) => {
    const dp = new DOMParser()
    let dom = window.d = dp.parseFromString(data.xml, 'text/xml')
    let fileList = dom.getElementsByTagName('file')
    if (!fileList) {
        alert('Invalid file format.')
        return
    }
    let subject = 'subject' in fileList[0].attributes ? fileList[0].attributes.subject.value : ''
    let hash = subject.match(/"([^."]*)/)
    hash = hash && hash.length > 1 ? hash[1] : null

    let headPw = d.querySelector('meta[type=password]')
    let password = headPw ? headPw.textContent : null

    let matcher = data.name.match(/^(.*?)(?:{{(.*)}})?\.nzb/)
    let name = data.name
    if (matcher && matcher.length > 1) {
        if (!password && matcher[2]) password = matcher[2]
        name = matcher[1]
    }

    $('#tag').value = name
    $('#header').value = hash
    $('#pass').value = password

    constuctLink()
};

['dragleave', 'dragend', 'drop'].forEach(ev => {
    window.addEventListener(ev, e => {
        dragCount--
        if (!dragCount)
            document.body.classList.remove('drop')
        if ('drop' === e.type) {
            let dtf = e.dataTransfer.files
            if (dtf && dtf[0] ) {
                readFile(dtf[0]).then(parseXml)
            }
        }
    }, true)
})
