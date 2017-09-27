/**
 * ShopifyController
 *
 * @description :: Server-side logic for managing Shopifies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const { apiKey, apiSecret } = sails.config.shopify;

module.exports = {
	index: async (req,res) => {
	  console.log('param', req.allParams());
    let { shopifyname,uid } = req.allParams();

    let foundShop = await Shop.findOne({name:`${shopifyname}.myshopify.com`});

      if (!foundShop) {
        let Shopify = new ShopifyApi({
          shop: shopifyname,
          shopify_api_key: apiKey,
          shopify_shared_secret: apiSecret,
          shopify_scope: 'read_content,write_content,read_themes, write_themes,read_script_tags, write_script_tags,read_analytics,read_reports, write_reports,read_marketing_events, write_marketing_events,read_price_rules, write_price_rules',
          redirect_uri: 'http://beta.vnmagic.net/shopify/sync_callback',
          nonce: uid // you must provide a randomly selected value unique for each authorization request
        });
        return res.redirect(Shopify.buildAuthURL());
      } else {
        // sails.sockets.broadcast(session_id,'shop/exist',{msg:'shop exist'});
        return res.json({error:'Shop exist'});
      }

  },

  sync_callback: (req,res) => {
    let params = req.allParams();
    console.log('params', params);
    let { shop,code,state,hmac } = params;
    let sessionId = req.signedCookies['sails.sid'];

    let Shopify = new ShopifyApi({
      shop,
      shopify_api_key: apiKey,
      shopify_shared_secret: apiSecret,
    });
    let postData = {
      client_id:apiKey,
      client_secret:apiSecret,
      code
    };

    Shopify.post('/admin/oauth/access_token', postData, (err,data) => {
      if(err) return console.log(err);
      let { access_token,scope } = data;

      Shop.create({name:shop,owner:state}).exec((err,createShop) => {
        let createData = {
          accessToken: access_token,
          scope,
          shop:createShop.id,
          hmac
        }
        ShopifyToken.create(createData).exec((err,result)=> {
          if(err) return console.log(err);
          let Shopify = new ShopifyApi({
            shop: shop,
            shopify_api_key: apiKey,
            access_token: access_token
          });

          let appUninstallHook = {
            webhook: {
              "topic": "app\/uninstalled",
              "address": "http:\/\/beta.vnmagic.net\/notification\/app?act=uninstalled&shop="+shop,
              "format": "json"
            }
          };

          Shopify.post('/admin/webhooks.json',appUninstallHook, (err,appUninstall) => {
            if(err) return console.log(err)
          });

          res.redirect('/scp/store');
        });
      });
    });
  },

  add_script: async(req,res) => {
	  let { shop } = req.allParams();
    let findToken = await Shop.findOne({name:shop}).populate('shopifytoken');

    const Shopify = new ShopifyApi({
      shop:shop ,
      shopify_api_key:  apiKey,
      access_token: findToken.shopifytoken[0].accessToken,
    });

    let urlData = `/admin/script_tags.json`
    let postData = {
      "script_tag": {
        "event": "onload",
        "src": "https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/materialize\/0.100.2\/css\/materialize.min.css"
      }
    };

    Shopify.post(urlData,postData,(err,data) => {
      if(err) return res.json(err);
      return res.json(data);
    })
  },

};

