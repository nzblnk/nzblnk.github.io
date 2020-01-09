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
