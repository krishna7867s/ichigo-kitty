'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('almacenes', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nombre: { type: Sequelize.STRING, allowNull: false },
      ubicacion: { type: Sequelize.STRING, allowNull: false },
      capacidad_maxima: { type: Sequelize.INTEGER, allowNull: false },
      responsable: { type: Sequelize.STRING, allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('almacenes');
  }
};
