/**
 * Facebook for Node
 *
 * @Author      :: Kingasawa
 * @help        :: for nodeJS
 */

// let request = require('request');
let cheerio = require('cheerio');
import request from 'superagent';


module.exports = {
  getInfo: async (token) => {
    let data = {
      id, ...tokenData
    }
    let url = `https://api.tradegecko.com/products/${id || ''}`;

    let result = await request
      .get(url)
      .send(data)
      .set('Content-Type', 'application/json')
      .then((res) => {
        // console.log('getProduct res.status', res.status);
        // console.log('getProduct res.body', res.body);
        if (res.status === 200) {
          return res.body.product
        }
        return res.body
        // Calling the end function will send the request
      }).catch(err => {
        console.log('err', err);
        return false;
      });

    return result
  }
}
