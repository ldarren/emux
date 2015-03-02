var states = ['NOTCONNECTED', 'NORMAL', 'PREALERT', 'ALERT', 'ACKNOWLEDGED', 'DISMISSED', 'DISCONNECTED']

function WatchPanel(ele, greaterOK){
    this.ele = ele
    this.billb = ele.querySelector('.billb span')
    this.stateb = ele.querySelector('.status')
	this.greaterOK = greaterOK
}

WatchPanel.prototype = {
    update: function(cur, state, min, max){
		var cl = this.ele.classList, cn

		if (this.greaterOK){
			if (cur < min) cn = 'panelOver'
			else if (cur > max) cn = 'panelUnder'
			else cn = 'panelOK'
		}else{
			if (cur < min) cn = 'panelUnder'
			else if (cur > max) cn = 'panelOver'
			else cn = 'panelOK'
		}
		if (!cl.contains(cn)){
			cl.remove('panelOK')
			cl.remove('panelOver')
			cl.remove('panelUnder')
			cl.add(cn)
		}
        this.billb.textContent = cur
        this.stateb.textContent = states[state]
	}
}
