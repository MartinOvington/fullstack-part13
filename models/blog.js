const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class Blog extends Model {}
Blog.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    author: { type: DataTypes.TEXT },
    url: { type: DataTypes.TEXT, allowNull: false },
    title: { type: DataTypes.TEXT, allowNull: false },
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1991,
        isLessThanOrEqualCurYear(value) {
          if (value > new Date().getFullYear()) {
            throw new Error(
              'year must be less than or equal to the current year'
            );
          }
        },
      },
    },
  },
  { sequelize, underscored: true, timestamps: false, modelName: 'blog' }
);

module.exports = Blog;
