# Administrador de contenido

- `/admin/contenido`: portada, tres unidades, imágenes, servicios, preguntas frecuentes y títulos SEO. Español e inglés se editan por separado.
- **Guardar borrador** conserva cambios sin afectar el sitio.
- **Ver borrador guardado** abre una vista autenticada y no indexable.
- **Publicar cambios** actualiza el contenido servido por el servidor, sin redespliegue.
- **Restaurar publicación anterior** recupera la versión publicada previa.
- Los archivos de imágenes se suben al almacenamiento Blob existente; el editor también admite una URL de imagen.

El contenido utiliza la clave Redis `site:marketing:v1`, con control de versión atómico para evitar sobrescrituras entre editores. La configuración inicial está en `src/data/marketing.json`. Las rutas comerciales se reescriben al renderizador de servidor; no se depende de una petición de contenido posterior para SEO. El diseño y la animación se mantienen en `public/site`.

## Blog de HubSpot

En `/admin/blog`, **Importar / actualizar copia** recorre los artículos publicados de HubSpot, valida la paginación y las URLs únicas, elimina HTML ejecutable y guarda una copia en Redis. El índice público cambia solamente después de guardar todos los artículos. Una importación fallida conserva el índice previo. No se modifica HubSpot.

El contenido importado se consulta localmente y no necesita HubSpot para mostrar los textos. Se conservan fechas, autores, metadescripciones y la URL de origen. Las rutas locales conservan la normalización de slugs que ya utilizaba el sitio. Las imágenes conservan sus URLs de origen; no es una migración de archivos ni permite cancelar su alojamiento en HubSpot. Redirecciones desde dominios anteriores y cambios del canonical en HubSpot requieren una revisión del inventario real.

La edición de artículos continúa en HubSpot, seguida de una nueva importación. Este cambio no incorpora un editor local de artículos nuevos. El sitemap añade automáticamente los artículos importados. No se ocultan entradas si falla una imagen.

## Comprobación

`node tests/content-management.cjs` comprueba aislamiento de borradores, publicación, restauración, conflictos, SSR en ES/EN, seguridad del contenido, paginación, importación atómica y lectura del blog durante un fallo de HubSpot. Utiliza almacenamiento y respuestas ficticias; no accede a producción.

La verificación de interfaz se hace con una instancia local y una cuenta de prueba. La prueba autenticada contra Redis/Blob de producción y la primera importación real deben ejecutarse después de iniciar sesión en el administrador. No almacenar credenciales de producción en el repositorio.
