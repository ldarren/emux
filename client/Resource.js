Resource = {
    timerId: 0,
    isStopped: false,
    interval: 1000,
    lastTime: Date.now(),
    callback: null,
    start: function(ip, interval, cb){
        if (!ip || !cb) return alert('Failed to run Resource')
        this.isStopped = false
        this.stop()
        this.interval = interval && interval > 100 ? interval : this.interval
        this.callback = cb
        if (/*'demo' === */ip) {
            this.timerId = window.setTimeout(this.randomAdd, this.interval, this)
        }else{
            this.ajaxGet('/set?ip='+ip, function(err){
                if (err) return console.error(err)
                this.ajaxGet('/chart', this.netAdd, this)
            })
        }
    },
    stop: function(){
        this.isStopped = true
        window.clearTimeout(this.timerId)
        this.timerId = 0
    },
    ajaxGet: function(path, cb, ud){
        var xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')

        xhr.open('get', encodeURI('http://localhost/'+path), true)

        xhr.onreadystatechange=function(){
            if (4 === xhr.readyState && cb){
                var st = xhr.status
                return cb((200 === st || !st) ? null : new Error("Error["+xhr.statusText+"] Info: "+xhr.responseText), xhr, ud)
            }
        }
        xhr.onerror=function(exp){cb(exp, xhr, ud)}

        xhr.send()
    },
    netAdd: function(err, xhr, ctx){
        if (err) return console.error(err)

        var
        time = Date.now(),
        dt = time - ctx.lastTime,
        data

        ctx.lastTime = time
        
        try{
            data = JSON.parse(xhr.responseText)
            ctx.callback(time, parseInt(data.tmp)/10, hv = parseInt(data.hmd))
        }catch(exp){
            console.error(exp)
        }

        if (ctx.isStopped) return
        
        if (ctx.interval < dt) ctx.ajaxGet('/chart', ctx.netAdd, ctx)
        ctx.timerId = window.setTimeout(ctx.ajaxGet, ctx.interval - dt, '/chart', ctx.netAdd, ctx)
    },
    randomAdd: function(ctx){
        ctx.callback(Date.now(), Math.round(Math.random()*1000)/10, Math.round(Math.random()*100))
        ctx.timerId = window.setTimeout(ctx.randomAdd, ctx.interval, ctx)
    }
}
