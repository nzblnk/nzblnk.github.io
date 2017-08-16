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

            var node = document.createElement('input')
            var $body = $('body')
            node.className = 'hidden'
            node.value = ev.target.getAttribute('data-tpl').replacePlaceholder({
                'nzblnk': $lnk.textContent,
                'title': $('#tag').value
            })
            $body.appendChild(node)
            node.select()
            document.execCommand('copy')
            $body.removeChild(node)
        })
    })
}())