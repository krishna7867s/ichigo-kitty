'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('promociones_descuentos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      codigo: { type: Sequelize.STRING(60), allowNull: false, unique: true },
      nombre_campana: { type: Sequelize.STRING(150), allowNull: false },
      porcentaje_descuento: { type: Sequelize.REAL, allowNull: false, defaultValue: 10 },
      minimo_compra_usd: { type: Sequelize.REAL, allowNull: false, defaultValue: 25 },
      fecha_inicio: { type: Sequelize.STRING(40), allowNull: false },
      fecha_fin: { type: Sequelize.STRING(40), allowNull: false },
      activa: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      descripcion: { type: Sequelize.TEXT, allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('promociones_descuentos');
  }
};
