const express = require('express');
const bodyParser = require("body-parser");

// Create a new express application instance
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("www"));

app.post("/sms", (req, res) =>{
    let sFrom = req.body.From || req.body.from;
    let sMessage = req.body.Body|| req.body.body;
    let d = new Date(); 
    d.setMinutes(d.getMinutes() + 20);
    let aReply = [`Thank you for your order ${sFrom}`, `Please pick it up at ${d.toTimeString()}`];
    res.setHeader('content-type', 'text/xml');
    let sResponse = "<Response>";
    for(let n = 0; n < aReply.length; n++){
        sResponse += "<Message>";
        sResponse += aReply[n];
        sResponse += "</Message>";
    }
    res.end(sResponse + "</Response>");
});

var port = process.env.PORT || parseInt(process.argv.pop()) || 3002;

app.listen(port, () => console.log('Example app listening on port ' + port + '!'));
