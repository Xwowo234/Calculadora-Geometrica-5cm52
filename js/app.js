'use strict';

/**
 * app.js
 * Manipulación del DOM y manejo de eventos.
 * Usa Geometria (calculos.js) y Validacion (validacion.js).
 */

/* =========================================================
   1. Configuración de cada figura (datos, no DOM)
   ========================================================= */
const FIGURAS = {
  cuadrado: {
    tipo: 'planas', nombre: 'Cuadrado', icono: '■',
    desc: 'Figura de cuatro lados iguales.',
    formulas: ['P = 4 · l', 'A = l²'],
    campos: [{ id: 'lado', etiqueta: 'Lado (l)' }],
    calcular: ({ lado }) => [
      { nombre: 'Perímetro', valor: Geometria.cuadrado.perimetro(lado), unidad: 'u' },
      { nombre: 'Área', valor: Geometria.cuadrado.area(lado), unidad: 'u²' }
    ]
  },
  rectangulo: {
    tipo: 'planas', nombre: 'Rectángulo', icono: '▬',
    desc: 'Cuadrilátero con lados opuestos iguales.',
    formulas: ['P = 2 · (b + h)', 'A = b · h'],
    campos: [
      { id: 'base', etiqueta: 'Base (b)' },
      { id: 'altura', etiqueta: 'Altura (h)' }
    ],
    calcular: ({ base, altura }) => [
      { nombre: 'Perímetro', valor: Geometria.rectangulo.perimetro(base, altura), unidad: 'u' },
      { nombre: 'Área', valor: Geometria.rectangulo.area(base, altura), unidad: 'u²' }
    ]
  },
  triangulo: {
    tipo: 'planas', nombre: 'Triángulo', icono: '▲',
    desc: 'Se calcula a partir de sus tres lados (fórmula de Herón).',
    formulas: ['P = a + b + c', 's = P / 2', 'A = √(s(s−a)(s−b)(s−c))'],
    campos: [
      { id: 'a', etiqueta: 'Lado a' },
      { id: 'b', etiqueta: 'Lado b' },
      { id: 'c', etiqueta: 'Lado c' }
    ],
    // Validación extra propia de la figura
    validarExtra: ({ a, b, c }) =>
      Geometria.triangulo.esValido(a, b, c)
        ? null
        : { ids: ['a', 'b', 'c'], mensaje: 'Esos lados no forman un triángulo: la suma de dos lados debe ser mayor que el tercero.' },
    calcular: ({ a, b, c }) => [
      { nombre: 'Perímetro', valor: Geometria.triangulo.perimetro(a, b, c), unidad: 'u' },
      { nombre: 'Área', valor: Geometria.triangulo.area(a, b, c), unidad: 'u²' }
    ]
  },
  circulo: {
    tipo: 'planas', nombre: 'Círculo', icono: '●',
    desc: 'Todos sus puntos equidistan del centro.',
    formulas: ['P = 2 · π · r', 'A = π · r²'],
    campos: [{ id: 'radio', etiqueta: 'Radio (r)' }],
    calcular: ({ radio }) => [
      { nombre: 'Perímetro', valor: Geometria.circulo.perimetro(radio), unidad: 'u' },
      { nombre: 'Área', valor: Geometria.circulo.area(radio), unidad: 'u²' }
    ]
  },
  cubo: {
    tipo: 'cuerpos', nombre: 'Cubo', icono: '◼',
    desc: 'Poliedro de seis caras cuadradas iguales.',
    formulas: ['AT = 6 · a²', 'V = a³'],
    campos: [{ id: 'arista', etiqueta: 'Arista (a)' }],
    calcular: ({ arista }) => [
      { nombre: 'Área total', valor: Geometria.cubo.areaTotal(arista), unidad: 'u²' },
      { nombre: 'Volumen', valor: Geometria.cubo.volumen(arista), unidad: 'u³' }
    ]
  },
  prisma: {
    tipo: 'cuerpos', nombre: 'Prisma rectangular', icono: '▭',
    desc: 'Ortoedro con caras rectangulares.',
    formulas: ['AT = 2 · (l·w + l·h + w·h)', 'V = l · w · h'],
    campos: [
      { id: 'largo', etiqueta: 'Largo (l)' },
      { id: 'ancho', etiqueta: 'Ancho (w)' },
      { id: 'alto', etiqueta: 'Alto (h)' }
    ],
    calcular: ({ largo, ancho, alto }) => [
      { nombre: 'Área total', valor: Geometria.prisma.areaTotal(largo, ancho, alto), unidad: 'u²' },
      { nombre: 'Volumen', valor: Geometria.prisma.volumen(largo, ancho, alto), unidad: 'u³' }
    ]
  },
  cilindro: {
    tipo: 'cuerpos', nombre: 'Cilindro', icono: '⬭',
    desc: 'Cuerpo con dos bases circulares paralelas.',
    formulas: ['AT = 2 · π · r · (r + h)', 'V = π · r² · h'],
    campos: [
      { id: 'radio', etiqueta: 'Radio (r)' },
      { id: 'altura', etiqueta: 'Altura (h)' }
    ],
    calcular: ({ radio, altura }) => [
      { nombre: 'Área total', valor: Geometria.cilindro.areaTotal(radio, altura), unidad: 'u²' },
      { nombre: 'Volumen', valor: Geometria.cilindro.volumen(radio, altura), unidad: 'u³' }
    ]
  },
  esfera: {
    tipo: 'cuerpos', nombre: 'Esfera', icono: '◯',
    desc: 'Todos sus puntos equidistan del centro en el espacio.',
    formulas: ['A = 4 · π · r²', 'V = (4/3) · π · r³'],
    campos: [{ id: 'radio', etiqueta: 'Radio (r)' }],
    calcular: ({ radio }) => [
      { nombre: 'Área', valor: Geometria.esfera.area(radio), unidad: 'u²' },
      { nombre: 'Volumen', valor: Geometria.esfera.volumen(radio), unidad: 'u³' }
    ]
  }
};

/* =========================================================
   2. Referencias al DOM y estado
   ========================================================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
  secciones: $$('.seccion'),
  sidebar: $('#sidebar'),
  listaPlanas: $('#listaPlanas'),
  listaCuerpos: $('#listaCuerpos'),
  gridPlanas: $('#gridPlanas'),
  gridCuerpos: $('#gridCuerpos'),
  calcTitulo: $('#calcTitulo'),
  calcDesc: $('#calcDesc'),
  calcImagen: $('#calcImagen'),
  calcFormulas: $('#calcFormulas'),
  campos: $('#campos'),
  alerta: $('#alerta'),
  resultados: $('#resultados'),
  btnCalcular: $('#btnCalcular'),
  btnLimpiar: $('#btnLimpiar'),
  btnVolver: $('#btnVolver')
};

let figuraActual = null;

/* =========================================================
   3. Utilidades reutilizables de DOM
   ========================================================= */
function crearElemento(etiqueta, clases = '', texto = '') {
  const el = document.createElement(etiqueta);
  if (clases) el.className = clases;
  if (texto) el.textContent = texto;
  return el;
}

function mostrar(el) { el.classList.remove('oculto'); }
function ocultar(el) { el.classList.add('oculto'); }

function formatear(n) {
  return n.toLocaleString('es-MX', { maximumFractionDigits: 4 });
}

/* =========================================================
   4. Navegación (mostrar / ocultar secciones)
   ========================================================= */
function mostrarSeccion(id) {
  dom.secciones.forEach((s) => s.classList.toggle('visible', s.id === id));

  // Marca como activo el enlace correspondiente
  const clave = id === 'calculadora' && figuraActual ? figuraActual : id;
  $$('[data-seccion], [data-figura]').forEach((link) => {
    const activo = link.dataset.seccion === id || link.dataset.figura === clave;
    if (link.matches('.nav-link, .side-link')) link.classList.toggle('activo', activo);
  });
  if (id === 'calculadora' && figuraActual) {
    $$('.nav-link').forEach((l) =>
      l.classList.toggle('activo', l.dataset.seccion === FIGURAS[figuraActual].tipo));
  }

  window.scrollTo(0, 0);
}

/* =========================================================
   5. Construcción de menús y tarjetas
   ========================================================= */
function construirMenus() {
  Object.entries(FIGURAS).forEach(([clave, fig]) => {
    // Enlace en sidebar
    const li = crearElemento('li');
    const a = crearElemento('a', 'side-link', `${fig.icono}  ${fig.nombre}`);
    a.href = '#';
    a.dataset.figura = clave;
    li.appendChild(a);
    (fig.tipo === 'planas' ? dom.listaPlanas : dom.listaCuerpos).appendChild(li);

    // Tarjeta en la sección de listado
    const tarjeta = crearElemento('button', 'tarjeta');
    tarjeta.type = 'button';
    tarjeta.dataset.figura = clave;
    const img = crearElemento('img', 'tarjeta__img');
    img.src = `img/${clave}.svg`;
    img.alt = fig.nombre;
    tarjeta.append(
      img,
      crearElemento('span', 'tarjeta__nombre', fig.nombre),
      crearElemento('span', 'tarjeta__desc', fig.formulas.join('   ·   '))
    );
    (fig.tipo === 'planas' ? dom.gridPlanas : dom.gridCuerpos).appendChild(tarjeta);
  });
}

/* =========================================================
   6. Calculadora
   ========================================================= */
function abrirCalculadora(clave) {
  const fig = FIGURAS[clave];
  if (!fig) return;
  figuraActual = clave;

  dom.calcTitulo.textContent = `${fig.icono} ${fig.nombre}`;
  dom.calcDesc.textContent = fig.desc;
  dom.calcImagen.src = `img/${clave}.svg`;
  dom.calcImagen.alt = `Ilustración de ${fig.nombre}`;

  dom.calcFormulas.innerHTML = '';
  fig.formulas.forEach((f) => dom.calcFormulas.appendChild(crearElemento('span', 'formula', f)));

  dom.campos.innerHTML = '';
  fig.campos.forEach((c) => dom.campos.appendChild(crearCampo(c)));

  limpiarEstado();
  mostrarSeccion('calculadora');
  dom.campos.querySelector('input')?.focus({ preventScroll: true });
}

function crearCampo({ id, etiqueta }) {
  const grupo = crearElemento('div', 'campo');
  grupo.dataset.campo = id;

  const label = crearElemento('label', 'campo__label', etiqueta);
  label.htmlFor = `in-${id}`;

  const input = crearElemento('input', 'campo__input');
  input.id = `in-${id}`;
  input.type = 'text';          // text + inputmode para poder detectar y avisar si escriben letras
  input.inputMode = 'decimal';
  input.placeholder = 'Ej. 5';
  input.dataset.id = id;
  input.dataset.etiqueta = etiqueta;

  const error = crearElemento('small', 'campo__error oculto');
  error.id = `err-${id}`;
  input.setAttribute('aria-describedby', error.id);

  grupo.append(label, input, error);
  return grupo;
}

function marcarCampo(id, mensaje) {
  const grupo = dom.campos.querySelector(`[data-campo="${id}"]`);
  if (!grupo) return;
  const input = grupo.querySelector('input');
  const error = grupo.querySelector('.campo__error');

  if (mensaje) {
    grupo.classList.add('campo--invalido');
    grupo.classList.remove('campo--valido');
    input.setAttribute('aria-invalid', 'true');
    error.textContent = mensaje;
    mostrar(error);
  } else {
    grupo.classList.remove('campo--invalido');
    grupo.classList.add('campo--valido');
    input.removeAttribute('aria-invalid');
    error.textContent = '';
    ocultar(error);
  }
}

function quitarMarca(id) {
  const grupo = dom.campos.querySelector(`[data-campo="${id}"]`);
  if (!grupo) return;
  grupo.classList.remove('campo--invalido', 'campo--valido');
  grupo.querySelector('input').removeAttribute('aria-invalid');
  ocultar(grupo.querySelector('.campo__error'));
}

function mostrarAlerta(mensaje, tipo = 'error') {
  dom.alerta.textContent = mensaje;
  dom.alerta.classList.remove('alerta--error', 'alerta--ok');
  dom.alerta.classList.add(`alerta--${tipo}`);
  mostrar(dom.alerta);
}

function limpiarEstado() {
  ocultar(dom.alerta);
  ocultar(dom.resultados);
  dom.resultados.innerHTML = '';
  dom.campos.querySelectorAll('.campo').forEach((g) => quitarMarca(g.dataset.campo));
}

function leerEntradas() {
  return [...dom.campos.querySelectorAll('input')].map((i) => ({
    id: i.dataset.id, etiqueta: i.dataset.etiqueta, texto: i.value
  }));
}

function pintarResultados(lista) {
  dom.resultados.innerHTML = '';
  lista.forEach(({ nombre, valor, unidad }) => {
    const item = crearElemento('div', 'resultado');
    item.append(
      crearElemento('span', 'resultado__nombre', nombre),
      crearElemento('span', 'resultado__valor', `${formatear(valor)} ${unidad}`)
    );
    dom.resultados.appendChild(item);
  });
  mostrar(dom.resultados);
}

function calcular() {
  const fig = FIGURAS[figuraActual];
  const entradas = leerEntradas();
  const { valido, valores, errores } = Validacion.validarFormulario(entradas);

  ocultar(dom.resultados);
  entradas.forEach(({ id }) => {
    const err = errores.find((e) => e.id === id);
    marcarCampo(id, err ? err.mensaje : null);
  });

  if (!valido) {
    mostrarAlerta(`Revisa ${errores.length === 1 ? 'el campo marcado' : `los ${errores.length} campos marcados`}.`);
    dom.campos.querySelector('.campo--invalido input')?.focus();
    return;
  }

  // Validación propia de la figura (ej. desigualdad del triángulo)
  const extra = fig.validarExtra?.(valores);
  if (extra) {
    extra.ids.forEach((id) => marcarCampo(id, ' '));
    mostrarAlerta(extra.mensaje);
    return;
  }

  mostrarAlerta('Cálculo realizado correctamente.', 'ok');
  pintarResultados(fig.calcular(valores));
}

function limpiarFormulario() {
  dom.campos.querySelectorAll('input').forEach((i) => { i.value = ''; });
  limpiarEstado();
  dom.campos.querySelector('input')?.focus();
}

/* Validación en vivo mientras se escribe (evento input) */
function validarEnVivo(e) {
  const input = e.target;
  if (!input.matches('.campo__input')) return;

  if (input.value.trim() === '') { quitarMarca(input.dataset.id); return; }

  const r = Validacion.validarCampo(input.value, input.dataset.etiqueta);
  marcarCampo(input.dataset.id, r.valido ? null : r.mensaje);
  ocultar(dom.alerta);
}

/* =========================================================
   7. Eventos
   ========================================================= */
function registrarEventos() {
  // Delegación: cualquier elemento con data-seccion o data-figura navega
  document.addEventListener('click', (e) => {
    const destino = e.target.closest('[data-seccion], [data-figura]');
    if (!destino) return;
    e.preventDefault();
    if (destino.dataset.figura) abrirCalculadora(destino.dataset.figura);
    else mostrarSeccion(destino.dataset.seccion);
  });

  dom.btnCalcular.addEventListener('click', calcular);
  dom.btnLimpiar.addEventListener('click', limpiarFormulario);
  dom.btnVolver.addEventListener('click', () => mostrarSeccion(FIGURAS[figuraActual]?.tipo || 'inicio'));

  dom.campos.addEventListener('input', validarEnVivo);
}

/* =========================================================
   8. Inicio
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  construirMenus();
  registrarEventos();
});
