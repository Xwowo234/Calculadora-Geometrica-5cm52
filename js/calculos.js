'use strict';

/**
 * calculos.js
 * Lógica matemática pura: NO toca el DOM.
 * Cada función recibe números y regresa números.
 */
const Geometria = {
  /* ---------- Figuras planas ---------- */
  cuadrado: {
    perimetro: (lado) => 4 * lado,
    area: (lado) => lado * lado
  },

  rectangulo: {
    perimetro: (base, altura) => 2 * (base + altura),
    area: (base, altura) => base * altura
  },

  triangulo: {
    perimetro: (a, b, c) => a + b + c,
    // Fórmula de Herón
    area: (a, b, c) => {
      const s = (a + b + c) / 2;
      return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    },
    // Desigualdad del triángulo
    esValido: (a, b, c) => a + b > c && a + c > b && b + c > a
  },

  circulo: {
    perimetro: (radio) => 2 * Math.PI * radio,
    area: (radio) => Math.PI * radio ** 2
  },

  /* ---------- Cuerpos geométricos ---------- */
  cubo: {
    areaTotal: (arista) => 6 * arista ** 2,
    volumen: (arista) => arista ** 3
  },

  prisma: {
    areaTotal: (largo, ancho, alto) => 2 * (largo * ancho + largo * alto + ancho * alto),
    volumen: (largo, ancho, alto) => largo * ancho * alto
  },

  cilindro: {
    areaTotal: (radio, altura) => 2 * Math.PI * radio * (radio + altura),
    volumen: (radio, altura) => Math.PI * radio ** 2 * altura
  },

  esfera: {
    area: (radio) => 4 * Math.PI * radio ** 2,
    volumen: (radio) => (4 / 3) * Math.PI * radio ** 3
  }
};
