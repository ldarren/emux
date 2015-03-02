Resource = {
    timerId: 0,
    interval: 1000,
    lastTime: Date.now(),
    callback: null,
    start: function(ip, cb){
        if (!ip || !cb) return cb('Failed to run Resource')
        this.stop()
        if ('demo' === ip) {
			return cb(ip)
        }else{
			var self = this
            this.ajaxGet('config?data='+ip, function(err){
                if (err) return cb(err)
                self.ajaxGet('retrieve', function(err, xhr){
					if (err) return cb(err)
					var data = self.parse(xhr.responseText)
					cb(null, data.slice(0, 4), data.slice(4))
				})
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
	parse: function(str){
		var arr = str.split('|').map(function(x){return parseInt(x)})
		arr[0] = arr[0]/10
		arr[2] = arr[2]/10
		arr[3] = arr[3]/10
		return arr
	},
	poll: function(interval, cb){
        this.interval = interval && interval > 100 ? interval : this.interval
		this.callback = cb
		this.ajaxGet('get', this.netAdd, this)
	},
    demo: function(interval, cb, ctx){
        var
		R = Math.round, Ran = Math.random,
		tmp = R(Ran()*1000)/10,
		hmd = R(Ran()*100)

        cb([tmp, tmp<20||tmp>80?3:1,20,80], [hmd,hmd<20||hmd>80?3:1,20,80])
        ctx.timerId = window.setTimeout(ctx.demo, interval, interval, cb, ctx)
    },
    netAdd: function(err, xhr, ctx){
        if (err) return console.error(err)

        var
        time = Date.now(),
        dt = time - ctx.lastTime,
        data

        ctx.lastTime = time
        
		data = ctx.parse(xhr.responseText)
		ctx.callback(data.slice(0, 4), data.slice(4))

        ctx.timerId = window.setTimeout(ctx.ajaxGet, ctx.interval - dt, 'get', ctx.netAdd, ctx)
    }
}
