window.addEventListener('load', function(e){
	var
    LSKey = 'emux',
	pageSetup = document.querySelector('#setup.page'),
    formSetup = pageSetup.querySelector('form.pure-form'),
	pageSettings = document.querySelector('#settings.page'),
    formSettings = pageSetup.querySelector('form.pure-form'),
	pageWatch = document.querySelector('#watch.page'),
	panelTmp = new WatchPanel(pageWatch.querySelector('#tmp.panel'), false),
	panelHmd = new WatchPanel(pageWatch.querySelector('#hmd.panel'), true),
    emuxIP='demo',
    addData = function(tmp, hmd){
        panelTmp.update(tmp)
        panelHmd.update(hmd)
    },
    onSetup = function(){
        Resource.stop()
		emuxIP = window.localStorage.getItem(LSKey)
        formSetup.ip.value = emuxIP

		pageSetup.removeAttribute('hidden')
		pageSettings.setAttribute('hidden')
		pageWatch.setAttribute('hidden', '')
    },
	onNext = function(e){
        if(!formSetup.checkValidity()) return alert('Missing required fields')
        emuxIP = formSetup.ip.value
        window.localStorage.setItem(LSKey, emuxIP)
	},
    onSave = function(e){
        if(!formSettings.checkValidity()) return alert('Missing required fields')
		var settings = []
        settings.push(formSettings.tmpMin.value)
        settings.push(formSettings.tmpMax.value)
        settings.push(formSettings.hmdMin.value)
        settings.push(formSettings.hmdMax.value)
    },
	onWatch = function(e){
		pageSetup.setAttribute('hidden', '')
		pageSettings.removeAttribute('hidden')
		pageWatch.removeAttribute('hidden')
		Resource.start(emuxIP, 1000, addData)
	},
	onResize = function(e){
		panelTmp.resize()
		panelHmd.resize()
	},
	onMenuClick = function(e){
		switch(e.target.firstChild.textContent){
		case 'Setup':
            onSetup()
			break
		case 'Settings':
            onSettings()
			break
		case 'Watch':
			onWatch()
			break
		}
	}

    pageSetup.querySelector('form.pure-form button.pure-button').addEventListener('click', onNext, false)
    pageSettings.querySelector('form.pure-form button.pure-button').addEventListener('click', onSave, false)

	for(var i=0,menus = pageSetup.querySelectorAll('.pure-menu li'),m; m=menus[i]; i++){
		m.addEventListener('click', onMenuClick, false)
	}

	window.addEventListener('resize', onResize, false)
	shortcut.add('alt-1', onSetup)

    onWatch()
})
