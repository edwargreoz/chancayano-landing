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
  // 4. Pantalla de estado para los enlaces sin destino todavía (no salen a otros sitios)
  const estado = document.getElementById('pantalla-estado');
  if (estado) {
    document.addEventListener('click', (e) => {
      // El carrusel ya resolvió el clic (cambio de diapositiva): no abrir la pantalla.
      if (e.defaultPrevented) return;
      if (!e.target.closest('[data-pronto]')) return;
      e.preventDefault();
      if (typeof estado.showModal === 'function') estado.showModal();
      else estado.setAttribute('open', '');
      estado.querySelector('.estado-cerrar').focus();
    });
    estado.querySelector('.estado-cerrar').addEventListener('click', () => estado.close());
    // Clic fuera de la caja cierra la pantalla
    estado.addEventListener('click', (e) => { if (e.target === estado) estado.close(); });
  }
})();

/* Navegación: una barra dorada se desliza bajo el enlace de la sección visible.
   Cifras de Origen: cuentan desde cero hasta su valor la primera vez que entran en pantalla. */
(() => {
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 5. Sección activa en la navegación
  const nav = document.querySelector('.nav');
  const marca = nav && nav.querySelector('.nav-marca');
  if (nav && marca && 'IntersectionObserver' in window) {
    const enlaces = [...nav.querySelectorAll('a[href^="#"]')];
    const secciones = enlaces.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    let activo = null;
    const pintar = () => {
      const a = activo && enlaces.find((e) => e.getAttribute('href') === '#' + activo);
      enlaces.forEach((e) => e.removeAttribute('aria-current'));
      if (!a) { marca.style.setProperty('--nw', 0); return; }
      a.setAttribute('aria-current', 'true');
      marca.style.setProperty('--nx', `${a.offsetLeft}px`);
      marca.style.setProperty('--nw', a.offsetWidth);
    };
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => { if (e.isIntersecting) activo = e.target.id; else if (activo === e.target.id) activo = null; });
      pintar();
    }, { rootMargin: '-45% 0px -50% 0px' });
    secciones.forEach((sec) => io.observe(sec));
    window.addEventListener('resize', pintar);
  }

  // 6. Cifras que cuentan
  const cifras = document.querySelectorAll('[data-cuenta]');
  if (!cifras.length || reducido || !('IntersectionObserver' in window)) return;
  const contar = (el) => {
    const fin = Number(el.dataset.cuenta);
    const sufijo = el.textContent.replace(/^[\d\s]+/, ' ').trimEnd();
    const t0 = performance.now();
    const dur = 1400;
    const paso = (ahora) => {
      const p = Math.min(1, (ahora - t0) / dur);
      const v = Math.round(fin * (1 - Math.pow(1 - p, 4)));
      el.textContent = `${v}${sufijo}`;
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { contar(e.target); io.unobserve(e.target); }
  }), { threshold: 0.6 });
  cifras.forEach((el) => io.observe(el));
})();
