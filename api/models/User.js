var _ = require('lodash');
var _super = require('sails-authen/api/models/User');

_.merge(exports, _super);
_.merge(exports, {
  attributes: {
    fullname: {
      type: 'string'
    },
    status: {
      type: 'string',
      defaultsTo: 'Active'
    },
    group: {
      type: 'integer',
      defaultsTo: 3,
      enum: [1, 2, 3], // 1: admin, 2: manager, 3: seller
      index: true
    },

    getGroupName: function () {
      const groupMap = {
        1: 'admin',
        2: 'manager',
        3: 'user'
      }
      return groupMap[this.group];
    },
  }
});
