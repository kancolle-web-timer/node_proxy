var http = require('http'),
  net = require('net'),
  httpProxy = require('http-proxy'),
  url = require('url'),
  util = require('util'),
  { gunzip, inflate } = require('zlib');

var proxy = httpProxy.createServer();

var server = http.createServer(function (req, res) {
  console.log('Receiving reverse proxy request for:' + req.url);
  var parsedUrl = url.parse(req.url);
  var target = parsedUrl.protocol + '//' + parsedUrl.hostname;
  var data = '';
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function () {
      if(!parsedUrl.pathname.match(/kcsapi/)) return;
      //console.log(data);
      dataparse(parsedUrl.pathname,data,false);
  });
  proxy.web(req, res, { target: target, secure: false });
}).listen(8000);

server.on('connect', function (req, socket) {
  console.log('Receiving reverse proxy request for:' + req.url);

  var serverUrl = url.parse('https://' + req.url);

  var srvSocket = net.connect(serverUrl.port, serverUrl.hostname, function () {
    socket.write('HTTP/1.1 200 Connection Established\r\n' +
      'Proxy-agent: Node-Proxy\r\n' +
      '\r\n');
    srvSocket.pipe(socket);
    socket.pipe(srvSocket);
  });
});

proxy.on('proxyRes', (proxyRes, req, res, options) => { 
      var data = "";
      const resDataChunks = [];
      proxyRes.on('data', function(chunk) {
          data += chunk;
	        resDataChunks.push(chunk)
      });
      proxyRes.on('end', function () {
	  console.log('Receiving reverse proxy response for:' + req.url);
	  if(!req.url.match(/kcsapi/)) return;
	        console.log(req.headers);
	        console.log(parsedata(resDataChunks,req.headers));
          //dataparse(req.url,data,true);
      });
});

async function parsedata(resDataChunks,header){
    const contentType = header['content-type'] || ''
    if (!contentType.startsWith('text') && !contentType.startsWith('application')) {
      return null
    }
    const gunzipAsync = util.promisify(gunzip)
    const inflateAsync = util.promisify(inflate)
    const resData = Buffer.concat(resDataChunks)
    const contentEncoding = header['Content-Encoding']
    const isGzip = /gzip/i.test(contentEncoding)
    const isDeflat = /deflate/i.test(contentEncoding)
    if(isGzip){
	  const unzipped = await gunzipAsync(resData).catch(() => {
          return null
        })
    }else if(isDeflat){
    const unzipped = await inflateAsync(resData).catch(() => {
          return null
        })
    }else{
      const unzipped = resData;
    }
    try {
      const str = unzipped.toString()
      const parsed = str.startsWith('svdata=') ? str.substring(7) : str
      JSON.parse(parsed)
      return parsed
    } catch (e) {
      return null
    }	
}

function dataparse(url,data,isRes){
  if(data==""){
    //console.log("no data");
    return;
  }
???if(!url.match(/kcsapi/)) return;
  data = data.split("&");
    var arraydata = {};
    arraydata["url"] = url;
    data.forEach(element=>{
      element = element.split("=");
      arraydata[element[0]] = element[1]; 
  });
 console.log(arraydata);
 switch (url) {
    //????????????
    /*
    POST /kcsapi/api_req_nyukyo/start
      api_token: token
      api_verno: 1
      api_highspeed: 0,1 ????????????
      api_ndock_id: ???????????????ID #_level1.dockIdTmp + 1
      api_ship_id: ??????????????????api_id? #_level1.nyukyo_shipid[_level1.dockIdTmp]
    */
    case "/kcsapi/api_req_nyukyo/start":

      break;
    //???????????????
    /*
    POST /kcsapi/api_req_nyukyo/speedchange
      api_token: token
      api_verno: 1
      api_ndock_id: ???????????????ID #_level1.dockIdTmp + 1
    */
    case "/kcsapi/api_req_nyukyo/speedchange":

      break;
    //????????????
    /*
    POST /kcsapi/api_req_kousyou/createship
      api_token: token
      api_verno: 1
      api_large_flag: ??????????????? (???????????????????????? ????????????1000?????????????????? ????????????????????????????????????????????????10???????????????)
      api_highspeed: ???????????? #_level1.k5use
      api_kdock_id: ???????????????ID
      api_item1: ?????????
      api_item2: ?????????
      api_item3: ??????
      api_item4: ????????????
      api_item5: ?????? 1?????? #_level1.m7
    */
    case "/kcsapi/api_req_kousyou/createship":

      break;
    //???????????????
    /*
    POST /kcsapi/api_req_kousyou/createship_speedchange
      api_token: token
      api_verno: 1
      api_highspeed: 1
      api_kdock_id: ?????????ID
    */
    case "/kcsapi/api_req_kousyou/createship_speedchange":

      break;
    //????????????
    /*
    POST /kcsapi/api_req_mission/start
      api_token: token
      api_verno: 1
      api_mission_id: ??????ID??? #_level1.SYS_mission[_level1.mid].api_id
      api_deck_id: ?????????ID #_level1.deckid + 1
    */
    case "/kcsapi/api_req_mission/start":

      break;
  } 
}

function dataSend(data) {

}
