# <a href="https://github.com/rhildred/nodeAsyncGameBot" target="_blank">nodeAsyncGameBot</a>

I got the user interface for the web from a student of mine, Pat Wilken.

A chatbot written in es6 and vs6 for twilio and testing on the web. The important files are index.js and OverAndUnder.js.

This is a simple number guessing game. The difference between this and the other games is that it is asynchronous so that you can wait before sending a response. In the index we do the response in a callback:

```
    oGames[sFrom].makeAMove(sMessage, (aReply) =>{
        res.setHeader('content-type', 'text/xml');
        let sResponse = "<Response>";
        for(let n = 0; n < aReply.length; n++){
            sResponse += "<Message>";
            sResponse += aReply[n];
            sResponse += "</Message>";
        }
        res.end(sResponse + "</Response>");
    
    });


```

Then in our game we can send the response immediately:

```
    makeAMove(sInput, fCallback){
        if(!this.nComputer){
            this.makeANumber();
            fCallback(["Welcome to Over and Unders", "Please guess a number between 1 and 100"]);
            return;
        }


```
or wait and send the response later:

```
        setTimeout(() => { 
            fCallback([sReturn]); 
        }, 3000);


```
Be careful with how long you wait. There is no load on your server while waiting but messaging apps like Kik require you to answer in 5 seconds.

