String.prototype.replacePlaceholder=function(A){return this.replace(/\{(\w+)}/g,function(B,C){return A[C]})};
(function() {
    "use strict"
    var $lnk = $('#reslnk')
    function constuctLink(){
        var mandatory = 'th'
        var params = {
            t : $('#tag').value,
            h : $('#header').value,
            g : $('#group').value,
            p : $('#pass').value
        }
        var nzblnk = []
        $.each(params, function (prop, val) {
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

    $$('input.nzbparam').forEach(function (el) {
        el.addEventListener('keyup', constuctLink)
        el.addEventListener('blur', constuctLink)
    })

    $$('.btn').forEach(function(el){
        el.addEventListener('click', function(ev) {
            if ($lnk.classList.contains('invalid')) return

            var range = document.createRange()
            var node = document.createElement('span')
            var $body = $('body')
            node.className = 'hidden'
            node.textContent = ev.target.getAttribute('data-tpl').replacePlaceholder({
                'nzblnk': $lnk.textContent,
                'title': $('#tag').value
            })
            $body.appendChild(node)
            range.selectNode(node)
            window.getSelection().addRange(range)
            document.execCommand('copy')
            window.getSelection().removeAllRanges()
            $body.removeChild(node)
        })
    })
}())