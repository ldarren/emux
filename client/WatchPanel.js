function WatchPanel(ele){
    this.ele = ele
    this.billb = ele.querySelector('.billb')

    var
    cvs = ele.querySelector('.chart'),
    chart = new SmoothieChart({interpolation:'linear',grid:{verticalSections:10},maxValue:100,minValue:0}),
    cur = new TimeSeries(),
    cap = new TimeSeries()

    cvs.width = window.innerWidth / 2

    chart.addTimeSeries(cur, {lineWidth:2,strokeStyle:'#00ff00',fillStyle:'rgba(0,255,0,0.3)'})
    chart.addTimeSeries(cap, {lineWidth:2,strokeStyle:'#0000ff',fillStyle:'rgba(0,0,255,0.3)'})
    chart.streamTo(cvs, 1000)

    this.chart = chart
    this.cur = cur
    this.cap = cap
    this.capVal = 0
}

WatchPanel.prototype = {
    setThreshold: function(cap){
        this.capVal = cap
    },
    plot: function(time, cur){
        this.billb.textContent = cur
        this.cur.append(time, cur)
        this.cap.append(time, this.capVal)
    }
}
