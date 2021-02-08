const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const _ = require('underscore');

const port = process.env.PORT || parseInt(process.argv.pop()) || 3002;

server.listen(port, function(){
    console.log("Server listening at port %d", port);
});

const ShwarmaOrder = require("./assignment1Shwarma");
const e = require('express');
const { exception } = require('console');

// Create a new express application instance

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("www"));

let oSockets = {};
let oOrders = {};
app.post("/payment/:phone", (req, res) => {
  sFrom = req.params.phone;
  const aReply = oOrders[sFrom].handleInput("thank you for your order ... notification");
  const oSocket = oSockets[sFrom];
  for(let n = 0; n < aReply.length; n++){
    if(oSocket){
      const data = {
        message: aReply[n]
      };
    oSocket.emit('receive message', data);
}else{
      throw new Exception("twilio code would go here");
    }
  }
  if(oOrders[sFrom].isDone()){
    delete oOrders[sFrom];
  }
  res.end("ok");
});

app.get("/payment/:phone", (req, res) => {
    const sFrom = req.params.phone;
    if(!oOrders.hasOwnProperty(sFrom)){
      res.end("order already complete");
    } else{
      res.end(oOrders[sFrom].renderForm());
    }
});

app.post("/sms", (req, res) =>{
    let sFrom = req.body.From || req.body.from;
    let sUrl = `${req.headers['x-forwarded-proto']|| req.protocol}://${req.headers['x-forwarded-host']||req.headers.host}${req.baseUrl}`;
    if(!oOrders.hasOwnProperty(sFrom)){
        oOrders[sFrom] = new ShwarmaOrder(sFrom, sUrl);
    }
    if(oOrders[sFrom].isDone()){
      delete oOrders[sFrom];
    }
    let sMessage = req.body.Body|| req.body.body;
    let aReply = oOrders[sFrom].handleInput(sMessage);
    res.setHeader('content-type', 'text/xml');
    let sResponse = "<Response>";
    for(let n = 0; n < aReply.length; n++){
        sResponse += "<Message>";
        sResponse += aReply[n];
        sResponse += "</Message>";
    }
    res.end(sResponse + "</Response>");
});

io.on('connection', function (socket) {
    // when the client emits 'receive message', this listens and executes
    socket.on('receive message', function (data) {
        const sFrom = _.escape(data.from);
        oSockets[sFrom] = socket;
    });
  });
  