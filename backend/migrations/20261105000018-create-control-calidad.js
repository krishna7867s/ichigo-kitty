'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('control_calidad', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
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
        onDelete: 'CASCADE'
      },
      inspector: { type: Sequelize.STRING(120), allowNull: false },
      unidades_revisadas: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      unidades_defectuosas: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      resultado: { type: Sequelize.STRING(40), allowNull: false, defaultValue: 'aprobado' },
      observaciones: { type: Sequelize.TEXT, allowNull: false },
      fecha_inspeccion: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('control_calidad');
  }
};
