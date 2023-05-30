'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Photo, { foreignKey: 'UserId' })
      User.hasMany(models.SocialMedia, { foreignKey: 'UserId' })
      User.hasMany(models.Comment, { foreignKey: 'UserId' })
    }
  }
  User.init({
    full_name: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          args : true,
          msg : 'Full name cannot be empty'
        },
        notNull : false
      }
    },
    email: {
      type : DataTypes.STRING,
      unique : {
        args : true,
        msg : 'Email already registered'
      },
    },
    password: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          args : true,
          msg : 'Password cannot be empty'
        }
      }
    },
    username: {
      type : DataTypes.STRING,
      unique : {
        args : true,
        msg : 'Username already registered'
      },
      notNull: false
    },
    profile_img_url: {
      type : DataTypes.TEXT,
      validate : {
        isUrl : {
          args : true,
          msg : 'Profile image URL must be in URL format'
        }
      },
      notNull: false
    },
    age: {
      type : DataTypes.INTEGER,
      validate : {
        notEmpty : {
          args : true,
          msg : 'Age cannot be empty'
        },
        isNumeric : {
          args : true,
          msg : 'Age must be in number format'
        }
      },
      notNull: false
    },
    phone_number: {
      type : DataTypes.INTEGER,
      validate : {
        notEmpty : {
          args : true,
          msg : 'Phone number cannot be empty',
        },
        isNumeric : {
          args : true,
          msg : 'Phone number must be in number format'
        },
        // len : {
        //   args : [10, 13],
        //   msg : 'Phone number must be between 10 to 13 digits'
        // },

      },
      notNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks : {
      beforeCreate(user, options) {
        user.password = hashPassword(user.password)
      },
      beforeUpdate(user, options) {
        user.password = hashPassword(user.password)
      },
    }
  });
  return User;
};