# Actualización Sevilla VGC: torneos de fin de semana

Esta versión recupera el calendario anterior a la prueba de agenda móvil e incorpora torneos de varios días.

## Instalación
Sustituye en la raíz del repositorio de GitHub:
- `index.html`
- `app.js`
- `styles.css`

No sustituyas `config.js` ni tu hoja CSV actual.

## Nueva columna de Google Sheets
Añade `fecha_fin` a la cabecera. Ejemplo:
`fecha,fecha_fin,tienda,modalidad,hora,precio,inscripcion,nombre,ganador`

Para torneos de un día, deja `fecha_fin` vacía o repite la fecha de inicio.
Para Regionales y Special Events, indica el último día del evento.

Modalidades admitidas: Challenge, Cup, Especial, Regional, Special Event e Internacional.

Internacional identifica los Campeonatos Internacionales, una categoría destacada visualmente por encima de Regional y Special Event.

Los eventos de varios días se mantienen como un único torneo en el listado y en las tarjetas, pero aparecen en cada día que ocupan dentro del calendario. El estado Realizado se calcula cuando ha pasado la fecha final.
