'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nombre: { type: Sequelize.STRING, allowNull: false, unique: true },
      descripcion: { type: Sequelize.STRING }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('roles');
  }
};
