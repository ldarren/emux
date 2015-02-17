// http://www.networktechinc.com/enviro-sems-oid.html
// http://www.networktechinc.com/enviro-16d-oid.html
var 
http = require('http'),
url = require('url'),
snmp = require('snmp-native'),
file = new (require('node-static').Server)('../client'),
int_tmp =	[1,3,6,1,4,1,3699,1,1,10,1,3,1,1,6,1],
int_hmd =	[1,3,6,1,4,1,3699,1,1,10,1,3,1,1,6,2],
ro, rw,
poll = function(s, cb){
	s.get({oid:int_tmp}, function(err, tmp){
		if (err) return cb(err)
		s.get({oid:int_hmd}, function(err, hmd){
			if (err) return cb(err)
			cb(null, tmp[0].value, hmd[0].value)
		})
	})
}

http.createServer(function (req, res) {
	var u = url.parse(req.url, true)

	switch(u.pathname){
	case '/set':
		ro = new snmp.Session({host:u.query.ip, port:161, community:'ro'})
		rw = new snmp.Session({host:u.query.ip, port:161, community:'rw'})
		res.writeHead(200)
		res.end()
		break
	case '/get':
		poll(ro, function(err, tmp, hmd){
			if (err) {
				res.writeHead(404)
				return res.end(JSON.stringify(err))
			}
			res.writeHead(200)
			res.end(tmp.toString()+'|'+hmd);
		})
		break
	default: return file.serve(req, res)
	}
}).listen(8080)

console.log('Server is serving')
