const GameState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    FLAT:  Symbol("flat"),
    WAIT: Symbol("wait"),
    MANSION: Symbol("mansion")
});

export default class Game{
    constructor(){
        this.stateCur = GameState.WELCOMING;
    }
    
    makeAMove(sInput)
    {
        let sReply = "It is a dark and rainy night. Bang! You have a flat tire. Too bad you don't have a spare. Do you wait or go to the spooky mansion for help?";
        switch(this.stateCur){
            case GameState.WELCOMING:
                this.stateCur = GameState.FLAT;
                break;
            case GameState.FLAT:
                if(sInput.toLowerCase().match("wait")){
                    sReply = "The road is deserted. After 1 hour there is still no help. Do you keep Waiting or do you go to the house?";
                }else{
                    sReply ="On the door is a large knocker. Do you knock or run back to your car to wait?";
                    this.stateCur = GameState.MANSION;
                }
                this.stateCur = GameState.FLAT;
                break;
        }
        return(sReply);
    }
}