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
    addData = function(tmp, hmd){
        panelTmp.update.apply(panelTmp, tmp)
        panelHmd.update.apply(panelHmd, hmd)
    },
    onSetup = function(){
        Resource.stop()
        formSetup.ip.value = window.localStorage.getItem(LSKey) || 'demo'

		pageSetup.removeAttribute('hidden')
		pageSettings.setAttribute('hidden', '')
		pageWatch.setAttribute('hidden', '')
    },
	onNext = function(e){
        if(!formSetup.checkValidity()) return alert('Missing required fields')
        var ip = formSetup.ip.value
        window.localStorage.setItem(LSKey, ip)
		Resource.start(ip, 1000, function(tmp, hmd){
            formSettings.tmpMin.value = tmp[2]
            formSettings.tmpMax.value = tmp[3]
            formSettings.hmdMin.value = hmd[2]
            formSettings.hmdMax.value = hmd[3]
            addData(tmp, hmd)
            Resource.callback = addData

            pageSetup.setAttribute('hidden', '')
            pageSettings.removeAttribute('hidden')
            pageWatch.setAttribute('hidden', '')
        })
	},
    onSave = function(e){
        if(!formSettings.checkValidity()) return alert('Missing required fields')
		var settings = []
        settings.push(formSettings.tmpMin.value)
        settings.push(formSettings.hmdMin.value)
        settings.push(formSettings.tmpMax.value)
        settings.push(formSettings.hmdMax.value)
        Resource.set(settings, function(){})
    },
	onWatch = function(e){
		pageSetup.setAttribute('hidden', '')
		pageSettings.setAttribute('hidden', '')
		pageWatch.removeAttribute('hidden')
	}

    pageSetup.querySelector('form.pure-form button.pure-button').addEventListener('click', onNext, false)
    pageSettings.querySelector('form.pure-form button.pure-button-primary').addEventListener('click', onSave, false)
    pageSettings.querySelector('form.pure-form button.pure-button-positive').addEventListener('click', onWatch, false)

	shortcut.add('alt-1', onSetup)

    Resource.start(window.localStorage.getItem(LSKey) || 'demo', 1000, addData)
    onWatch()
})
