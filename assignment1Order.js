module.exports = class Order{
    constructor(sNumber, sUrl){
        this.sUrl = sUrl
        this.sNumber = sNumber
        this.bDone = false;
    }
    isDone(bDone){
        if(bDone){
            this.bDone = bDone;
        }
        return this.bDone;
    }
}