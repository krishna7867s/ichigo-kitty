'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventario_almacen', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      almacen_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'almacenes', key: 'id' },
        onDelete: 'CASCADE'
      },
      producto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'productos', key: 'id' },
        onDelete: 'CASCADE'
      },
      cantidad: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      pasillo: { type: Sequelize.STRING }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('inventario_almacen');
  }
};
