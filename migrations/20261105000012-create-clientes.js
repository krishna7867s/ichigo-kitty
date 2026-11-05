'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clientes', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nombre: { type: Sequelize.STRING, allowNull: false },
      correo: { type: Sequelize.STRING, allowNull: false, unique: true },
      telefono: { type: Sequelize.STRING },
      ciudad: { type: Sequelize.STRING },
      nivel_membresia: { type: Sequelize.STRING, allowNull: false, defaultValue: 'Bronce' }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('clientes');
  }
};
