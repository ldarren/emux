function WatchPanel(ele, greaterOK){
    this.ele = ele
    this.billb = ele.querySelector('.billb')
	this.greaterOK = greaterOK

    var
    chart = new SmoothieChart({interpolation:'linear',grid:{verticalSections:10},maxValue:100,minValue:0}),
    cur = new TimeSeries(),
    cap = new TimeSeries()

	this.resize()

    chart.addTimeSeries(cur, {lineWidth:2,strokeStyle:'#00ff00',fillStyle:'rgba(0,255,0,0.3)'})
    chart.addTimeSeries(cap, {lineWidth:2,strokeStyle:'#0000ff',fillStyle:'rgba(0,0,255,0.3)'})
    chart.streamTo(ele.querySelector('.chart'), 1000)

    this.chart = chart
    this.cur = cur
    this.cap = cap
    this.capVal = 0
}

WatchPanel.prototype = {
    setThreshold: function(cap){
        this.capVal = cap
    },
    plot: function(time, cur, unit){
		var
		cl = this.ele.classList,
		cn
		if (this.greaterOK){
			if (cur < this.capVal) cn = 'panelKO'
			else cn = 'panelOK'
		}else{
			if (cur > this.capVal) cn = 'panelKO'
			else cn = 'panelOK'
		}
		if (!cl.contains(cn)){
			cl.remove('panelOK')
			cl.remove('panelKO')
			cl.add(cn)
		}
        this.billb.textContent = cur + ' ' + unit
        this.cur.append(time, cur)
        this.cap.append(time, this.capVal)
    },
	resize: function(){
    	this.ele.querySelector('.chart').width = window.innerWidth / 2
	}
}
