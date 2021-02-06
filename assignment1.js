const express = require('express');
const bodyParser = require("body-parser");
const util = require('util');
const ShwarmaOrder = require("./assignment1Shwarma");

// Create a new express application instance
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("www"));

app.get("/payment/:phone", (req, res) => {
    res.end("Hello " + req.params.phone);
});

app.get("/test", (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.end(util.inspect(req));
});

let oOrders = {};
app.post("/sms", (req, res) =>{
    let sFrom = req.body.From || req.body.from;
    if(!oOrders.hasOwnProperty(sFrom)){
        let sUrl = `${req.headers['X-Forwarded-Proto']|| req.protocol}://${req.headers['X-Forwarded-Host']||req.headers.host}${req.baseUrl}`;
        oOrders[sFrom] = new ShwarmaOrder(sFrom, sUrl);
    }
    let sMessage = req.body.Body|| req.body.body;
    let aReply = oOrders[sFrom].handleInput(sMessage);
    if(oOrders[sFrom].isDone()){
        delete oOrders[sFrom];
    }
    res.setHeader('content-type', 'text/xml');
    let sResponse = "<Response>";
    for(let n = 0; n < aReply.length; n++){
        sResponse += "<Message>";
        sResponse += aReply[n];
        sResponse += "</Message>";
    }
    res.end(sResponse + "</Response>");
});

const port = process.env.PORT || parseInt(process.argv.pop()) || 3002;

app.listen(port, () => console.log('Example app listening on port ' + port + '!'));
