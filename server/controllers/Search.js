const Users = require('../models').Users;
const Documents = require('../models').Documents;

/**
 * Represents Roles 
 */
module.exports = {
  /**
   * List all Roles. This can be done any 
   * user
   * 
   * @param {any} req - Request Object from express
   * @param {any} res - Response Object from express
   * @returns {jsonObject} - This maybe error json Object 
   */
  FindDocuments(req, res) {
    const query = req.query.q.trim();

    if (query != null && query.length > 0) {
      const offset = parseInt(req.query.offset, 10) || 0;
      const limit = parseInt(req.query.limit, 10) || 0;
      let DocumentAccess = [-1, req.parcel.id];
      if (req.parcel.role === 3) {
        DocumentAccess = [-1, -2, 1, 2, 3];
      }

      let QueryOption = {
        where: {
          $and: [{
              $or: [{
                  title: {
                    $iLike: `%${query}%`
                  }
                },
                {
                  content: {
                    $iLike: `%${query}%`
                  }
                }
              ]
            },
            {
              $or: [{
                  access: {
                    $in: DocumentAccess
                  }
                },
                {
                  UserId: req.parcel.id
                }
              ]
            }
          ]
        },
        limit,
        offset
      };

      if (QueryOption.offset < 1) {
        delete QueryOption.offset;
      }
      if (QueryOption.limit < 1) {
        delete QueryOption.limit;
      }

      return Documents
        .findAll(QueryOption)
        .then(documents => {
          if (!documents) {
            return res.status(404).send({
              message: 'No Document Found'
            });
          } else {
            res.status(200).send(documents);
          }
        })
        .catch(error => res.status(400).send(error));
    } else {
      return res.status(404).send({
        message: 'No Query found'
      });
    }

  },
  FindUsers(req, res) {
    const query = req.query.q.trim();
    if (query != null && query.length > 0) {
      const offset = parseInt(req.query.offset, 10) || 0;
      const limit = parseInt(req.query.limit, 10) || 0;
      let QueryOption = {
        limit,
        offset,
        where: {
          username: {
            $ilike:  `%${query}%`
            
          }
        }
      };
      if (QueryOption.offset < 1) {
        delete QueryOption.offset;
      }
      if (QueryOption.limit < 1) {
        delete QueryOption.limit;
      }
      Users.findAll(
          QueryOption
        )
        .then((users) => {
          if (!users) {
            return res.status(404).send({
              message: 'No Document Found'
            });
          } else {
            res.status(200).send(users);
          }
        })
        .catch(error => res.status(400).send(error));
    } else {
      return res.status(404).send({
        message: 'No Query found'
      });
    }
  }
};