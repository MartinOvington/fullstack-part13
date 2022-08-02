const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      min: 1991,
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
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year');
  },
};
