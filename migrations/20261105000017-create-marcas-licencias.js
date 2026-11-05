'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('marcas_licencias', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      nombre: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      pais_origen: { type: Sequelize.STRING(80), allowNull: false, defaultValue: 'Japón / China' },
      fabricante_oficial: { type: Sequelize.STRING(150), allowNull: false },
      tipo_licencia: { type: Sequelize.STRING(100), allowNull: false, defaultValue: 'Oficial Sanrio / Autorizada' },
      descripcion: { type: Sequelize.TEXT, allowNull: false },
      creado_en: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('marcas_licencias');
  }
};
