# 🍔 Burger Master POS

Sistema Web Punto de Venta (POS) y gestión de pedidos para restaurante, desarrollado con arquitectura cliente-servidor nativa y base de datos relacional MySQL en la nube.

---

## 🚀 Demo en Vivo
- **URL de la Aplicación:** [http://burgermaster.infinityfreeapp.com/?i=1](http://burgermaster.infinityfreeapp.com/?i=1)

---

## 🛠️ Tecnologías Utilizadas
- **Frontend:** HTML5, CSS3 (Responsive Grid Layout & Flexbox), JavaScript Vanilla (ES6+ / Fetch API).
- **Backend:** PHP (API RESTful para catálogo de productos y registro de pedidos).
- **Base de Datos:** MySQL (Relacional) administrada mediante phpMyAdmin.
- **Hosting / Deploy:** InfinityFree Web Hosting.

---

## 📋 Funcionalidades Principales
1. **Catálogo Dinámico:** Carga de productos desde base de datos MySQL filtrados por categoría (hamburguesas, acompañamientos, bebidas).
2. **Carrito de Compras Interactivo:** Cálculo automático de totales, adición y eliminación de ítems en tiempo real.
3. **Registro de Pedidos:** Envío de órdenes asignadas a clientes o mesas directamente a la base de datos.
4. **Historial de Ventas & KPIs:** Consulta de pedidos acumulados, total recaudado y búsqueda en tiempo real.

---

## 🗄️ Estructura del Proyecto
```text
burger-master-pos/
├── api/
│   ├── productos.php    # API GET para obtener el catálogo de productos
│   └── pedidos.php      # API GET y POST para la consulta y registro de pedidos
├── index.html           # Interfaz principal de usuario
├── styles.css           # Estilos responsivos de la aplicación
├── app.js               # Lógica del frontend, Fetch API y manejo del carrito
└── README.md            # Documentación del repositorio