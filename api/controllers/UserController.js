/**
 * Authentication Controller
 */
module.exports = {
  test: async(req,res) => {
      res.json({msg:'ok'})
  },

  register: async(req, res) => {
    const params = req.allParams();
    sails.log.debug('user:register', params);
    console.log('params', params);
    let result = {};
    const user = await Promise.resolve(User.register(params))
                              .then(user => {
                                result.user = user;
                                result.location = `/login?email=${user.email}`;
                                sails.log.debug('user:register user', user);
                              })
                              .catch(err => {
                                sails.log.error('user:register err', JSON.stringify(err));

                                result.error = JSON.stringify(_.get(err, 'invalidAttributes', {}));
                              });

    if(req.isSocket){
      return res.json(result);
    }
    res.redirect(result.location);
  },

};
