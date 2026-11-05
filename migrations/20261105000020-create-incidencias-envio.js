'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('incidencias_envio', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      pedido_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'pedidos', key: 'id' },
        onDelete: 'CASCADE'
      },
      tipo_incidencia: { type: Sequelize.STRING(120), allowNull: false },
      severidad: { type: Sequelize.STRING(40), allowNull: false, defaultValue: 'media' },
      descripcion: { type: Sequelize.TEXT, allowNull: false },
      resolucion: { type: Sequelize.TEXT, allowNull: false },
      estado: { type: Sequelize.STRING(40), allowNull: false, defaultValue: 'resuelta' },
      fecha_reporte: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('incidencias_envio');
  }
};
