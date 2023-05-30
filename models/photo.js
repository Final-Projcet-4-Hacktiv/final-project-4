'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Photo.belongsTo(models.User, { foreignKey: 'UserId' })
      Photo.hasMany(models.Comment, { foreignKey: 'PhotoId' })  
      
    }
  }
  Photo.init({
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg : 'Title cannot be empty'
        }
      }
    },
    caption: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          args: true,
          msg : 'Caption cannot be empty'
        }
      }
    },
    poster_image_url: {
      type: DataTypes.TEXT,
      validate: {
        isUrl: {
          args: true,
          msg : 'Poster image URL must be in URL format'
        },
        notEmpty: {
          args: true,
          msg : 'Poster image URL cannot be empty'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Photo',
  });
  return Photo;
};