'use strict';
 
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
    // agent.add("HHOooolllaaaa");
    agent.add("¡Hola! Que cool que nos escribas a Luka Poke House, yo puedo ayudarte a tomar tu pedido, resolver tus dudas del menu o preguntar por alguno de nuestros ingredientes especiales");
    store[orderid]=[];
    store1[orderid]=[];
    totalAmt[orderid]="";
    ordertype[orderid] = "";
  }
 
  function showBasket(agent) {
    const basket = agent.context.get('basket');
    var basketOutput1 = "";
    console.log("bdbabdbaindiandain",ordertype[orderid] = "");
    console.log("INSIDE1",store1[orderid].length,store[orderid].length);
	
    console.log(store[orderid]);
    
    // if(ordertype[orderid] === "Pizza"){
      // if(ordertype[orderid] != ""){
        if(store1[orderid].length != 0 || store[orderid].length != 0){
          console.log("INSIDE2");
          if(store[orderid].length > 0){
            console.log("INSIDE3");
            let count = 0;
            store[orderid].map(res=>{
              console.log("INSIDE4",ordertype[orderid] === "Pizza",res.type !== "Poke");
              if(res.masa && res.type !== "Poke"){
                if ((count > 0) && (count === store[orderid].length - 1)) {
                  basketOutput1 += ``;
                }
                else if (count > 0) {
                  basketOutput1 += `,\n`;
                }else{
                }
                if(res.masa){
                  basketOutput1 += `Pizza estilo ${res.type} con masa tipo ${res.masa} de tamaño ${res.size} por $${res.amount}\n`  ;
                }else{
                  basketOutput1 += `${res.type} por ${res.amount}\n`;
                }
                count++;
              }else{
                if ((count > 0) && (count === store[orderid].length - 1)) {
                  basketOutput1 += ``;
                }
                else if (count > 0) {
                  // basketOutput1 += `,\n`;
                }else{}
                if(res.toppings){
                  basketOutput1 += `Poke estilo ${res.type} con topping tipo ${res.topping} de tamaño ${res.size} por $${res.amount}\n`  ;
                }else{
                  basketOutput1 += `${res.type} por ${res.amount}\n`;
                }
                // basketOutput1 += `Poke estilo ${res.type} con topping tipo ${res.topping} de tamaño ${res.size} por $${res.amount}\n`  ;
                count++;
              }
                
            });
          }
          // console.log(basketOutput1);
          // agent.add(basketOutput1);
          console.log("INSIDE4");
          if(store1[orderid].length > 0){
            console.log("INSIDE5");
            let count1 = 0;
            store1[orderid].map(res=>{
              if ((count1 > 0) && (count1 === store1[orderid].length - 1)) {
                // basketOutput1 += `\n`;
              }
              else if (count1 > 0) {
                // basketOutput1 += `\n`;
              }else{}
              basketOutput1 += `${res.Product} tamaño ${res.SizeProduct} por $${res.TotalAmount}\n`;
              count1++;
            });

          }

          console.log(basketOutput1);
          agent.add(basketOutput1);
        }else{
            agent.add(`Aun no llevas confirmado nada en tu carrito`);
        }
      // }else{
      //   agent.add(`Aun no llevas confirmado nada en tu carrito`);
      // }
    // }
    // if(ordertype[orderid] === "Poke"){
    //   if(store1[orderid].length != 0 || store[orderid].length != 0){
    //     console.log("INSIDE2");
    //     if(store[orderid].length > 0){
    //       console.log("INSIDE3");
    //       let count = 0;
    //       store[orderid].map(res=>{
    //         if ((count > 0) && (count === store[orderid].length - 1)) {
    //           basketOutput1 += ``;
    //         }
    //         else if (count > 0) {
    //           basketOutput1 += `,\n`;
    //         }
    //         basketOutput1 += `Poke estilo ${res.type} con topping tipo ${res.topping} de tamaño ${res.size} por $${res.amount}\n`  ;
    //         count++;
    //       });
    //     }
    //     console.log("INSIDE4");
    //     /*if(store1[orderid].length > 0){
    //       console.log("INSIDE5");
    //       let count1 = 0;
    //       store1[orderid].map(res=>{
    //         if ((count1 > 0) && (count1 === store1[orderid].length - 1)) {
    //           basketOutput1 += `\n`;
    //         }
    //         else if (count1 > 0) {
    //           basketOutput1 += `\n`;
    //         }
    //         basketOutput1 += `${res.type} tamaño ${res.size} por $${res.amount}`;
    //         count1++;
    //       });

    //     }*/

    //     console.log(basketOutput1);
    //     agent.add(basketOutput1);
    //   }else{
    //       agent.add(`Aun no has confirmado ningun Poke en tu carrito 💔, recuerda que puedes iniciar a pedir eligiendo la base de tu poke`);
    //   }
    // }
    
    
    
  /*  
    if (basket && basket.parameters.items && Object.keys(basket.parameters.items).length) {
      const basketItems = basket.parameters.items,
            itemKeys = Object.keys(basketItems);

      var basketOutput = `So far you've got: `;
      for (let i = 0; i < itemKeys.length; i++) {
        let item = basketItems[itemKeys[i]];
        if ((i > 0) && (i === itemKeys.length - 1)) {
          basketOutput += ` and `;
        }
        else if (i > 0) {
          basketOutput += `, `;
        }
        basketOutput += `${item.amount} ${item.type} in ${item.size}`;
      }
      console.log(basketOutput);
      agent.add(basketOutput);
    }
    else {
      agent.add(`Aun no has confirmado ninguna pizza en tu carrito 💔, te gusta algun tipo de 🍕 en particular?`);
    }*/
  }

  function confirmItemYes(agent){
    console.log(agent.parameters);
    console.log((agent.parameters.order)[0]);
    ordertype[orderid] = "Pizza";
    agent.add("Genial, algo mas?");
    
    if((agent.parameters.order)[0] === undefined)
    store[orderid].push(agent.parameters.order);
    else{
      let data = JSON.parse(agent.parameters.order);
      data.map(res=>{
        store[orderid].push(res);
      })
    }
    
  }
  
  function confirmItem(agent) {
    
    //Axlewebtech Code
    console.log("Entered");
    ordertype[orderid] = "Pizza";
    
    const amount1 = agent.parameters.amount;
    const size1 = agent.parameters.size;
    const type1 = agent.parameters.type;
    const masa1 = agent.parameters.masa;
    let masaoriginal = "";
    
    if(agent.parameters.masa === "Masa Original"){
      masaoriginal = "Original";
    }else if(agent.parameters.masa === "Masa Sartén"){
      masaoriginal = "Handcrafted";
    }else if(agent.parameters.masa === "Masa Orilla Rellena de Queso"){
      masaoriginal = "CheeseFilling";
    }else{
      masaoriginal = "Crunchy";
    }
    
    
    //Axlewebtech Code
    console.log("Entered 2");
    console.log(agent.context.get('item'));
    const item = agent.context.get('item'),
          amount = item.parameters.amount,
          size = item.parameters.size,
          type = item.parameters.type,
          masa = item.parameters.masa,
          id = item.parameters.id || request.body.responseId;
    console.log("Entered 2.1");

    let basketContext = {'name': 'basket', 'lifespan': 50, 'parameters': {}},
        itemContext = {'name': 'item', 'lifespan': 2, 'parameters': {}},
        items = {};

    // if there already is an object of items, grab it
    console.log("Entered 3");
    if (agent.context.get('basket')) {
      items = agent.context.get('basket').parameters.items;  
    }
    // in any case, push the new item
    console.log("Entered 4");
    items[id] = {
      "type": type,
      "size": size,
      "amount": amount
    };

    //Fecthing Price from Sheet
    console.log("Entered 5");
    console.log(type1,size1);
    console.log(masaoriginal);
    return axios.get(`https://sheetdb.io/api/v1/mk96pag7idt49/search?Product=${type1}&Size=${size1}&DoughtType=${masaoriginal}&casesensitive=false`).then(res=>{
  		console.log(res.data);
     let totamount = res.data[0].Price*amount1;
      console.log(totamount);
       let orderdetails =  {
        "type": res.data[0].Product,
        "size": res.data[0].Size,
        "masa": res.data[0].DoughtType,
        "price": res.data[0].Price,
        "quantity": amount1,
        "amount": totamount
      };
    console.log(orderdetails);
    //store[orderid].push(orderdetails);
      
      
    agent.add(`Confirmo tu pedido seria ${amount1} 🍕 tipo ${type1} de tamaño ${size1} estilo ${masa1}.
    Monto individual : ${res.data[0].Price}
    Coste total : ${totamount}
    ¿Es Correcto?`);
    agent.context.set({'name':'item','lifespan':1,'parameters':{"order":orderdetails}});
	//agent.add(``);
	//agent.add(``);                                                                                                                           
	//agent.add(``); 
   
      /*
    // persist the new basket state
    console.log(JSON.stringify(items));
    basketContext.parameters.items = items;
    agent.context.set(basketContext);
    
    // add the ID to the item context, so that we can modify the item later
    itemContext.parameters.amount = amount;
    itemContext.parameters.size = size;
    itemContext.parameters.type = type;
    itemContext.parameters.id = id;
    agent.context.set(itemContext);*/
    
    //Recapitulacion de la orden para confirmacion final.
    
    //agent.add(`Confirmo tu orden, seria ${amount} 🍕 estilo ${type} de tamaño ${size}. Correcto?`);
	}).catch(err=>{
      console.log(JSON.stringify(err));
      agent.add("Sorry, no data items found related this search.");
    });
  }
  
  // delete the item id so that we don't overwrite the previous item
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
    
    //Pizza Agregada Correctamente.
    agent.add(`Genial!👌, entonces agrego a tu pedido ${amount} 🍕 estilo ${type} de tamaño ${size}. Alguna cosa mas?`);
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
	let count = 0;
    basketContext.parameters.items = basketItems;
    agent.context.set(basketContext);
    store[orderid].map(res=>{
      if(type.toLowerCase() === (res.type).toLowerCase()){
        store[orderid].splice(count,1);
      }
      count++;
    });
    let count1 = 0;
    store1[orderid].map(res=>{
      if(type.toLowerCase() === (res.type).toLowerCase()){
        store1[orderid].splice(count1,1);
      }
      count1++;
    });
    
    agent.add(`No te preocupes, acabo de quitar la pizza tipo ${type} de tu carrito 🛒`);
  }
  
  function emptyBasket() {
  	let basketContext = {'name': 'basket', 'lifespan': 0},
        itemContext = {'name': 'item', 'lifespan': 0};
    agent.context.set(basketContext);
    agent.context.set(itemContext);
    store[orderid] = [];
    store1[orderid] = [];
    agent.add(`No hay problema iniciemos de nuevo, que tipo de pizza te gustaria pedir?`);
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
Dought: ${res.masa}
Price: ${res.price}
Quantity: ${res.quantity}
Total Amount: ${res.amount}`;  
    });
    totalOrder[orderid]=str1;
    totalAmt[orderid]=totalcost;
    /*str1 = `ID: ${itemKeys[0]}
    Type: ${item.type}
    Size: ${item.size}
    Amount: ${item.amount}`;*/
    
    console.log("console.log(JSON.stringify(slackMessageBody));",`${str1} \nTotal Cost is ${totalcost}.`);
    return axios.post('https://hooks.slack.com/services/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', {
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
  
  function sendSlackMessage1(name,address,time,number) {
   /* console.log(items);
    
    var itemKeys = Object.keys(items);
    console.log(itemKeys[0]);
    //for (let i = 0; i < itemKeys.length; i++) {
        let item = items[itemKeys[0]];
        console.log(item.type);*/
    //  }
    
    let str1 = `ID => ${orderid}`;
    let pizza = 1;
    let totalcost = 0;
    
    
    if(store[orderid].length > 0){

      console.log(store[orderid]);
      store[orderid].map(res=>{
        totalcost = totalcost+res.amount;
        str1 = `${str1} 

      Pizza ${pizza++}:
      Type: ${res.type}
      Size: ${res.size}
      Dought: ${res.masa}
      Price: ${res.price}
      Quantity: ${res.quantity}
      Total Amount: ${res.amount}`;  
      });
      totalAmt[orderid]=totalcost;
    }
    
     if(store1[orderid].length > 0){
       store1[orderid].map(res=>{
        totalcost = totalcost+res.amount;
        str1 = `${str1} 

      Product ${res.product}:
      Type: ${res.type}
      Size: ${res.size}
      Price: ${res.price}
      Quantity: ${res.quantity}
      Total Amount: ${res.amount}`;  
      });
      totalAmt[orderid]=totalcost;
     }
    /*str1 = `ID: ${itemKeys[0]}
    Type: ${item.type}
    Size: ${item.size}
    Amount: ${item.amount}`;*/
    
    console.log("console.log(JSON.stringify(slackMessageBody));",`${str1} \nTotal Cost is ${totalcost}. Customer Details: \n Name: ${name},\n Address: ${address},\n Time: ${time},\n Contact: ${number}`);
     return axios.post('https://hooks.slack.com/services/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', {
        headers: 'application/json',
        text: `${str1} \nTotal Cost is ${totalcost}. Customer Details: \n Name: ${name},\n Address: ${address},\n Time: ${time},\n Contact: ${number}`
      })
      .then(function (response) {
        console.log(JSON.stringify(response));
      	store[orderid] = [];
        totalAmt[orderid] = "";
        store1[orderid] = [];
        ordertype[orderid] = "";
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
  });
    
  }
  
   
   function finishOrder(agent) {
    console.log("INSIDE");
     let totalcost = 0;
     let count = 0;
     console.log(store[orderid]);
     console.log(store1[orderid]);
     if(store[orderid].length > 0){
	
      store[orderid].map(res=>{
        totalcost = totalcost+res.amount;
      	totalAmt[orderid]=totalcost;
        console.log(totalAmt[orderid],totalcost);
        if(count === store[orderid].length-1){
          if(store1[orderid].length > 0){
            count = 0;
            store1[orderid].map(res=>{
             totalcost = totalcost+res.TotalAmount;
             totalAmt[orderid]=totalcost;
             console.log(totalAmt[orderid],totalcost);
             if(count === store1[orderid].length-1){
              console.log("FINAL",totalAmt[orderid],totalcost);
              agent.add(`Muy bien! te confirmo que ya quedo lista tu orden.  
              
El total de tu pedido es de $${totalAmt[orderid]}.  
   
*Escribe 1* para pasar a recoger tu pedido.
*Escribe 2* para envio a domicilio.`);
     
             }
             count++;
            });
          }else{
            agent.add(`Muy bien! te confirmo que ya quedo lista tu orden.  
              
El total de tu pedido es de $${totalAmt[orderid]}.  
   
*Escribe 1* para pasar a recoger tu pedido.
*Escribe 2* para envio a domicilio.`);
          }
        }
        count++;
      });
    }else{
      agent.add("Por favor, diga otro artículo para comprar.");
    }
    
     
//      console.log("FINAL",totalAmt[orderid],totalcost);
//          agent.add(`Muy bien! te confirmo que ya quedo lista tu orden.  
         
// El total de tu pedido es de $${totalAmt[orderid]}.  

// *Escribe 1* para pasar a recoger tu pedido.
// *Escribe 2* para envio a domicilio.`);




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
      });
    }
  
    else {
      agent.add(`No hay nada en tu carrito de compra aun 🛒`);
    }*/
  }
  
  function userDetailHandler(agent){
    const name = agent.parameters.name;
    const address = agent.parameters.address;
    const number = agent.parameters.number;
    const email = agent.parameters.email;
    const last_purchase = agent.parameters.last_purchase;
    
    const data = {
      "data": {"Client": `${name}`, "Address": `${address}`, "Whatsapp_number": `${number}`, "Email": `${email}`, "Last_Purache": `${last_purchase}`}
    };

    const header = {
      "content-type": "application/json"
    };

    agent.add("Su orden está completa.");
    
    return axios.post("https://sheetdb.io/api/v1/mk96pag7idt49?sheet=Client Data Base",data,{
      headers:header
    }).then( response => {
      console.log(response.data);
    }).catch(err=>{
      console.log(err);
    });
    
    
  }
  
  function sendSlackSushiMessage(name,address,time,number) {
   // let session = request.body.sessionID;
    let str1 = `ID => ${orderid}`;
    let producto = 1;
    let totalcost = 0;
    console.log(JSON.stringify(store[orderid]));
 
    store[orderid].map(res=>{
      totalcost = totalcost+res.TotalAmount;
      str1 = `${str1} 

	Número de producto ${producto++}:
    TipoDeProducto: ${res.TipoDeProducto}
    ClaveDeProducto: ${res.ClaveDeProducto}
	Product: ${res.Product}
	SizeProduct: ${res.SizeProduct}
    Price: ${res.Price}
    Quantity:${res.Quantity}
	TotalAmount:${res.TotalAmount}`;
    });
    totalAmt[orderid]=totalcost;
    console.log("console.log(JSON.stringify(slackMessageBody));",`${str1} \nTotal Cost is ${totalcost}.\n\n Customer Details: Customer Details: \n Name: ${name},\n Address: ${address},\n Time: ${time},\n Contact: ${number}`);
    return axios.post('https://hooks.slack.com/services/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', {
            headers: 'application/json',
            text: `${str1} \nTotal Cost is $${totalcost}. Customer Details: \n Name: ${name},\n Address: ${address},\n Time: ${time},\n Contact: ${number}`
          })
          .then(function (response) {
            console.log("slack message",JSON.stringify(response));
      		store[orderid] = [];
            totalAmt[orderid] = "";
            store1[orderid] = [];
            ordertype[orderid] = "";
          })
          .catch(function (error) {
            console.log("slack error",JSON.stringify(error));
     });
  }
  
  function sushimenuHandler(agent){
    let order = agent.parameters.sushi_menu;
    let quantity = agent.parameters.number;
    let size = agent.parameters.size;
    if(size === "Mediana" || (order.toLowerCase().includes("yakimeshi") && size === "Chico")){
      size = "Mediano";
    }
    console.log(order,quantity);
    // if(order.toLowerCase().includes("yakimeshi")){
    //   agent.add("Elija un tamaño (mediano o grande)");
    //   agent.context.set({'name':'yakimeshi','lifespan': 1,'parameters':{'order':`${order}`,'quantity':`${quantity}`}});
    // }else{
      return axios.get(`https://sheetdb.io/api/v1/cnou7cshabkci/search?Product=${order}&SizeProduct=${size}&casesensitive=false`).then(res=>{
  		console.log(res.data);
        let totamount = res.data[0].Price*quantity;
        console.log(totamount);
        res.data[0].Quantity = quantity;
        res.data[0].TotalAmount = totamount;
        //console.log(orderdetails);  
        // store1[orderid].push(res.data[0]);
        agent.add(`¡Excelente! 👌, serian ${totamount} pesos ${order} de tamaño ${res.data[0].SizeProduct} a tu pedido. ¿Algo más?`);
        agent.context.set({'name':'ordermore','lifespan': 1,'parameters':{'order':res.data[0]}});
      }).catch(err=>{
        agent.add("Sorry, no data items found related this search.");
      })
    // }
    
  }
  
  function yakimeshimenuHandler(agent){
    let order = agent.parameters.order;
    let quantity = agent.parameters.number;
    let size = agent.parameters.size;
      return axios.get(`https://sheetdb.io/api/v1/cnou7cshabkci/search?Product=${order}&SizeProduct=${size}&casesensitive=false`).then(res=>{
  		console.log("Yakimeshi",res.data);
        console.log(res.data[0].Price*quantity,res.data[0].Price,quantity);
        let totamount = res.data[0].Price*quantity;
        console.log("Total AMount",totamount);
        res.data[0].Quantity = quantity;
        res.data[0].TotalAmount = totamount;
        console.log(JSON.stringify(res.data[0]));
        // store[orderid].push(res.data[0]);
        agent.add(`¡Excelente! 👌, luego agrego ${totamount} producto ${order} de talla ${res.data[0].SizeProduct} a tu pedido. ¿Algo más?`);
        agent.context.set({'name':'ordermore','lifespan': 1,'parameters':{'order':res.data[0], 'yakemishi':""}});
      }).catch(err=>{
        agent.add("Sorry, no data items found related this search.");
      })
  }

  function sushiMenuYesorder(agent){
    console.log(agent.parameters);
    const order = agent.parameters.order;
    if(agent.parameters.yakemishi){
      store[orderid].push(order);
    }else{
      store1[orderid].push(order);
    }
    
    agent.add("Por favor, dime qué quieres pedir hoy.");
  }
  
  
  function sushiMenuNoorder(agent){
    ordertype[orderid] = "Sushi";
     let totalcost = 0;
     if(store[orderid].length > 0){
	
      store[orderid].map(res=>{
        totalcost = totalcost+res.amount;
      	totalAmt[orderid]=totalcost;
      });
    }
    
     if(store1[orderid].length > 0){
       store1[orderid].map(res=>{
        totalcost = totalcost+res.amount;
      	totalAmt[orderid]=totalcost;
       });
     }
    agent.add(`Muy bien! te confirmo que ya quedo lista tu orden.
Your Total amount for the given order is $${totalAmt[orderid]}.
What type of delivery do you want?
Premu 1 for "Pick & GO" 
Premu 2 for "To Your Door"`);
    //agent.add(``);
    //agent.add('');
    //agent.add(new Suggestion('Pick & Go'));
    //agent.add(new Suggestion('To your Door'));
    agent.context.set({'name':'delivery','lifespan':1,'parameters':{}});
   /* return sendSlackSushiMessage().then(res=>{
      console.log(res.data);
    }).catch(err=>{
      console.log("Error",JSON.stringify(err));
    });*/
  }

  function pickgoHandler(agent){
    agent.add(`¿Cuándo quieres el pedido?
*Premu 1* para "Lo antes posible"
*Premu 2* para "Programación de tiempo"`);
   // agent.add(new Suggestion("As soon as possible"));
   // agent.add(new Suggestion("Program Time"));
  }
  
  function sendSlackPokeMessage(name,address,time,number) {
   // let session = request.body.sessionID;
    let str1 = `ID => ${orderid}`;
    let producto = 1;
    let totalcost = 0;
    console.log(JSON.stringify(store[orderid]));
 
    store[orderid].map(res=>{
      totalcost = totalcost+res.amount;
      str1 = `${str1} 

	Número de producto ${producto++}:
    TipoDeProducto: Poke
    Tamao: ${res.size}
	Base: ${res.base}
	ToppingsEspeciales: ${res.sptopping}
    Presentacion: ${res.presentation}
    Toppings:${res.topping}
    TipoDeSalsa:${res.salsa}
    Crunch:${res.crunch}
    Proteina:${res.protein}
    Quantity:${res.quantity}
	TotalAmount:${res.amount}`;
    });
    totalAmt[orderid]=totalcost;
    console.log("console.log(JSON.stringify(slackMessageBody));",JSON.stringify(`${str1} \nTotal Cost is ${totalcost}.\n\n Customer Details: Customer Details: \n Name: ${name},\n Address: ${address},\n Time: ${time},\n Contact: ${number}`));
    return axios.post('https://hooks.slack.com/services/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', {
      headers: 'application/json',
      text: `${str1} \nTotal Cost is ${totalcost}. Customer Details: \n Name: ${name},\n Address: ${address},\n Time: ${time},\n Contact: ${number}`
    }).then(function (response) {
            console.log("slack message");
      		store[orderid] = [];
            totalAmt[orderid] = "";
            store1[orderid] = [];
            ordertype[orderid] = "";
          })
          .catch(function (error) {
            console.log("slack error",JSON.stringify(error));
     });
  }
  
  function asapHandler(agent){
    const name = agent.parameters.name;
    const number = "-";
    agent.add(`Elija su tipo de pago.
*Premu 1* para "Pagar en el local" 
*Premu 2* para "Pago en línea"`);
    //agent.add(new Suggestion('Pay in the Local'));
	//agent.add(new Suggestion('Online Payment'));
    const data = {
      "data": {"Client": `${name}`, "Address": `-`,"Email": `-` ,"Whatsapp_number": `${number}`,"Time": `As Soon As Possible` ,"Last_Purache": `${totalAmt[orderid]}`}
    };

    const header = {
      "content-type": "application/json"
    };
    
    return axios.post("https://sheetdb.io/api/v1/mk96pag7idt49?sheet=Client Data Base",data,{
      headers:header
    }).then( response => {
      let address = "-";
      let time = "-";
      console.log(response.data);
      if(ordertype[orderid] === "Pizza"){
        return sendSlackMessage1(name,address,time,number).then(res => {    
            console.log("MORE INDSIDE");    
            // reset context
          })
          .catch(err => {
          console.log(`Error al escribir en la base de Firestore: ${err}`);
        });
      }
      
      if(ordertype[orderid] === "Sushi"){
        return sendSlackSushiMessage(name,address,time,number).then(res => {    
            console.log("MORE INDSIDE");    
            // reset context
          })
          .catch(err => {
          console.log(`Error al escribir en la base de Firestore: ${err}`);
        });
      }
      
      if(ordertype[orderid] === "Poke"){
        return sendSlackPokeMessage(name,address,time,number).then(res => {    
            console.log("MORE INDSIDE");    
            // reset context
          })
          .catch(err => {
          console.log(`Error al escribir en la base de Firestore: ${err}`);
        });
      }
    }).catch(err=>{
      console.log(err);
    });
  }
  
  function programTimeHandler(agent){
    const time = agent.parameters.time;
    const name = agent.parameters.name;
    const number = agent.parameters.number;
    agent.add(`Por favor, elija su tipo de pago.
    *Premu 1* para "Pagar en local"
    *Premu 2* para "Pago en línea"`);
    //agent.add(new Suggestion('Pay in the Local'));
	//agent.add(new Suggestion('Online Payment'));
    const data = {
      "data": {"Client": `${name}`, "Address": `-`,"Email": `-` ,"Whatsapp_number": `${number}`,"Time": `${time}` ,"Last_Purache": `${totalAmt[orderid]}`}
    };

    const header = {
      "content-type": "application/json"
    };
    
    return axios.post("https://sheetdb.io/api/v1/mk96pag7idt49?sheet=Client Data Base",data,{
      headers:header
    }).then( response => {
      let address = "-";
      console.log(response.data);
      if(ordertype[orderid] === "Pizza"){
        return sendSlackMessage1(name,address,time,number).then(res => {    
            console.log("MORE INDSIDE");    
            // reset context
          })
          .catch(err => {
          console.log(`Error al escribir en la base de Firestore: ${err}`);
        });
      }
      
      if(ordertype[orderid] === "Sushi"){
        return sendSlackSushiMessage(name,address,time,number).then(res => {    
            console.log("MORE INDSIDE");    
            // reset context
          })
          .catch(err => {
          console.log(`Error al escribir en la base de Firestore: ${err}`);
        });
      }
      
      if(ordertype[orderid] === "Poke"){
        return sendSlackPokeMessage(name,address,time,number).then(res => {    
            console.log("MORE INDSIDE");    
            // reset context
          })
          .catch(err => {
          console.log(`Error al escribir en la base de Firestore: ${err}`);
        });
      }
    }).catch(err=>{
      console.log(err);
    });
  }
         
  function toYourDoorHandler(agent){
    agent.add(`Cuando quieres el pedido?
    *Premu 1* para "Lo antes posible"
    *Premu 2* para "Programación"`);
    //agent.add(new Suggestion("As soon as possible"));
    //agent.add(new Suggestion("Program Time"));
  }

  function doorAsapHandler(agent){
    const address = agent.parameters.address;
    const name = agent.parameters.name;
    const number = agent.parameters.number;
    agent.add(`Elija su tipo de pago.
    Premu 1 for "Pagar al llegar"
    Premu 2 for "Pago en línea"`);
    //agent.add(new Suggestion('Pay at Arrive'));
	//agent.add(new Suggestion('Online Payment'));
    const data = {
      "data": {"Client": `${name}`, "Address": `${address}`,"Email": `-` ,"Whatsapp_number": `${number}`,"Time": `As Soon As Possible` ,"Last_Purache": `${totalAmt[orderid]}`}
    };

    const header = {
      "content-type": "application/json"
    };
    
    return axios.post("https://sheetdb.io/api/v1/mk96pag7idt49?sheet=Client Data Base",data,{
      headers:header
    }).then( response => {
      let time = "-";
      console.log(response.data);
      if(ordertype[orderid] === "Pizza"){
        return sendSlackMessage1(name,address,time,number).then(res => {    
            console.log("MORE INDSIDE");    
            // reset context
          })
          .catch(err => {
          console.log(`Error al escribir en la base de Firestore: ${err}`);
        });
      }
      
      if(ordertype[orderid] === "Sushi"){
        return sendSlackSushiMessage(name,address,time,number).then(res => {    
            console.log("MORE INDSIDE");    
            // reset context
          })
          .catch(err => {
          console.log(`Error al escribir en la base de Firestore: ${err}`);
        });
      }
      
      if(ordertype[orderid] === "Poke"){
        return sendSlackPokeMessage(name,address,time,number).then(res => {    
            console.log("MORE INDSIDE");    
            // reset context
          })
          .catch(err => {
          console.log(`Error al escribir en la base de Firestore: ${err}`);
        });
      }
    }).catch(err=>{
      console.log(err);
    });
  }
  
  function doorProgramTimeHandler(agent){
    const address = agent.parameters.address;
    const time = agent.parameters.time;
    const name = agent.parameters.name;
    const number = agent.parameters.number;
    agent.add(`Elija su tipo de pago.
    Premu 1 for "Pagar al llegar"
    Premu 2 for "Pago en línea"`);
   // agent.add(new Suggestion('Pay at arrive'));
	//agent.add(new Suggestion('Online Payment'));
    const data = {
      "data": {"Client": `${name}`, "Address": `${address}`,"Email": `-` ,"Whatsapp_number": `${number}`,"Time": `${time}` ,"Last_Purache": `${totalAmt[orderid]}`}
    };

    const header = {
      "content-type": "application/json"
    };
    
    return axios.post("https://sheetdb.io/api/v1/mk96pag7idt49?sheet=Client Data Base",data,{
      headers:header
    }).then( response => {
      console.log(response.data);
      if(ordertype[orderid] === "Pizza"){
        return sendSlackMessage1(name,address,time,number).then(res => {    
            console.log("MORE INDSIDE");    
            // reset context
          })
          .catch(err => {
          console.log(`Error al escribir en la base de Firestore: ${err}`);
        });
      }
      
      if(ordertype[orderid] === "Sushi"){
        return sendSlackSushiMessage(name,address,time,number).then(res => {    
            console.log("MORE INDSIDE");    
            // reset context
          })
          .catch(err => {
          console.log(`Error al escribir en la base de Firestore: ${err}`);
        });
      }
      
      if(ordertype[orderid] === "Poke"){
        return sendSlackPokeMessage(name,address,time,number).then(res => {    
            console.log("MORE INDSIDE");    
            // reset context
          })
          .catch(err => {
          console.log(`Error al escribir en la base de Firestore: ${err}`);
        });
      }
      
    }).catch(err=>{
      console.log(err);
    });
  }
  
  function testHandler(agent){
    let html = encodeURI(`https://sheetdb.io/api/v1/mk96pag7idt49/search?Product=CARNES FRIAS&Size=Personal&DoughtType=Original&casesensitive=false`);
    return axios.get(`https://sheetdb.io/api/v1/mk96pag7idt49/search?Product=CARNES FRIAS&Size=Personal&DoughtType=Original&casesensitive=false`).then(res=>{
      console.log(JSON.stringify(res.data));
      agent.add(JSON.stringify(res.data));
    }).catch(err=>{
      console.log(JSON.stringify(err));
      agent.add(JSON.stringify(err));
    });
  }
  
  function onlinePaymentHandler(agent){
    
    agent.add(`Precio total del pedido : ${totalAmt[orderid]}`);
    return paymentLink().then(res=>{
      	if(res=='0'){
        	agent.add(`Problema técnico al generar el enlace de pago. Inténtelo después de algún tiempo.`);
        }
      else{
      	agent.add(`El enlace de pago está aquí : ${res.init_point}`);
      }
    	console.log('payment response--',res);
      	 
    });
    
  }
  
  function otherItemsHandler(agent){
    const item = agent.parameters.item;
    const quantity = agent.parameters.quantity;
    if(item === "Pepsi" || item === "Manzanita" || item === "7up" || item === "Mirinda"){
      agent.add("En que presentacion te gustaria, escribe de 1.5Lt o de 600ml");
      agent.context.set({'name':'itemmore','lifespan': 1,'parameters':{'item':`${item}`,"quantity":`${quantity}`}});
    }else{
      return axios.get(`https://sheetdb.io/api/v1/mk96pag7idt49/search?Product=${item}&casesensitive=false`).then(res=>{
  		console.log(res.data);
     let totamount = res.data[0].Price*quantity;
      console.log(totamount);
       let orderdetails =  {
        "type": res.data[0].Product,
        "size": res.data[0].Size,
        "price": res.data[0].Price,
        "quantity": quantity,
        "amount": totamount
      };
    console.log(orderdetails);
    // store1[orderid].push(orderdetails);
      
      
    agent.add(`Confirmo su pedido seria ${quantity} tipo ${item} de tamaño ${res.data[0].Size}.`);
	agent.add(`Monto individual : ${res.data[0].Price}`);
	agent.add(`Coste total : ${totamount}`);
	agent.add(`¿Es Correcto?`); 
    agent.context.set({'name':'item','lifespan': 1,'parameters':{'order':orderdetails,'otheritem':1}});
    agent.context.set({'name':'item-confirm','lifespan': 1,'parameters':{'items':``}});
   });
  }
  }
  
  
  function itemOtherQuantity(agent){
    console.log("Just Entered");
    console.log(agent.parameters.itemname);
    console.log(agent.parameters.quantity);
    console.log(agent.parameters.number);
    const item = agent.parameters.itemname;
    const quantity = agent.parameters.quantity;
    let number = `${agent.parameters.number}`;
    
    console.log("First Phase");
    
    if(number.includes("1.5")){
      console.log("600 mls");
      number = "1.5Lt";
      console.log("1.5 litres");
    }else{
      console.log("600 mls");
      number = "600ml";
      console.log("600 mls");
    }
    
    console.log("Entered");
      return axios.get(`https://sheetdb.io/api/v1/mk96pag7idt49/search?Product=${item}&Size=${number}&casesensitive=false`).then(res=>{
  		console.log("Inside");
        console.log(res.data);
     let totamount = res.data[0].Price*quantity;
      console.log(totamount);
       let orderdetails =  {
        "product": res.data[0].ProductType,
        "type": res.data[0].Product,
        "size": res.data[0].Size,
        "price": res.data[0].Price,
        "quantity": quantity,
        "amount": totamount
      };
    console.log(orderdetails);
    store1[orderid].push(orderdetails);
      
      
    agent.add(`Confirmo, ${quantity}  ${item} de ${res.data[0].Size}.
    Monto individual : ${res.data[0].Price}
    Coste total : ${totamount}
    ¿Es Correcto?`);
	//agent.add(`Monto individual : ${res.data[0].Price}`);
	//agent.add(`Coste total : ${totamount}`);
	//agent.add(`¿Es Correcto?`); 
   // agent.context.set({'name':'item','lifespan': 5,'parameters':{'item':`${item}`}},{'name':'item-confirm','lifespan': 1,'parameters':{'item':`${item}`}});
   });
  }
  
  
  function pokeWelcome(agent){
    agent.add("Hola bienvenido a Luka Poke House, para pedir ofrecemos dos modalidades, los pokes pre-armados de la casa y los personalizados que puedes crear a tu gusto desde la base pasando por la proteina los toppings y el crunch. Para iniciar solo elige algun poke de la casa o comienza eligiendo la base de tu poke personal");
    // store[orderid]=[];
    // store1[orderid]=[];
    // totalAmt[orderid]="";
    // ordertype[orderid] = "";
  }

  function pokeItemConfirm(agent){

    store[orderid].push(agent.parameters.order);
    agent.add("Genial, algo mas?");
  }
  
  function pokeWishMenu(agent){
    
    const pokebase = agent.parameters.pokebase;
    const size = agent.parameters.size;
    const sptoppings = agent.parameters.sptoppings;
    const presentation = agent.parameters.presentation;
    const toppings = agent.parameters.toppings;
    const salsas = agent.parameters.salsas;
    const crunch = agent.parameters.crunch;
    const protein = agent.parameters.protein;
    const amount = agent.parameters.amount;
    
    console.log(JSON.stringify(agent.parameters));
    console.log(toppings[0],toppings[1],toppings[2]);
    
    let finaltop = "";
    
    if(toppings.length === 1){
      finaltop = `${toppings[0]}`;
    }else if(toppings.length === 2){
      finaltop = `${toppings[0]}, ${toppings[1]}`;
    }else{
      finaltop = `${toppings[0]}, ${toppings[1]}, ${toppings[2]}`;
    }
    
    
    ordertype[orderid] = "Poke";
    
    console.log(`https://sheetdb.io/api/v1/mk96pag7idt49/search?Tamano=${size}&Base=${pokebase}&ToppingsEspeciales=${sptoppings}&casesensitive=false&sheet=CustomPoke`);
    return axios.get(`https://sheetdb.io/api/v1/mk96pag7idt49/search?Tamano=${size}&Base=${pokebase}&ToppingsEspeciales=${sptoppings}&casesensitive=false&sheet=CustomPoke`).then(res=>{
  	 console.log("res",res.data);
     let totamount = res.data[0].Precio*amount;
      console.log(totamount);
       let orderdetails =  {
        "type": "Poke",
        "size": res.data[0].Tamano,
        "base": res.data[0].Base,
        "sptopping": res.data[0].ToppingsEspeciales,
        "presentation": `${presentation}`,
        "topping": `${finaltop}`,
        "salsa": `${salsas}`,
        "crunch": `${crunch}`,
        "protein": `${protein}`,
        "quantity": amount,
        "amount": totamount
      };
    console.log(orderdetails);
    // store[orderid].push(orderdetails);
    
      
    agent.add(`Confirmo su pedido seria:  ${amount} poke 🍛 de tamaño ${size} base de ${pokebase}, ${protein} de proteina con ${finaltop} y ${sptoppings}, de salsa elegiste ${salsas} y de crunch ${crunch} en presentacion ${presentation}
    Monto individual : ${res.data[0].Precio}
    Costo total : ${totamount}
    ¿Es Correcto?`);
    agent.context.set({'name':'pokeitem','lifespan':1,'parameters':{"order":orderdetails}});
    }).catch(err=>{
      console.log(JSON.stringify(err));
      agent.add("Error Occurred");
    });
  }
  
  
  // Payement link generations .../*****/*
  
  function paymentLink(){
    var Mobile = String(request.body.session.split('/').slice(-1)[0]);
    return new Promise(resolve=>{
      //var axios = require('axios');
      var data = JSON.stringify({
        "items": [
          {
            "title": totalOrder[orderid],
            "description": "description",
            "quantity": 1,
            "currency_id": "MXN",
            "unit_price": totalAmt[orderid]
          }
        ],
        "notification_url":"https://hook.integromat.com/s9imiqlq2ieh5cugdipdjpwvngwuswsl",
        "external_reference" : Mobile,
        "payer": {
            "phone": {
                "number": Mobile
            }
    	}
      });

      var config = {
        method: 'post',
        url: 'https://api.mercadopago.com/checkout/preferences',
        headers: { 
          'Authorization': 'Bearer APP_USR-5002917149997697-091420-3fa8f87e5e9a4657da2a9b5c0847f919-644801109', 
          'Content-Type': 'application/json'
        },
        data : data
      };

      axios(config)
        .then(function (response) {
        console.log(JSON.stringify(response.data.sandbox_init_point));
        resolve(response.data);
        
      })
        .catch(function (error) {
        console.log(error);
        resolve(0);
      });

    });
  }
  function Payment_test(agent){
    totalOrder[orderid] = agent.parameters.Product;
    totalAmt[orderid]  = Number(agent.parameters.price);
  	agent.add(`You are testing the payment with
Order product : ${totalOrder[orderid]},
Order Price : ${totalAmt[orderid]}`);
    return paymentLink().then(res=>{
      if(res==0){
        	agent.add(`Problema técnico al generar el enlace de pago. Inténtelo después de algún tiempo.`);
        }
      else{
      	agent.add(`El enlace de pago está aquí : ${res.init_point}`);
      }
      console.log(res);
    });
  }

  function multipleDataLoop(pizzaType,pizzaSize,tipoDeMasa,number){
    let count = -1;
    let finalmessage = "";
    let finalmessageCount = 0;
    let orderDetails = [];
    console.log(pizzaType);
    return new Promise(resolve=>{
    pizzaType.map(res=>{
      // if(count === 0){
      //   console.log("COUNT",count);
      // }else{
      //   console.log("COUNT",count++);
      // }
      console.log("COUNT",count++);
      // count = count+1;
    	console.log("Entered");
      console.log(number[count],pizzaSize[count],pizzaType[count],tipoDeMasa[count]);
        //agent.add("Working");
          ordertype[orderid] = "Pizza";
       	

          let amount1 = 1;
		  if(number[count]){
            amount1 = number[count];
          }
          
          const size1 = pizzaSize[count];
          const type1 = pizzaType[count];
          const masa1 = tipoDeMasa[count];
          let masaoriginal = "";

          if(tipoDeMasa[count] === "Masa Original"){
            masaoriginal = "Original";
          }else if(tipoDeMasa[count] === "Masa Sartén"){
            masaoriginal = "Handcrafted";
          }else if(tipoDeMasa[count] === "Masa Orilla Rellena de Queso"){
            masaoriginal = "CheeseFilling";
          }else{
            masaoriginal = "Crunchy";
          }


          //Axlewebtech Code
          console.log("Entered 2");
          console.log(agent.context.get('item'));
          if(agent.context.get('item')){
            const item = agent.context.get('item'),
                  amount = item.parameters.amount,
                  size = item.parameters.size,
                  type = item.parameters.type,
                  masa = item.parameters.masa,
                  id = item.parameters.id || request.body.responseId;
          }
          console.log("Entered 2.1");

          let basketContext = {'name': 'basket', 'lifespan': 50, 'parameters': {}},
              itemContext = {'name': 'item', 'lifespan': 2, 'parameters': {}},
              items = {};

          // if there already is an object of items, grab it
          console.log("Entered 3");
          if (agent.context.get('basket')) {
            items = agent.context.get('basket').parameters.items;  
          }
          // in any case, push the new item
          console.log("Entered 4");
          /*items[id] = {
            "type": type,
            "size": size,
            "amount": amount
          };*/

          //Fecthing Price from Sheet
          console.log("Entered 5");
          console.log(type1,size1);
          console.log(masaoriginal);
          console.log(`https://sheetdb.io/api/v1/mk96pag7idt49/search?Product=${type1}&Size=${size1}&DoughtType=${masaoriginal}&casesensitive=false`);
          console.log(pizzaType.length-1,count);  
          getMultiplePizzaData(type1,size1,masaoriginal).then(res=>{
            // console.log("RES",res);
            
            let totamount = res.data[0].Price*amount1;
            console.log(totamount);
             let orderdetails =  {
              "type": res.data[0].Product,
              "size": res.data[0].Size,
              "masa": res.data[0].DoughtType,
              "price": res.data[0].Price,
              "quantity": amount1,
              "amount": totamount
            };
          console.log(orderDetails);
          orderDetails.push(orderdetails);
          //store[orderid].push(orderdetails);

		  finalmessage = finalmessage + `\nseria ${amount1} 🍕 tipo ${type1} de tamaño ${size1} estilo ${masa1}.
          Monto individual : ${res.data[0].Price}
          Coste total : ${totamount}`;
            console.log(finalmessage);
            console.log(pizzaType.length-1,count);
            finalmessageCount = finalmessageCount+1;
            if((pizzaType.length) == finalmessageCount){
              console.log("INSIDE RESOLVE");
              console.log(finalmessage);
              resolve([`Confirmo tu pedido ${finalmessage}.
               ¿Es Correcto?`,JSON.stringify(orderDetails)]);
//               agent.add(`Confirmo tu pedido ${finalmessage}.
// ¿Es Correcto?`);
            }
            
        });
        
    });
      
  });
  }
  
  function getMultiplePizzaData(type1,size1,masaoriginal){
    return new Promise(resolve=>{
      axios.get(`https://sheetdb.io/api/v1/mk96pag7idt49/search?Product=${type1}&Size=${size1}&DoughtType=${masaoriginal}&casesensitive=false`).then(res=>{
              console.log(res.data);
              resolve(res);
          	
          }).catch(err=>{
                console.log(JSON.stringify(err));
                //agent.add("Error Occurred");
          });
    });
  }
  
  function Multiple_Item_Generic(agent){
    
    let number = [];
    let pizzaType = [];
    let pizzaSize = [];
    let tipoDeMasa = [];
    let otherItem = [];
    
    
    let numberlength = 0;
    let pizzaTypelength = 0;
    let pizzaSizelength = 0;
    let tipoDeMasalength = 0;
    let otherItemlength = 0;
    
    
    if(agent.parameters.number){
      number = agent.parameters.number;
    }
    if(agent.parameters.pizzaType){
      pizzaType = agent.parameters.pizzaType;
    }
    if(agent.parameters.pizzaSize){
      pizzaSize = agent.parameters.pizzaSize;
    }
    if(agent.parameters.tipoDeMasa){
      tipoDeMasa = agent.parameters.tipoDeMasa;
    }
    if(agent.parameters.otherItem){
      otherItem = agent.parameters.OtherItem;
    }
    
    console.log(tipoDeMasa.length,pizzaSize.length,pizzaType.length);
    console.log(`${tipoDeMasa.length}` == `${pizzaSize.length}` == `${pizzaType.length}`);
    
	let count = -1;
    let finalmessage = "";
    if(`${tipoDeMasa.length}` == `${pizzaSize.length}`&& `${tipoDeMasa.length}` == `${pizzaType.length}`){
    console.log(pizzaType);
    return multipleDataLoop(pizzaType,pizzaSize,tipoDeMasa,number).then(res=>{
      console.log("RESSSSS",res);
      agent.add(res[0]);
      agent.context.set({'name':'item','lifespan':1,'parameters':{"order":res[1]}});
      agent.context.set({'name':'item-confirm','lifespan':1,'parameters':{}});
    })
//     pizzaType.map(res=>{
//       count = count+1;
//     	console.log("Entered");
//       console.log(number[count],pizzaSize[count],pizzaType[count],tipoDeMasa[count]);
//         //agent.add("Working");
//           ordertype[orderid] = "Pizza";
       	
//           let amount1 = 1;
// 		  if(number[count]){
//             amount1 = number[count];
//           }
          
//           const size1 = pizzaSize[count];
//           const type1 = pizzaType[count];
//           const masa1 = tipoDeMasa[count];
//           let masaoriginal = "";

//           if(tipoDeMasa[count] === "Masa Original"){
//             masaoriginal = "Original";
//           }else if(tipoDeMasa[count] === "Masa Sartén"){
//             masaoriginal = "Handcrafted";
//           }else if(tipoDeMasa[count] === "Masa Orilla Rellena de Queso"){
//             masaoriginal = "CheeseFilling";
//           }else{
//             masaoriginal = "Crunchy";
//           }


//           //Axlewebtech Code
//           console.log("Entered 2");
//           console.log(agent.context.get('item'));
//           if(agent.context.get('item')){
//             const item = agent.context.get('item'),
//                   amount = item.parameters.amount,
//                   size = item.parameters.size,
//                   type = item.parameters.type,
//                   masa = item.parameters.masa,
//                   id = item.parameters.id || request.body.responseId;
//           }
//           console.log("Entered 2.1");

//           let basketContext = {'name': 'basket', 'lifespan': 50, 'parameters': {}},
//               itemContext = {'name': 'item', 'lifespan': 2, 'parameters': {}},
//               items = {};

//           // if there already is an object of items, grab it
//           console.log("Entered 3");
//           if (agent.context.get('basket')) {
//             items = agent.context.get('basket').parameters.items;  
//           }
//           // in any case, push the new item
//           console.log("Entered 4");
//           /*items[id] = {
//             "type": type,
//             "size": size,
//             "amount": amount
//           };*/

//           //Fecthing Price from Sheet
//           console.log("Entered 5");
//           console.log(type1,size1);
//           console.log(masaoriginal);
//           console.log(`https://sheetdb.io/api/v1/mk96pag7idt49/search?Product=${type1}&Size=${size1}&DoughtType=${masaoriginal}&casesensitive=false`);
//           console.log(pizzaType.length-1,count);  
//         return getMultiplePizzaData(type1,size1,masaoriginal).then(res=>{
//             // console.log("RES",res);
//             let totamount = res.data[0].Price*amount1;
//             console.log(totamount);
//              let orderdetails =  {
//               "type": res.data[0].Product,
//               "size": res.data[0].Size,
//               "masa": res.data[0].DoughtType,
//               "price": res.data[0].Price,
//               "quantity": amount1,
//               "amount": totamount
//             };
//           console.log(orderdetails);
//           //store[orderid].push(orderdetails);

// 		  finalmessage = finalmessage + `seria ${amount1} 🍕 tipo ${type1} de tamaño ${size1} estilo ${masa1}.
//           Monto individual : ${res.data[0].Price}
//           Coste total : ${totamount}`;
//             console.log(finalmessage);
//             console.log(pizzaType.length-1,count);
//             if((pizzaType.length)-1 < count){
//               agent.add(`Confirmo tu pedido ${finalmessage}.
// ¿Es Correcto?`);
//               agent.context.set({'name':'item','lifespan':1,'parameters':{"order":orderdetails}});
//             }
//             count++;
//         });
        
//     });
    }else{
      agent.add("Else Case");
    }
    
  }
  
  function fallbackHandler(agent){
    let arr = [`Ups, no he entendido a que te refieres.`,`¿Podrías repetirlo, por favor?`,`¿Disculpa?`,`¿Decías?`,`¿Cómo?`];
    agent.add(arr[Math.floor((Math.random() * 5) + 1)]);
  }

  
  let intentMap = new Map();
  intentMap.set('order.showbasket', showBasket);
  intentMap.set('Default Fallback Intent',fallbackHandler);

  intentMap.set('item.confirm.yes.moreno.finishorderno', showBasket);


  intentMap.set('item.confirm.yes', confirmItemYes);
  intentMap.set('item.start.generic', confirmItem);
  intentMap.set('item.type.start.positive.yes', resetItemID);


  intentMap.set('item.confirm.yes.moreno.finishorderyes', finishOrder);

  intentMap.set('user.details',userDetailHandler);
  intentMap.set('item.remove', removeItem);
  intentMap.set('order.cancel', emptyBasket);
  intentMap.set('order.finish', finishOrder);
  intentMap.set('Default Welcome Intent',welcomeHandler);
  intentMap.set('sushiMenu',sushimenuHandler);
  intentMap.set('sushiMenu_orderMore(NO)',sushiMenuNoorder);
  intentMap.set('sushiMenu_orderMore(YES)',sushiMenuYesorder);
  intentMap.set('yakimeshi_menu',yakimeshimenuHandler);
  intentMap.set('DT1.Pick&Go',pickgoHandler);
  intentMap.set('DT1.1ASAP',asapHandler);
  intentMap.set('DT1.1ProgramTime',programTimeHandler);
  intentMap.set('DT2.ToYourDoor',toYourDoorHandler);
  intentMap.set('DT2.1ASAP',doorAsapHandler);
  intentMap.set('DT2.1ProgramTime',doorProgramTimeHandler);
  intentMap.set('DT1.1.1OnlinePayment',onlinePaymentHandler);
  intentMap.set('test',testHandler);
  intentMap.set('otherItems',otherItemsHandler);
  intentMap.set('otherItemsQuantity',itemOtherQuantity);
  intentMap.set('poke_Welcome',pokeWelcome);
  intentMap.set('poke_Wishes',pokeWishMenu);
  intentMap.set('poke.item.confirm',pokeItemConfirm);
  intentMap.set(`Payment test`,Payment_test);
  intentMap.set('Multiple Item Generic',Multiple_Item_Generic);
  agent.handleRequest(intentMap);
});