'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ventas', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      cliente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'clientes', key: 'id' },
        onDelete: 'RESTRICT'
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: { model: 'usuarios', key: 'id' },
        onDelete: 'SET NULL'
      },
      fecha: { type: Sequelize.STRING, allowNull: false },
      total: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
      estado_venta: { type: Sequelize.STRING, allowNull: false, defaultValue: 'pagada' }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('ventas');
  }
};
