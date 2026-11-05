const app = require('./src/app');

const PUERTO = process.env.PORT || 3001;

app.listen(PUERTO, () => {
  console.log(`Servidor de Kitty Import escuchando en http://localhost:${PUERTO}`);
});

