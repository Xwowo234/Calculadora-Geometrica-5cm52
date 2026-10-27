'use strict';

/**
 * validacion.js
 * Reglas de validación puras: NO tocan el DOM.
 * Reciben el texto capturado y regresan { valido, valor, mensaje }.
 */
const Validacion = {
  // Número decimal positivo o negativo (para poder detectar el negativo y avisarlo)
  PATRON_NUMERO: /^-?\d+(\.\d+)?$|^-?\.\d+$/,

  validarCampo(texto, etiqueta) {
    const limpio = String(texto).trim().replace(',', '.');

    if (limpio === '') {
      return { valido: false, mensaje: `El campo "${etiqueta}" no puede estar vacío.` };
    }
    if (!this.PATRON_NUMERO.test(limpio)) {
      return { valido: false, mensaje: `"${etiqueta}" solo acepta números (no texto ni símbolos).` };
    }

    const valor = parseFloat(limpio);

    if (valor < 0) {
      return { valido: false, mensaje: `"${etiqueta}" no puede ser negativo.` };
    }
    if (valor === 0) {
      return { valido: false, mensaje: `"${etiqueta}" debe ser mayor que cero.` };
    }
    return { valido: true, valor };
  },

  /**
   * Valida un conjunto de campos.
   * @param {Array<{id, etiqueta, texto}>} entradas
   * @returns {{ valido, valores, errores: Array<{id, mensaje}> }}
   */
  validarFormulario(entradas) {
    const valores = {};
    const errores = [];

    entradas.forEach(({ id, etiqueta, texto }) => {
      const r = this.validarCampo(texto, etiqueta);
      if (r.valido) valores[id] = r.valor;
      else errores.push({ id, mensaje: r.mensaje });
    });

    return { valido: errores.length === 0, valores, errores };
  }
};
