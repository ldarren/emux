// http://www.networktechinc.com/enviro-sems-oid.html
// http://www.networktechinc.com/enviro-16d-oid.html
var 
http = require('http'),
qs = require('querystring'),
snmp = require('snmp-native'),
file = new (require('node-static').Server)('../client'),
int_tmp =	[1,3,6,1,4,1,3699,1,1,10,1,3,1,1,6,1],
int_hmd =	[1,3,6,1,4,1,3699,1,1,10,1,3,1,1,6,2],
ro = new snmp.Session({host:process.argv[2], port:161, community:'ro'}),
rw = new snmp.Session({host:process.argv[2], port:161, community:'rw'}),
poll = function(s, cb){
console.log('polling')
	s.get({oid:int_tmp}, function(err, tmp){
		if (err) return cb(err)
		s.get({oid:int_hmd}, function(err, hmd){
			if (err) return cb(err)
			cb(null, tmp[0].value, hmd[0].value)
		})
	})
}

http.createServer(function (req, res) {
	if (-1 === req.url.indexOf('tmphmd')) file.serve(req, res)
	else poll(ro, function(err, tmp, hmd){
		if (err) {
			res.writeHead(404)
			return res.end(JSON.stringify(err))
		}
		res.writeHead(200)
		res.end(tmp.toString()+'|'+hmd);
	})
}).listen(8080)

console.log('Server is serving')
