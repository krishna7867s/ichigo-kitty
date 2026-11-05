'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('aduana_despachos', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      pedido_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'pedidos', key: 'id' },
        onDelete: 'CASCADE'
      },
      agente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'agentes_envio', key: 'id' },
        onDelete: 'RESTRICT'
      },
      numero_pedimento: { type: Sequelize.STRING, allowNull: false, unique: true },
      arancel_mxn: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
      estado_aduana: { type: Sequelize.STRING, allowNull: false },
      fecha_despacho: { type: Sequelize.STRING, allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('aduana_despachos');
  }
};
