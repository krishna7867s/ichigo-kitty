'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('proveedores', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nombre: { type: Sequelize.STRING, allowNull: false },
      plataforma: { type: Sequelize.STRING, allowNull: false },
      ciudad: { type: Sequelize.STRING },
      contacto: { type: Sequelize.STRING, allowNull: false },
      calificacion: { type: Sequelize.INTEGER }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('proveedores');
  }
};
