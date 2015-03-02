// http://www.networktechinc.com/enviro-sems-oid.html
// http://www.networktechinc.com/enviro-16d-oid.html

const
FREQ = 3000,
VALUE = 6,
STATUS = 9,
MIN_CAP = 10,
MAX_CAP = 11

var 
http = require('http'),
url = require('url'),
snmp = require('snmp-native'),
file = new (require('node-static').Server)('../client'),
intSensors = [1,3,6,1,4,1,3699,1,1,10,1,3,1,1],
ro, rw, lastTime = Date.now(), out=[], inTmp=[], inHmd=[], pollTimer,
init = function(inputs, id){
	inputs.length = 0
	inputs.push(intSensors.slice().concat([MIN_CAP, id]))
	inputs.push(intSensors.slice().concat([MAX_CAP, id]))
	return inputs
},
config = function(ip){
	if (!ip) return false

	clearTimeout(pollTimer)
	ro = new snmp.Session({host:ip, port:161, community:'ro'})
	rw = new snmp.Session({host:ip, port:161, community:'rw'})
	poll(ro)
},
poll = function(s){
	s.getSubtree({oid:intSensors}, function(err, varBinds){
		if (err) {
			console.error(err)
		}else{
			var oid
			for(var i=0,v; v=varBinds[i]; i++){
				oid = v.oid
				switch(oid[14]){
				case VALUE: out[4 * (oid[15]-1)] = v.value; break
				case STATUS: out[5 * (oid[15]-1)] = v.value; break
				case MIN_CAP: out[6 * (oid[15]-1)] = v.value; break
				case MAX_CAP: out[7 * (oid[15]-1)] = v.value; break
				}
			}
console.log(out)
		}

		var
		now = Date.now(),
		dt = now - lastTime

		lastTime = now

		if (dt < FREQ) return pollTimer = setTimeout(poll, dt, s)
		pollTimer = setTimeout(poll, 0, s)
	})
},
writes = function(s, data){
	if (!data) return false
	data = data.split('|')
	if (4 !== data.length) return false

	rw.set({oid:inTmp[0], value:parseInt(data.shift()), type:2}, function(err){
		if (err) console.error(err)
		rw.set({oid:inHmd[0], value:parseInt(data.shift()), type:2}, function(err){
			if (err) console.error(err)
			rw.set({oid:inTmp[1], value:parseInt(data.shift()), type:2}, function(err){
				if (err) console.error(err)
				rw.set({oid:inHmd[1], value:parseInt(data.shift()), type:2}, function(err){
					if (err) console.error(err)
				})
			})
		})
	})
	return true
}

init(inTmp, 1)
init(inHmd, 2)

poll(new snmp.Session({host:'192.168.1.206', port:161, community:'ro'}))

http.createServer(function (req, res) {
	var u = url.parse(req.url, true)

	switch(u.pathname){
	case '/config':
		if (writes(u.query.data)) res.writeHead(200)
		else res.writeHead(400)
		res.end()
		break
	case '/set':
		if (writes(u.query.data)) res.writeHead(200)
		else res.writeHead(400)
		res.end()
		break
	case '/get':
		res.writeHead(200)
		res.end(out.join('|'))
		break
	default: return file.serve(req, res)
	}
}).listen(8080)

console.log('Server is serving')
