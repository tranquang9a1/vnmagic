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
    let { id } = req.user;
    console.log('id', id);
    console.log('req.user', req.user);

    let foundStore = await Shop.find({owner:id})
    console.log('foundStore', foundStore);
    return res.view('scp/store',{foundStore})
  },
};

