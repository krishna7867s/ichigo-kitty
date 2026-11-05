'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const hash = await bcrypt.hash('mipassword123', 10);

    await queryInterface.bulkInsert('roles', [
      { id: 1, nombre: 'admin', descripcion: 'Directora General de Importaciones y Compras en China (Taobao / 1688) hacia Costa Rica, con acceso total a costos FOB y aduanas TICA.' },
      { id: 2, nombre: 'operador_logistico', descripcion: 'Encargado de recepción en casillero de Guangzhou/Shenzhen, consolidación de paquetes y despacho hacia San José y Alajuela.' },
      { id: 3, nombre: 'vendedor', descripcion: 'Encargado de ventas en showroom de San Pedro de Montes de Oca, atención por WhatsApp, envíos por Correos de Costa Rica y pagos por SINPE Móvil.' }
    ], {});

    await queryInterface.bulkInsert('usuarios', [
      { id: 1, nombre: 'Sakura Administradora', email: 'sakura@kittyimport.com', password_hash: hash, rol: 'admin', rol_id: 1, activo: 1 },
      { id: 2, nombre: 'Valeria Logística', email: 'valeria@kittyimport.com', password_hash: hash, rol: 'operador_logistico', rol_id: 2, activo: 1 }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('usuarios', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};
