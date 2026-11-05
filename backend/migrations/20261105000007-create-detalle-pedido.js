'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detalle_pedido', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      pedido_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'pedidos', key: 'id' },
        onDelete: 'CASCADE'
      },
      producto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'productos', key: 'id' },
        onDelete: 'RESTRICT'
      },
      cantidad: { type: Sequelize.INTEGER, allowNull: false },
      precio_unitario_cny: { type: Sequelize.FLOAT, allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('detalle_pedido');
  }
};
