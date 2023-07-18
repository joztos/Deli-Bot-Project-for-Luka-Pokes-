const functions = require('firebase-functions');
const {WebhookClient,Suggestion} = require('dialogflow-fulfillment');
const requestLib = require('request');
const axios = require('axios');
const {uuid} = require('uuidv4');
let totalOrder=[];
var store = [];
var store1 = [];
var totalAmt = [];
var orderid = uuid();
var ordertype = [];
totalOrder[orderid]="";
store[orderid] = [];
totalAmt[orderid] = "";
store1[orderid] = [];
ordertype[orderid] = "";

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
const agent = new WebhookClient({ request, response });

const sessionId = request.body.session.split("/").reverse()[0];

console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

function welcomeHandler(agent){
agent.add("¡Hola! ¿En qué puedo ayudarte hoy?");
}

function showBasket(agent) {
const basket = agent.context.get('basket');

if (basket && basket.parameters.items && Object.keys(basket.parameters.items).length) {
    const basketItems = basket.parameters.items,
          itemKeys = Object.keys(basketItems);
  
    var basketOutput = `Tienes los siguientes productos añadidos al carrito: `;
    for (let i = 0; i < itemKeys.length; i++) {
      let item = basketItems[itemKeys[i]];
      if ((i > 0) && (i === itemKeys.length - 1)) {
        basketOutput += ` y `;
      }
      else if (i > 0) {
        basketOutput += `, `;
      }
      basketOutput += `${item.amount} ${item.type} en ${item.size}`;
    }
    agent.add(basketOutput);
  }
  else {
    agent.add(`No tienes ningún producto añadido al carrito.`);
  }

}

function confirmItem(agent) {
const item = agent.parameters,
amount = item.amount,
size = item.size,
type = item.type,
id = item.id || request.body.responseId;
  
let basketContext = {'name': 'basket', 'lifespan': 50, 'parameters': {}},
    itemContext = {'name': 'item', 'lifespan': 2, 'parameters': {}},
    items = {};

// if there already is an object of items, grab it
if (agent.context.get('basket')) {
  items = agent.context.get('basket').parameters.items;  
}
// in any case, push the new item
items[id] = {
  "type": type,
  "size": size,
  "amount": amount
};

//Fecthing Price from Sheet
axios.get(`https://sheetdb.io/api/v1/7fmof6opwp9y1`).then(res=>{
	let totamount = res.data[0].Price*amount;
  	let orderdetails =  {
    	"type": res.data[0].Product,
    	"size": res.data[0].Size,
    	"amount": totamount
  	};
	console.log(orderdetails);
	store[orderid].push(orderdetails);
  
  agent.add(`Confirmo tu orden, sería ${amount} 🍕 estilo ${type} de tamaño ${size}. ¿Es Correcto?`);
  agent.context.set(basketContext);
  agent.context.set(itemContext);
});
}

function resetItemID(agent) {
const item = agent.context.get('item'),
amount = item.parameters.amount,
size = item.parameters.size,
type = item.parameters.type;

let itemContext = {'name': 'item', 'lifespan': 2, 'parameters': {}};
itemContext.parameters.amount = amount;
itemContext.parameters.size = size;
itemContext.parameters.type = type;
itemContext.parameters.id = '';
agent.context.set(itemContext);

agent.add(`Perfecto, agrego ${amount} 🍕 estilo ${type} de tamaño ${size}. ¿Que más necesitas?`);

}

function removeItem(agent) {
const type = agent.parameters.type;

let basketContext = {'name': 'basket', 'lifespan': 50, 'parameters': {}},
    basketItems = {};

if (agent.context.get('basket')) {
  basketItems = agent.context.get('basket').parameters.items;
}
let itemKeys = Object.keys(basketItems);
for (let i = 0; i < itemKeys.length; i++) {
  let item = basketItems[itemKeys[i]];
  if (item.type === type) {
    delete basketItems[itemKeys[i]];
  }
}

basketContext.parameters.items = basketItems;
agent.context.set(basketContext);

agent.add(`He eliminado una 🍕 de tu carrito.`)

}

function emptyBasket() {
let basketContext = {'name': 'basket', 'lifespan': 0},
itemContext = {'name': 'item', 'lifespan': 0};
agent.context.set(basketContext);
agent.context.set(itemContext);

agent.add(`He eliminado todos los productos de tu carrito.`)

}

function sendSlackMessage(items) {
console.log(items);



var itemKeys = Object.keys(items);
console.log(itemKeys[0]);
//for (let i = 0; i < itemKeys.length; i++) {
    let item = items[itemKeys[0]];
    console.log(item.type);
//  }
let str1 = `ID => ${itemKeys[0]}`;
let pizza = 1;
let totalcost = 0;

store[orderid].map(res=>{
  totalcost = totalcost+res.amount;
  str1 = `${str1} 
  Pizza ${pizza++}:
  Type: ${res.type}
  Size: ${res.size}
  Price: ${res.amount}; }); totalOrder[orderid]=str1; totalAmt[orderid]=totalcost; /*str1 = ID: ${itemKeys[0]}
  Type: ${item.type}
  Size: ${item.size}
  Amount: ${item.amount}`;*/

  console.log("console.log(JSON.stringify(slackMessageBody));",`${str1} \nTotal Cost is ${totalcost}.`);
return axios.post('https://hooks.slack.com/services/XXXXXXXXXXXXXXXXXXX', {
        headers: 'application/json',
        text: `${str1} \nTotal Cost is ${totalcost}.`
      })
      .then(function (response) {
        console.log(JSON.stringify(response));
  		store[orderid]=[];
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
 });
 
}

function finishOrder(agent) {
let totalcost = 0;
let count = 0;
console.log(store[orderid]);
console.log("INSIDE");
store[orderid].map(res=>{
totalcost = totalcost+res.amount;
console.log(totalAmt[orderid],totalcost);
if(count === store[orderid].length-1){
console.log("INSIDE");
totalAmt[orderid]=totalcost;
agent.add(Tu ordenestá completa. Tienes los siguientes productos añadidos al carrito: ${totalOrder[orderid]} Total Costo : ${totalAmt[orderid]}$.);
console.log("FINAL",totalAmt[orderid],totalcost);

}
count++;
console.log("Counter Value",count)
console.log("INSIDE",totalAmt[orderid],totalcost);
});

/* console.log("FINAL",totalAmt[orderid],totalcost);
       agent.add(`Tu ordenestá completa.

       Tienes los siguientes productos añadidos al carrito: ${totalOrder[orderid]}
Total Costo : ${totalAmt[orderid]}$.`);*/

//Agent 
agent.context.clear();
store[orderid] = [];

console.log("INSIDE");
console.log(JSON.stringify(agent.context));
   	 // agent.add(`El total de tu pedido seria por $${totalAmt[orderid]}.`);
     // agent.add('Te gustaria que te enviemos a la puerta de tu casa el pedido o prefieres pasar por el al local?');
     // agent.add(new Suggestion('Pick & Go'));
     // agent.add(new Suggestion('To your Door'));
      agent.context.set({'name':'delivery','lifespan':1,'parameters':{}});


      //agent.add("Order Booked");
/* if (agent.context.get('basket')) {


    agent.add(`Por la presente declaro que tu orden a sido completa!`);

const items = agent.context.get('basket').parameters.items,

refDoc = db.collection('orders').doc(sessionId).set(items,{ merge: true });
  
//console.log("Items",agent.context.get('basket'));  



// sendSlackMessage(items);
return sendSlackMessage(items).then(res => {
console.log("MORE INDSIDE");
let basketContext = {'name': 'basket', 'lifespan': 0},
itemContext = {'name': 'item', 'lifespan': 0};


      // reset contexts
  
      agent.context.set(basketContext);
      agent.context.set(itemContext);
    })
    .catch(err => {
    console.log(`Error al escribir en la base de Firestore: ${err}`);

    console.log(agent.getContext('item'));
  
  });
  
  //Empty Order Store
  
  
}

else {
  agent.add(`No hay nada en tu carrito de compra aun 🛒`);
}*/

}

let intentMap = new Map();
intentMap.set('order.showbasket', showBasket);
intentMap.set('Default Fallback Intent',fallbackHandler);

intentMap.set('item.confirm.yes', confirmItem);
intentMap.set('item.start.generic', confirmItem);
intentMap.set('item.type.start.positive.yes', resetItemID);

intentMap.set('item.confirm.yes.moreno.finishorderno', showBasket);
intentMap.set('item.preconfirmation.yes',finishOrder);

intentMap.set('user.details',userDetailHandler);
intentMap.set('item.remove', removeItem);
intentMap.set('order.cancel', emptyBasket);
intentMap.set('order.finish', finishOrder);
intentMap.set('Default Welcome Intent',welcomeHandler);

agent.handleRequest(intentMap);
});
