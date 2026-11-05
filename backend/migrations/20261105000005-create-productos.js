'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productos', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nombre: { type: Sequelize.STRING, allowNull: false },
      precio_compra_cny: { type: Sequelize.FLOAT, allowNull: false },
      precio_venta: { type: Sequelize.FLOAT, allowNull: false },
      stock: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      categoria_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'categorias', key: 'id' },
        onDelete: 'RESTRICT'
      },
      proveedor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'proveedores', key: 'id' },
        onDelete: 'RESTRICT'
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('productos');
  }
};
