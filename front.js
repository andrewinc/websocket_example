let ws=null;
function Connect(url){
    var sock= new WebSocket(url);
    
    sock.onopen = () => {//sock.send('hey') 
      ws = sock;
      sock.send(JSON.stringify({client_say:'I am conected', d: new Date().toLocaleTimeString()}));
    }
    
    sock.onclose = function(event) {
      //console.log('Код: ' + event.code + ' причина: ', event.reason, event);
      setTimeout(function(){
        console.log('try reconnect');
        Connect(url);
      },5000);
    };
    
    sock.onerror = (error) => { console.log('WebSocket error:', error); }
    
    sock.onmessage = (e) => {
      //console.log(e);  
      var json=null,text=null;
      try{json=JSON.parse(e.data);}catch(ex){text=e.data;}
      if (null!==json){ 
        console.log('JSON: ', json); 
        
      }else {
        console.log('TEXT: ',text);
      }
    }
  }


  //ws.send(JSON.stringify({x:'sdsdfsdfsd'}))
