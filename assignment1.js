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

// Create a new express application instance

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("www"));

let oOrders = {};
app.post("/payment/:phone", (req, res) => {
  sFrom = req.params.phone;
  oOrders[sFrom].notify("thank you for your order ... notification");
  delete oOrders[sFrom];
  res.end("ok");
});

app.get("/payment/:phone", (req, res) => {
    const sFrom = req.params.phone;
    const nOrder = 15
    if(!oOrders.hasOwnProperty(sFrom)){
      res.end("order already complete");
    } else{
      sClientID = process.env.SB_CLIENT_ID || 'no client id'
      res.end(`
    <!DOCTYPE html>

    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
    </head>
    
    <body>
      <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
      <script
        src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
      </script>
      Thank you ${sFrom} for your order of $${nOrder}.
      <div id="paypal-button-container"></div>

      <script>
        paypal.Buttons({
            createOrder: function(data, actions) {
              // This function sets up the details of the transaction, including the amount and line item details.
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: '${nOrder}'
                  }
                }]
              });
            },
            onApprove: function(data, actions) {
              // This function captures the funds from the transaction.
              return actions.order.capture().then(function(details) {
                // This function shows a transaction success message to your buyer.
                $.post(".",()=>{
                  window.open("", "_self");
                  window.close(); 
                });
              });
            }
        
          }).render('#paypal-button-container');
        // This function displays Smart Payment Buttons on your web page.
      </script>
    
    </body>
        
    `);
    }
});

app.post("/sms", (req, res) =>{
    let sFrom = req.body.From || req.body.from;
    let sUrl = `${req.headers['x-forwarded-proto']|| req.protocol}://${req.headers['x-forwarded-host']||req.headers.host}${req.baseUrl}`;
    if(!oOrders.hasOwnProperty(sFrom)){
        oOrders[sFrom] = new ShwarmaOrder(sFrom);
    }
    oOrders[sFrom].setUrl(sUrl);
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
        if(!oOrders.hasOwnProperty(sFrom)){
          oOrders[sFrom] = new ShwarmaOrder(sFrom);
        }
        oOrders[sFrom].setSocket(socket);
    });
  });
  