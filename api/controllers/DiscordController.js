/**
 * DemoController
 *
 * @description :: Server-side logic for managing demoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

import sumby from 'lodash.sumby';
// Import the discord.js module
const Discord = require('discord.js');
// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'MzgxMDkzNTc2NzMxNTI1MTQ0.DPCJ7Q.mOow-zd21OW74IYeRxNBN2vmO6E';

const bittrex = require('node-bittrex-api');
let apiBittrex = {
  'apikey' : '861555a66d3a4e0ca590ea0fee0068be',
  'apisecret' : 'c56f8d3318c1420992dc6f7e4c2fe0e9'
}
let alive = 1;
let alert = 0;


module.exports = {
  index: async(req,res) => {
    /*
     A ping pong bot, whenever you send "ping", it replies "pong".
     */

// Create an instance of a Discord client
    const client = new Discord.Client();


// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
    client.on('ready', () => {
      console.log('I am ready!');
    });

// Create an event listener for messages
    client.on('message', message => {

      // If the message is "ping"

      if(message.content.startsWith('!alert-') && message.author.id === '378742016265289729'){

        let getData = `${message.content.split('-')[1]}-${message.content.split('-')[2]}`;
        let alertValue = message.content.split('-')[3];
        alertValue = parseFloat(alertValue);
        alert = 1;
        getData = getData.toUpperCase();
        console.log('alertValue', alertValue);
        message.channel.send(`[SET ALERT - ${getData} - ${alertValue}]`);
        bittrex.websockets.listen((data, client)=> {
          if (data.M === 'updateSummaryState') {
            data.A.forEach((data_for) =>{
              data_for.Deltas.forEach((marketsDelta) => {
                if(marketsDelta.MarketName == getData && marketsDelta.Last >= alertValue && alert == 1){
                  console.log(`now: ${marketsDelta.Last}`);
                  message.channel.send(`[ALERT ${getData}] - NOW: ${marketsDelta.Last}`);
                  alert = 0;
                }
              });
            });
          }
        });
      }

      if (message.content === '!sleep' && message.author.id === '378742016265289729'){
        alive = 0;
        message.channel.send(`Chào anh chị, e đi ngủ đây, a chị ngủ sớm giữ gìn sức khoẻ`)
      }
      if (message.content === '!wakeup' && message.author.id === '378742016265289729'){
        alive = 1;
        message.channel.send(`Chào anh chị, e đã thức dậy và đã sẵn sàng đợi lệnh :D`)
      }

      if(alive == 1){
        if (message.content === '!ping') {
          message.channel.send('pong');
        }

        if (message.content.startsWith('!gia-')){
          let getData = message.content.split('!gia-')[1];
          getData = getData.toUpperCase();
          bittrex.getticker( { market : getData }, (data, err) => {
            if(!err){
              message.channel.send(`[${getData}] BID: ${data.result.Bid} - ASK: ${data.result.Ask} - LAST: ${data.result.Last}`);
            }
          });
        };

        if(message.content.startsWith('!candle-')){
          bittrex.getcandles({
            marketName: 'USDT-BTC',
            tickInterval: 1800, // intervals are keywords
          }, ( data, err ) => {
            console.log(data);
          });
        }

        if(message.content.startsWith('!vol-')){
          let getData = message.content.split('!vol-')[1];
          getData = getData.toUpperCase();
          bittrex.getmarkethistory({ market : getData }, async( data, err )=> {
            console.log( data );
            let getBuy = [];
            let getSell = [];
            await Promise.all(
              data.result.map((item)=>{
                if(item.OrderType === 'BUY'){
                  getBuy.push(item)
                } else if (item.OrderType === 'SELL') {
                  getSell.push(item)
                }
              })
            )
            let sumBuyQuantity = sumby(getBuy, (b) => { return b.Quantity; });
            let sumSellQuantity = sumby(getSell, (s) => { return s.Quantity; });
            let sumBuyTotal = sumby(getBuy, (b) => { return b.Total; });
            let sumSellTotal = sumby(getSell, (s) => { return s.Total; });
            console.log('sumBuyQuantity', sumBuyQuantity);
            console.log('sumSellQuantity', sumSellQuantity);
            console.log('sumBuyTotal', sumBuyTotal);
            console.log('sumSellTotal', sumSellTotal);
            message.channel.send(`[BUY ${getData}] - Quantity:${sumBuyQuantity} - Total:${sumBuyTotal}`);
            message.channel.send(`[SELL ${getData}] - Quantity:${sumSellQuantity} - Total:${sumSellTotal}`);
          });
        }

        if(message.content.startsWith('!wall-')){
          let wallvalue = 800;
          let getData = message.content.split('!wall-')[1];
          getData = getData.toUpperCase();
          if(getData == 'USDT-ETH' || getData == 'USDT-DASH' || getData == 'USDT-ZEC' || getData == 'USDT-XMR'){
            wallvalue = 300;
          } else if(getData == 'USDT-BCC'){
            wallvalue = 200;
          } else if(getData == 'USDT-BTC' || getData == 'BTC-BCC'){
            wallvalue = 100;
          }
          bittrex.getorderbook({ market : getData, depth : 10, type : 'both' }, async( data, err )=> {
            // res.json(data);
            let wallBuy = [];
            let wallSell = [];
            console.log('data.result', data.result);
            await Promise.all(
              data.result.buy.map((itembuy)=>{
                if(itembuy.Quantity>wallvalue){
                  wallBuy.push(itembuy);
                }
              })
            );
            await Promise.all(
              data.result.sell.map((itemsell)=>{
                if(itemsell.Quantity>wallvalue){
                  wallSell.push(itemsell);
                }
              })
            );

            message.channel.send(`[${getData}] - Buy Wall: ${wallBuy[0].Quantity}, Rate: ${wallBuy[0].Rate}`);
            message.channel.send(`[${getData}] - Sell Wall: ${wallSell[0].Quantity}, Rate: ${wallSell[0].Rate}`)

          });
        }
      }

    });


    //get ticker

    client.on('disconnect', () =>{
      // message.channel.send('im disconnected')
    })

// Log our bot in
    client.login(token);
  }
};

