const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    DRINKS:  Symbol("drinks")
});

module.exports = class Order{
    constructor(){
        this.stateCur = OrderState.WELCOMING;
        this.orderItems = [];
    }
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.orderItems.push(sInput)
                aReturn.push("Would you like drinks with that?");
                this.stateCur = OrderState.DRINKS;
                break;
            case OrderState.DRINKS:
                if(sInput.toLowerCase != "no"){
                    this.orderItems.push(sInput);
                }
                aReturn.push("Thank-you for your order of");
                aReturn.push(this.orderItems);
                let d = new Date(); 
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Please pick it up at ${d.toTimeString()}`);
                break;
        }
        return aReturn;
    }
}