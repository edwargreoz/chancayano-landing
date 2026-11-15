/* Animaciones de apoyo de la landing: barra de lectura, botón para volver arriba y botones que siguen el puntero.
   Se cargan con defer. Si el script falla, la página sigue funcionando sin estos adornos. */
(() => {
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const raiz = document.documentElement;

  // 1. Barra de progreso de lectura (sobre la cabecera, sin movimiento propio)
  const barra = document.createElement('div');
  barra.className = 'progreso-lectura';
  barra.setAttribute('aria-hidden', 'true');
  document.body.appendChild(barra);

  // Una sola escritura de estilo por evento de scroll: no depende de requestAnimationFrame.
  const medirProgreso = () => {
    const maximo = raiz.scrollHeight - window.innerHeight;
    const avance = maximo > 0 ? Math.min(1, Math.max(0, window.scrollY / maximo)) : 0;
    barra.style.transform = `scaleX(${avance.toFixed(4)})`;
  };
  window.addEventListener('scroll', medirProgreso, { passive: true });
  window.addEventListener('resize', medirProgreso);
  medirProgreso();

  // 2. Botón para volver al inicio: aparece tras el primer pantallazo
  const arriba = document.createElement('button');
  arriba.type = 'button';
  arriba.className = 'volver-arriba';
  arriba.setAttribute('aria-label', 'Volver al inicio de la página');
  arriba.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(arriba);

  arriba.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducido ? 'auto' : 'smooth' });
    // Devuelve el foco al inicio para quien navega con teclado.
    const inicio = document.getElementById('contenido') || document.body;
    inicio.setAttribute('tabindex', '-1');
    inicio.focus({ preventScroll: true });
  });

  const mostrarArriba = () => arriba.classList.toggle('visible', window.scrollY > window.innerHeight * 0.9);
  window.addEventListener('scroll', mostrarArriba, { passive: true });
  mostrarArriba();

  // 3. Botones principales que siguen ligeramente al puntero
  if (fino && !reducido) {
    document.querySelectorAll('.boton--primario, .boton--dorado').forEach((boton) => {
      boton.classList.add('iman');
      boton.addEventListener('pointermove', (e) => {
        const r = boton.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.18;
        boton.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      });
      boton.addEventListener('pointerleave', () => { boton.style.transform = ''; });
    });
  }
})();
