const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable(
      'sessions',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
          references: { model: 'users', key: 'id' },
        },
        token: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        updated_at: DataTypes.DATE,
        created_at: DataTypes.DATE,
      },
      {
        timestamps: true,
      }
    );
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions');
  },
};
