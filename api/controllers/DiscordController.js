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


      if (message.content === '!sleep' && message.author.id === '378742016265289729'){
        alive = 0;
        message.channel.send(`Chào anh chị, e đi ngủ đây, a chị ngủ sớm giữ gìn sức khoẻ`)
      } else {
        message.channel.send(`Giờ còn sớm mà ngủ gì, quẩy tí đã :D`)
      }
      if (message.content === '!wakeup' && message.author.id === '378742016265289729'){
        alive = 1;
        message.channel.send(`Chào anh chị, e đã thức dậy và đã sẵn sàng đợi lệnh :D`)
      }

      if(alive == 1){
        if (message.content === '!ping') {
          // Send "pong" to the same channel
          // console.log('message', message);
          // console.log('message', message.author.id);
          message.channel.send('pong');
        }

        if (message.content.startsWith('!gia-')){

          let getData = message.content.split('!gia-')[1];
          getData = getData.toUpperCase();
          bittrex.getticker( { market : getData }, function( data, err ) {
            if(!err){
              message.channel.send(`[${getData}] BID: ${data.result.Bid} - ASK: ${data.result.Ask} - LAST: ${data.result.Last}`);
            }
          });
        };

        if(message.content.startsWith('!candle-')){
          bittrex.getcandles({
            marketName: 'USDT-BTC',
            tickInterval: 'fiveMin', // intervals are keywords
          }, function( data, err ) {
            console.log( data );
          });
        }

        // if(message.content.startsWith('!alert-')){
        //   bittrex.getcandles({
        //     marketName: 'USDT-BTC',
        //     tickInterval: 'fiveMin', // intervals are keywords
        //   }, function( data, err ) {
        //     console.log( data );
        //   });
        // }

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

