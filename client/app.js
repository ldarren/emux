window.addEventListener('load', function(e){
	var
    LSKey = 'emux',
	pageSetup = document.querySelector('#setup.page'),
    formSetup = pageSetup.querySelector('form.pure-form'),
	pageWatch = document.querySelector('#watch.page'),
	panelTmp = new WatchPanel(pageWatch.querySelector('#tmp.panel'), false),
	panelHmd = new WatchPanel(pageWatch.querySelector('#hmd.panel'), true),
    timerId = 0, emuxIP='192.168.1.100', tmpCap=20, hmdCap=20
    onTimer = function(){
        var t = Date.now()

        panelTmp.plot(t, Math.round(Math.random()*1000)/10, 'C')
        panelHmd.plot(t, Math.round(Math.random()*100), '%')
        timerId = window.setTimeout(onTimer, 1000)
    },
    onSave = function(e){
        if(!formSetup.checkValidity()) return alert('Missing required fields')
        emuxIP = formSetup.ip.value
        tmpCap = parseInt(formSetup.tmpCap.value)
        hmdCap = parseInt(formSetup.hmdCap.value)
        window.localStorage.setItem(LSKey, JSON.stringify({ip:emuxIP, tmpCap:tmpCap, hmdCap:hmdCap}))
    },
    onLoad = function(){
        try{ 
            var s = JSON.parse(window.localStorage.getItem(LSKey))
            emuxIP = s.ip
            tmpCap = s.tmpCap
            hmdCap = s.hmdCap
        } catch(exp){
            console.error(exp)
        }
        formSetup.ip.value = emuxIP
        formSetup.tmpCap.value = tmpCap
        formSetup.hmdCap.value = hmdCap
    },
	onResize = function(e){
		panelTmp.resize()
		panelHmd.resize()
	},
	onMenuClick = function(e){
		switch(e.target.firstChild.textContent){
		case 'Setup':
            window.clearTimeout(timerId)
            onLoad()
			pageWatch.setAttribute('hidden', '')
			pageSetup.removeAttribute('hidden')
			break
		case 'Watch':
            panelTmp.setThreshold(tmpCap)
            panelHmd.setThreshold(hmdCap)
			pageSetup.setAttribute('hidden', '')
			pageWatch.removeAttribute('hidden')
            timerId = window.setTimeout(onTimer, 1000)
			break
		}
	},
	onBackClick = function(e){
		pageWatch.setAttribute('hidden', '')
		pageSetup.removeAttribute('hidden')
	}

    pageSetup.querySelector('form.pure-form button.pure-button').addEventListener('click', onSave, false)

	for(var i=0,menus = pageSetup.querySelectorAll('.pure-menu li'),m; m=menus[i]; i++){
		m.addEventListener('click', onMenuClick, false)
	}

	for(var i=0,backs = pageWatch.querySelectorAll('.pure-menu > a'),m; m=backs[i]; i++){
		m.addEventListener('click', onBackClick, false)
	}

	window.addEventListener('resize', onResize, false)

    onLoad()
})
