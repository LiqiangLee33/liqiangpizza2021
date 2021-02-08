module.exports = class Order{
    constructor(sNumber){
        this.sNumber = sNumber
        this.bDone = false;
    }
    isDone(bDone){
        if(bDone){
            this.bDone = bDone;
        }
        return this.bDone;
    }
    setSocket(oSocket){
        this.oSocket = oSocket;
    }
    setUrl(sUrl){
        this.sUrl = sUrl
    }
    notify(sMessage){
        const data = {
            message: sMessage
        };
        this.oSocket.emit('receive message', data);

    }
}