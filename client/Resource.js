Resource = {
    timerId: 0,
    interval: 1000,
    lastTime: Date.now(),
    callback: null,
    start: function(ip, interval, cb){
        if (!ip || !cb) return alert('Failed to run Resource')
        this.stop()
        this.interval = interval && interval > 100 ? interval : this.interval
        this.callback = cb
        if (/*'demo' === */ip) {
            this.timerId = window.setTimeout(this.randomAdd, this.interval, this)
        }else{
			var self = this
            this.ajaxGet('config?data='+ip, function(err){
                if (err) return console.error(err)
                self.ajaxGet('get', self.netAdd, self)
            })
        }
    },
    stop: function(){
        window.clearTimeout(this.timerId)
        this.timerId = 0
    },
    ajaxGet: function(path, cb, ud){
        var xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')

        xhr.open('get', encodeURI('http://localhost:8080/'+path), true)

        xhr.onreadystatechange=function(){
            if (4 === xhr.readyState && cb){
                var st = xhr.status
                return cb((200 === st || !st) ? null : new Error("Error["+xhr.statusText+"] Info: "+xhr.responseText), xhr, ud)
            }
        }
        xhr.onerror=function(exp){cb(exp, xhr, ud)}

        xhr.send()
    },
    set: function(settings, cb){
        this.ajaxGet('set?data='+settings.join('|'), cb)
    },
    netAdd: function(err, xhr, ctx){
        if (err) return console.error(err)

        var
        time = Date.now(),
        dt = time - ctx.lastTime,
        data

        ctx.lastTime = time
        
		data = xhr.responseText.split('|').map(function(x){return parseInt(x)})
		ctx.callback(data.slice(0, 4), data.slice(4))

        ctx.timerId = window.setTimeout(ctx.ajaxGet, ctx.interval - dt, 'get', ctx.netAdd, ctx)
    },
    randomAdd: function(ctx){
        var R = Math.round, Ran = Math.random
        ctx.callback([R(Ran()*1000)/10, R(Ran()*6),20,80], [R(Ran()*100),R(Ran()*6),20,80])
        ctx.timerId = window.setTimeout(ctx.randomAdd, ctx.interval, ctx)
    }
}
