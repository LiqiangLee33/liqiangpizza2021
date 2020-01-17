
module.exports = class OverAndUnder{
    makeANumber(){
        this.nComputer = Math.ceil(Math.random() * 100);
        this.nTries = 0;
    }
    makeAMove(sInput, fCallback){
        if(!this.nComputer){
            this.makeANumber();
            fCallback(["Welcome to Over and Unders", "Please guess a number between 1 and 100"]);
            return;
        }
        let sReturn = "";
        let nInput = 0;
        try{
            nInput = Number(sInput);
        }catch(e){
            sReturn = "Please enter a number";
        }
        this.nTries++;
        if(nInput > this.nComputer){
            sReturn = "Too High";
        }else if(nInput < this.nComputer){
            sReturn = "Too Low";
        }else{
            sReturn = "Just right (" + this.nTries + " tries)... Please guess a new number.";
            this.makeANumber();
        }
        setTimeout(() => { 
            fCallback([sReturn]); 
        }, 3000);
        
    }
}