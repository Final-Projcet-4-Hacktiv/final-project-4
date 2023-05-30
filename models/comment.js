'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, { foreignKey: 'UserId' })
      Comment.belongsTo(models.Photo, { foreignKey: 'PhotoId' })
    }
  }
  Comment.init({
    comment: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          args : true,
          msg : 'Comment cannot be empty'
        }
      }
    },
    PhotoId : {
      type : DataTypes.INTEGER,
      validate : {
        notEmpty : {
          args : true,
          msg : 'PhotoId cannot be empty'
        },
        isInt : {
          args : true,
          msg : 'PhotoId must be integer'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};