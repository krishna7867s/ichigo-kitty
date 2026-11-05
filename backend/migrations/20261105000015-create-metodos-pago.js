'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('metodos_pago', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nombre: { type: Sequelize.STRING, allowNull: false, unique: true },
      comision_porcentaje: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
      activo: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('metodos_pago');
  }
};
