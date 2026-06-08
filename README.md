# NexoShop Angular

**NexoShop Angular** es un mini e-commerce desarrollado con Angular 19 como proyecto de portfolio frontend.
La aplicación simula una tienda online con catálogo de productos, filtros, detalle de producto, carrito persistente y checkout simulado, utilizando datos mock locales y sin depender de un backend real.

El objetivo del proyecto es demostrar buenas prácticas de desarrollo frontend con Angular, organización por features, uso de servicios, formularios reactivos, manejo de estado simple y documentación clara.

---

## Demo

Próximamente.

---

## Características principales

* Home con presentación de la tienda y productos destacados.
* Catálogo de productos con vista en tarjetas o lista.
* Filtros laterales responsive por categoría, subcategoría, atributos, búsqueda y rango de precio, con contador de resultados y chips activos.
* Vista de detalle individual de producto con breadcrumb, variantes, cantidad, beneficios comerciales y productos relacionados.
* Control de stock para evitar compras de productos no disponibles.
* Carrito de compras con modificación de cantidades, sidebar rápido desde el header y resumen de compra.
* Cálculo de subtotales y total general.
* Persistencia del carrito en LocalStorage.
* Checkout simulado con datos de contacto, dirección de entrega, envío, pago y resumen dinámico mediante Reactive Forms.
* Confirmación de pedido con detalle local y limpieza del carrito al finalizar la compra.
* Diseño responsive para desktop, tablet y mobile.
* Imágenes locales para productos.

---

## Tecnologías utilizadas

* Angular 19
* TypeScript
* HTML
* SCSS
* RxJS
* Angular Reactive Forms
* LocalStorage
* Datos mock locales

---

## Funcionalidades implementadas

### Catálogo de productos

El catálogo muestra productos mock organizados en cards o en modo lista. Cada producto incluye imagen, nombre, categoría, subcategoría, atributos, precio, stock disponible y acciones para ver el detalle o agregarlo al carrito.

### Filtros y búsqueda

La aplicación permite filtrar productos desde un panel lateral por categoría, subcategoría, atributos específicos, búsqueda por texto y rango de precio. La lista de subcategorías y atributos se actualiza según la categoría seleccionada. También incluye ordenamiento, selector de vista, contador de resultados, chips para limpiar filtros individuales y estado vacío cuando no hay resultados disponibles.

### Detalle de producto

Cada producto cuenta con una vista individual donde se muestra información ampliada, breadcrumb, precio, stock, variantes visuales, selector de cantidad, características principales agrupadas, beneficios comerciales y opción de agregar al carrito. La ficha mantiene control de stock y adapta el flujo cuando el producto requiere seleccionar variante.

### Carrito de compras

El carrito permite agregar productos, modificar cantidades con control visual, eliminar ítems, calcular subtotales y obtener el total general.
La información se persiste en LocalStorage para conservar el carrito al recargar la página.
Además, el header incluye un cart drawer para ver un resumen rápido sin salir de la pantalla actual.

### Checkout simulado

El checkout incluye un formulario dividido en datos de contacto, dirección de entrega, método de envío y método de pago, todo con validaciones usando Angular Reactive Forms.
El resumen del pedido actualiza el total según el envío elegido y al finalizar la compra se genera una confirmación local más completa antes de vaciar el carrito.

---

## Instalación

Clonar el repositorio:

```bash
git clone git@github.com:02Nico02/nexoshop-angular.git
```

Ingresar al proyecto:

```bash
cd nexoshop-angular
```

Instalar dependencias:

```bash
npm install
```

Ejecutar en entorno local:

```bash
npm start
```

La aplicación queda disponible por defecto en:

```text
http://localhost:4200/
```

---

## Comandos disponibles

```bash
npm start
```

Ejecuta el servidor de desarrollo.

```bash
npm run build
```

Compila la aplicación para producción.

```bash
npm test
```

Ejecuta las pruebas unitarias con Karma.

---

## Estructura del proyecto

```text
src/app
|-- core
|   |-- data
|   |-- models
|   `-- services
|-- features
|   |-- cart
|   |-- checkout
|   |-- home
|   |-- product-detail
|   `-- products
|-- shared
|   `-- components
|       `-- product-card
|-- app.component.*
|-- app.config.ts
`-- app.routes.ts
```

---

## Flujo principal de uso

1. El usuario ingresa al home y visualiza productos destacados.
2. Navega al catálogo y filtra productos por categoría, subcategoría, atributos, precio o nombre.
3. Abre el detalle de un producto.
4. Agrega productos disponibles al carrito.
5. Revisa el carrito, modifica cantidades o elimina productos.
6. Completa el checkout simulado.
7. La aplicación muestra una confirmación local y limpia el carrito.

---

## Decisiones técnicas

* Se utilizan datos mock para mantener el proyecto enfocado en frontend y facilitar su ejecución local.
* El carrito se gestiona desde `CartService`, exponiendo estado reactivo mediante `BehaviorSubject`.
* Se utiliza LocalStorage para conservar el carrito al recargar la aplicación sin requerir backend.
* La lógica de productos, carrito y órdenes se separa en servicios para evitar componentes con responsabilidades mezcladas.
* Las vistas están organizadas por feature para facilitar el mantenimiento y una futura integración con backend.
* Las imágenes de productos se almacenan como assets locales para evitar dependencias externas.

---

## Qué demuestra este proyecto

Este proyecto busca demostrar conocimientos prácticos en:

* Arquitectura básica de una aplicación Angular.
* Componentes reutilizables.
* Servicios y separación de responsabilidades.
* Routing.
* Formularios reactivos.
* Validaciones.
* Manejo de estado simple.
* Persistencia en LocalStorage.
* Diseño responsive.
* Organización de código para proyectos escalables.
* Documentación clara para portfolio.

---

## Capturas de pantalla

Próximamente se agregarán capturas de:

* Home
* Catálogo con filtros
* Detalle de producto
* Carrito
* Checkout con envío y pago simulados

---

## Mejoras futuras

* Conexión con backend real.
* Login de usuarios.
* Historial de pedidos.
* Favoritos.
* Panel administrativo.
* Tests unitarios para servicios y componentes.
* Tests E2E con Playwright.
* Checkout con selección simulada de envío y pago.
* Deploy en Vercel, Netlify o GitHub Pages.
* Mejoras de SEO y accesibilidad.

---

## Estado del proyecto

Versión inicial funcional.
La aplicación compila correctamente con:

```bash
npm run build
```

---

## Autor

**Nicolás Romero**
Desarrollador Full Stack orientado a frontend, Angular, Symfony y soluciones e-commerce.
