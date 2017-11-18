/**
 * DemoController
 *
 * @description :: Server-side logic for managing demoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const bittrex = require('node-bittrex-api');
  let apiBittrex = {
    'apikey' : '861555a66d3a4e0ca590ea0fee0068be',
    'apisecret' : 'c56f8d3318c1420992dc6f7e4c2fe0e9'
  }

module.exports = {
  market: async(req,res) => {
    bittrex.options(apiBittrex);
    bittrex.getmarketsummaries(( data, err )=> {
      if (err) {
        return console.error(err);
      }
      for( let i in data.result ) {
        bittrex.getticker( { market : data.result[i].MarketName },(ticker)=> {
          console.log('ticker', ticker);
        });
      }
    });
    res.send(200)
  },
  noty: async(req,res) => {
    bittrex.websockets.client(()=> {
      console.log('Websocket connected');
      bittrex.websockets.subscribe(['USDT-BCC'],(data)=> {
        console.log('Buy.M', data.A[0].Buys);
        console.log('Sell.M', data.A[0].Sells);
      });
    });
    res.send(200)
  },

  price: async(req,res) => {
    bittrex.getticker( { market : 'USDT-BTC' }, function( data, err ) {
      res.json(data)
    });
  },
};

