/**
 * DemoController
 *
 * @description :: Server-side logic for managing demoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: async(req,res) => {
    return res.view('scp/index');
  },
  store: async(req,res) => {
    return res.view('scp/store')
  },
};

