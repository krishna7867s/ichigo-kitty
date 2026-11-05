'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pedidos', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      proveedor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'proveedores', key: 'id' },
        onDelete: 'RESTRICT'
      },
      fecha: { type: Sequelize.STRING, allowNull: false },
      estado: { type: Sequelize.STRING, allowNull: false },
      rastreo: { type: Sequelize.STRING },
      costo_envio: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('pedidos');
  }
};
