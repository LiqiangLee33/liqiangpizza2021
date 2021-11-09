const Order = require("./Order");

const OrderState = Object.freeze({
  WELCOMING: Symbol("welcoming"),
  SIZE: Symbol("size"),
  TOPPINGS: Symbol("toppings"),
  DRINKS: Symbol("drinks"),
  ICECREAM: Symbol("icecream"),
  ICECREAMSIZE: Symbol("icecreamSize"),
  WING: Symbol("wing"),
  WINGSIZE: Symbol("wingSize"),
  PAYMENT: Symbol("payment")
});
const large_p = 10;
const small_p = 5;

const icream_large = 10
const icream_small  = 5

const wing_large  = 10
const wing_small  = 5

module.exports = class ShawarmaOrder extends Order {
  constructor(sNumber, sUrl) {
    super(sNumber, sUrl);
    this.stateCur = OrderState.WELCOMING;
    this.sSize = "";
    this.sToppings = "";
    this.sIcream = "";
    this.sIcreamSize = "";
    this.sWing = "";
    this.sWingSize = "";
    this.sDrinks = "";
    this.sItem = "shawarama";
    this.aPrice = 0
  }
  handleInput(sInput) {
    let aReturn = [];
    switch (this.stateCur) {
      case OrderState.WELCOMING:
        this.stateCur = OrderState.SIZE;
        aReturn.push("Welcome to Liqiang's Tacos.");
        aReturn.push("What size would you like?");
        break;
      case OrderState.SIZE:
        console.log(sInput);
        if (sInput.toLowerCase() == "small" ||
          sInput.toLowerCase() == "large") {
          ;
          if(sInput.toLowerCase() == "small"){
            this.aPrice += small_p
          }else{
            this.aPrice += large_p
          }
          this.stateCur = OrderState.TOPPINGS
          this.sSize = sInput;
          aReturn.push("What toppings would you like?");
          break;
        }
        aReturn.push("please select large or small");
        break;
      case OrderState.TOPPINGS:
        this.stateCur = OrderState.DRINKS
        this.sToppings = sInput;
        aReturn.push("Would you like drinks with that?");
        break;
      case OrderState.DRINKS:
        this.stateCur = OrderState.ICECREAM;
        this.nOrder = 15;
        if (sInput.toLowerCase() != "no") {
          this.sDrinks = sInput;
        }
        aReturn.push("Would you like ICECREAM with that?");
        break;
      case OrderState.ICECREAM:
        this.stateCur = OrderState.ICECREAMSIZE
        this.sIcream = sInput;
        aReturn.push("Would you like ICECREAMSIZE with that?");
        break;
      case OrderState.ICECREAMSIZE:
        console.log(sInput);
        if (sInput.toLowerCase() == "small" ||
          sInput.toLowerCase() == "large") {
          ;
          if(sInput.toLowerCase() == "small"){
            this.aPrice += icream_small
          }else{
            this.aPrice += icream_large
          }
          this.stateCur = OrderState.WING
          this.sIcreamSize = sInput;
          aReturn.push("What WING would you like?");
          break;
        }
        aReturn.push("please select large or small");
        break;
      case OrderState.WING:
        this.stateCur = OrderState.WINGSIZE
        this.sWing = sInput;
        aReturn.push("Would you like WINGSIZE with that?");
        break;
      case OrderState.WINGSIZE:
        console.log(sInput);
        if (sInput.toLowerCase() == "small" ||
          sInput.toLowerCase() == "large") {
          ;
          if(sInput.toLowerCase() == "small"){
            this.aPrice += wing_small
          }else{
            this.aPrice += wing_large
          }
          this.nOrder = this.aPrice
          this.stateCur = OrderState.PAYMENT
          this.sWINGSize = sInput;
          aReturn.push("Thank-you for your order of");
          aReturn.push(`${this.sSize} ${this.sItem} with ${this.sToppings}`);
          aReturn.push(`Your price is ${this.aPrice}`);
          aReturn.push(`Please pay for your order here`);
          aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
          break;
        }
        aReturn.push("please select large or small");
        break;
      case OrderState.PAYMENT:
        console.log(sInput);
        this.isDone(true);
        let d = new Date();
        d.setMinutes(d.getMinutes() + 20);
        aReturn.push(`Your order will be delivered at 527 Blue beech Park Road Waterloo at ${d.toTimeString()}`);
        break;
    }
    return aReturn;
  }
  renderForm(sTitle = "-1", sAmount = "-1") {
    // your client id should be kept private
    if (sTitle != "-1") {
      this.sItem = sTitle;
    }
    if (sAmount != "-1") {
      this.nOrder = sAmount;
    }
    const sClientID = process.env.SB_CLIENT_ID || 'put your client id here for testing ... Make sure that you delete it before committing'
    return (`
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
        Thank you ${this.sNumber} for your ${this.sItem} order of $${this.nOrder}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nOrder}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
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
}