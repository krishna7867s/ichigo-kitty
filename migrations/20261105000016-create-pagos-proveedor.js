'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pagos_proveedor', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      pedido_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'pedidos', key: 'id' },
        onDelete: 'CASCADE'
      },
      metodo_pago_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'metodos_pago', key: 'id' },
        onDelete: 'RESTRICT'
      },
      monto_cny: { type: Sequelize.FLOAT, allowNull: false },
      tipo_cambio: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 2.75 },
      referencia: { type: Sequelize.STRING, allowNull: false },
      fecha_pago: { type: Sequelize.STRING, allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('pagos_proveedor');
  }
};
