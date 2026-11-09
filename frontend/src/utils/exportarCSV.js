export function exportarDatosCSV(nombreArchivo, filas) {
  if (!Array.isArray(filas) || filas.length === 0) {
    return;
  }

  const columnas = Object.keys(filas[0]);

  const escaparValor = (valor) => {
    if (valor === null || valor === undefined) return '""';
    const texto = String(valor).replace(/"/g, '""');
    return `"${texto}"`;
  };

  const encabezado = columnas.map(escaparValor).join(',');
  const lineas = filas.map((fila) =>
    columnas.map((col) => escaparValor(fila[col])).join(',')
  );

  // Prefijo BOM UTF-8 para que Microsoft Excel reconozca tildes y el simbolo de colones (₡)
  const contenidoCSV = '\uFEFF' + [encabezado, ...lineas].join('\r\n');
  const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.setAttribute('download', nombreArchivo.endsWith('.csv') ? nombreArchivo : `${nombreArchivo}.csv`);
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}
