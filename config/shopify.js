module.exports.shopify = {
  apiKey: '7b9cdf94798609e337640fb016a33aca',
  apiSecret: '2c872869ebea6319dd8897c00827ca63',
  apiConfig: {
    rate_limit_delay: 10000, // 10 seconds (in ms) => if Shopify returns 429 response code
    backoff: 5, // limit X of 40 API calls => default is 35 of 40 API calls
    backoff_delay: 2000 // 1 second (in ms) => wait 1 second if backoff option is exceeded
  }
};
