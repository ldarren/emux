window.addEventListener('load', function(e){
	var
	pageSetup = document.querySelector('#setup.page'),
	pageWatch = document.querySelector('#watch.page'),
	panelTmp = pageWatch.querySelector('#tmp.panel'),
	panelHmd = pageWatch.querySelector('#hmd.panel'),
	menus = pageSetup.querySelectorAll('.pure-menu li'),
	backs = pageWatch.querySelectorAll('.pure-menu > a'),
	onMenuClick = function(e){
		switch(e.target.firstChild.textContent){
		case 'Setup':
			pageWatch.setAttribute('hidden')
			pageSetup.removeAttribute('hidden')
			break
		case 'Watch':
			pageSetup.setAttribute('hidden')
			pageWatch.removeAttribute('hidden')
			break
		}
	},
	onBackClick = function(e){
		pageWatch.setAttribute('hidden')
		pageSetup.removeAttribute('hidden')
	}

	for(var i=0,m; m=menus[i]; i++){
		m.addEventListener('click', onMenuClick, false)
	}

	for(var i=0,m; m=backs[i]; i++){
		m.addEventListener('click', onBackClick, false)
	}
})
