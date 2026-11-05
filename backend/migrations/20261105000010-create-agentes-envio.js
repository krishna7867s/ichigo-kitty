'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('agentes_envio', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nombre: { type: Sequelize.STRING, allowNull: false },
      tipo_transporte: { type: Sequelize.STRING, allowNull: false },
      tarifa_kg_usd: { type: Sequelize.FLOAT, allowNull: false },
      contacto: { type: Sequelize.STRING, allowNull: false },
      pais_origen: { type: Sequelize.STRING, allowNull: false, defaultValue: 'China' }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('agentes_envio');
  }
};
