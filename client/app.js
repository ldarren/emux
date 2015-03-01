window.addEventListener('load', function(e){
	var
    LSKey = 'emux',
	pageSetup = document.querySelector('#setup.page'),
    formSetup = pageSetup.querySelector('form.pure-form'),
	pageWatch = document.querySelector('#watch.page'),
	panelTmp = new WatchPanel(pageWatch.querySelector('#tmp.panel'), false),
	panelHmd = new WatchPanel(pageWatch.querySelector('#hmd.panel'), true),
    emuxIP='demo', tmpCap=20, hmdCap=20
    addData = function(tmp, hmd){
        panelTmp.update(tmp)
        panelHmd.update(hmd)
    },
    onSave = function(e){
        if(!formSetup.checkValidity()) return alert('Missing required fields')
        emuxIP = formSetup.ip.value
        tmpCap = parseInt(formSetup.tmpCap.value)
        hmdCap = parseInt(formSetup.hmdCap.value)
        window.localStorage.setItem(LSKey, JSON.stringify({ip:emuxIP, tmpCap:tmpCap, hmdCap:hmdCap}))
    },
    onLoad = function(){
        Resource.stop()
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

		pageWatch.setAttribute('hidden', '')
		pageSetup.removeAttribute('hidden')
    },
	onResize = function(e){
		panelTmp.resize()
		panelHmd.resize()
	},
	onMenuClick = function(e){
		switch(e.target.firstChild.textContent){
		case 'Setup':
            onLoad()
			break
		case 'Watch':
            panelTmp.setThreshold(tmpCap)
            panelHmd.setThreshold(hmdCap)
			pageSetup.setAttribute('hidden', '')
			pageWatch.removeAttribute('hidden')
            Resource.start(emuxIP, 1000, addData)
			break
		}
	},
	onBackClick = function(e){
		onLoad()
	}

    pageSetup.querySelector('form.pure-form button.pure-button').addEventListener('click', onSave, false)

	for(var i=0,menus = pageSetup.querySelectorAll('.pure-menu li'),m; m=menus[i]; i++){
		m.addEventListener('click', onMenuClick, false)
	}

	window.addEventListener('resize', onResize, false)
	shortcut.add('alt-1', onBackClick)

    onLoad()
})
