const config={
    SSL_USE: false,
    key: "../ssl-cert/privkey.pem", //SSL-key file_name
    cert: "../ssl-cert/fullchain.pem", // SSL sert
    host: '127.0.0.1',
    http_port: 3000,
    ws_port: 5555,
}

const fs = require('fs');
const WebSocket = require('ws');
const http = require('http');

if (config.SSL_USE){
    const https = require('https');
    var httpsServer = https.createServer({ 
      key: fs.readFileSync(config.key, 'utf8'), 
      cert: fs.readFileSync(config.cert, 'utf8')
    });
    httpsServer.listen(config.ws_port);
  }
  var wss = new WebSocket.Server(
    config.SSL_USE?{server: httpsServer}:{port: config.ws_port}
  );


  wss.on('connection', ws => {
    console.log('connect');
    //отправлять каждые 2 сек на клиент сообщение
    let message = {msg: "Hi", date: new Date().getTime(), arr: [1,2,3] };
    setInterval(()=>{ ws.send(JSON.stringify(message)); },2000); 
    
    ws.on('close', ()=>{ console.log('disconnect'); });
    
    ws.on('message', msg => {
      try{
        msg=JSON.parse(msg);
        console.log('Received JSON:', msg);
      }catch(e){
        console.log('Received TEXT:', msg);
      }
    })
  });


const front_js = fs.readFileSync("front.js", "utf8");
const http_server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(`<html>
  <head>
    <title>websocket test</title>
    <script>
      const WS_URL = '${config.SSL_USE?'wss':'ws'}://${config.host}:${config.ws_port}'; //"ws://localhost:8080"
${front_js} 
      Connect(WS_URL);     
    </script>
  </head>
  <body>


  </body>
  </html>`);
});

http_server.listen(config.http_port, config.host, () => {
  console.log(`Server running at http://${config.host}:${config.http_port}/`);
});
