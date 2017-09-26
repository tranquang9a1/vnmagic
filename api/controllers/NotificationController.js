/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: (req,res) => {
    res.ok();
  },
  join: (req,res) => {
    if(req.isSocket){
      let session_id = req.signedCookies['sails.sid'];
      let rooms = [session_id];
      if(req.session.authenticated){
        sails.sockets.join(req, req.session.user.id);
        rooms.push(req.session.user.id);
      }
      rooms.map(room => sails.sockets.join(req, room))
      res.json({ join: rooms });
    }else{
      res.redirect('/');
    }
  }
};

