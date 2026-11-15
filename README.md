# Chancayano · Landing

Página de marca de Chancayano (aguardiente artesanal de caña de Chancay Baños, Cajamarca). Sitio estático, sin compilación: HTML, CSS y JavaScript propios, con fuentes e imágenes alojadas en el repositorio.

Este repositorio es **independiente** de la tienda y el sistema de gestión, que viven en el repositorio privado `chancayano` (`apps/web` y `apps/admin`).

## Contenido

- `index.html`: portada (hero, líneas, origen, presentaciones, cocktails y cierre).
- `privacidad.html` y `terminos.html`: políticas legales, marcadas para revisión.
- `assets/`: estilos (`tokens.css`, `fuentes.css`), fuentes (`fuentes/`) e imágenes (`img/`).
- `robots.txt` y `sitemap.xml`: plantillas SEO, pendientes del dominio final.
- `.github/workflows/pages.yml`: publica el sitio en GitHub Pages al subir a `main`.

## Ver en local

Desde esta carpeta:

```bash
python -m http.server 8080
```

Después abre `http://localhost:8080`.

## Publicación en GitHub Pages

La publicación la hace el flujo `pages.yml` en cada `push` a `main`. Solo se publican `index.html`, `privacidad.html`, `terminos.html`, `robots.txt`, `sitemap.xml` y `assets/`; nunca `.git`, `.github` ni `.impeccable`.

Estado de revisión: las tres páginas llevan `noindex, nofollow` para que el borrador no aparezca en buscadores. Antes de usar el dominio final, quitar esa etiqueta, completar `canonical`, `og:image` y `sitemap.xml` (marcador `BASE`), y revisar los textos legales.

## Pendientes antes de publicar en el dominio final

Ver el [registro de progreso](../docs/progreso.md) del repositorio principal (HU-04). Resumen:

1. Confirmar en SUNAT la razón social y el RUC de los textos legales.
2. Revisión legal de privacidad, términos y verificación de mayoría de edad.
3. Dominio final para `canonical`, `og:image`, `sitemap.xml` y `robots.txt`.
4. Confirmar tipografía y azul de marca con el cliente.
5. Fotografías de producto y origen de alta resolución (hoy las imágenes provienen de piezas publicitarias y fichas de chancayano.com).
