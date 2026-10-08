let carrito = [];

// Cambiar entre pestaña Menú y Ventas
function cambiarPestana(pestana) {
    const secMenu = document.getElementById('seccion-menu');
    const secVentas = document.getElementById('seccion-ventas');
    const btnMenu = document.getElementById('btn-tab-menu');
    const btnVentas = document.getElementById('btn-tab-ventas');

    if (pestana === 'menu') {
        if (secMenu) secMenu.style.display = 'grid';
        if (secVentas) secVentas.style.display = 'none';
        if (btnMenu) btnMenu.classList.add('active');
        if (btnVentas) btnVentas.classList.remove('active');
    } else {
        if (secMenu) secMenu.style.display = 'none';
        if (secVentas) secVentas.style.display = 'block';
        if (btnMenu) btnMenu.classList.remove('active');
        if (btnVentas) btnVentas.classList.add('active');
        cargarVentas();
    }
}

// Cargar catálogo de productos desde MySQL
async function cargarProductos() {
    try {
        const res = await fetch('api/productos.php');
        if (!res.ok) throw new Error(`Error en servidor: ${res.status}`);
        
        const productos = await res.json();
        const contenedor = document.getElementById('menu-container');
        if (!contenedor) return;

        if (!Array.isArray(productos) || productos.length === 0) {
            contenedor.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay productos registrados.</p>';
            return;
        }

        contenedor.innerHTML = '';
        productos.forEach(p => {
            // Asignar imagen dinámica según categoría
            let imagenUrl = p.imagen;
            if (!imagenUrl) {
                if (p.categoria && p.categoria.toLowerCase().includes('papas')) {
                    imagenUrl = 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400';
                } else if (p.categoria && p.categoria.toLowerCase().includes('bebida')) {
                    imagenUrl = 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400';
                } else {
                    imagenUrl = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400';
                }
            }

            const descripcionTexto = p.descripcion || `Categoría: ${p.categoria || 'General'} | Stock: ${p.stock ?? 'N/A'}`;

            contenedor.innerHTML += `
                <div class="card-producto">
                    <img src="${imagenUrl}" alt="${p.nombre}" onerror="this.src='https://via.placeholder.com/300x160?text=Sin+Imagen'">
                    <div class="card-producto-content">
                        <h3>${p.nombre}</h3>
                        <p class="descripcion">${descripcionTexto}</p>
                        <p class="precio">$${parseFloat(p.precio).toLocaleString()}</p>
                        <button onclick="agregarAlCarrito(${p.id}, '${p.nombre.replace(/'/g, "\\'")}', ${p.precio})">Agregar al Pedido</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

function agregarAlCarrito(id, nombre, precio) {
    carrito.push({ id, nombre, precio });
    actualizarCarrito();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

function actualizarCarrito() {
    const lista = document.getElementById('carrito-lista');
    const totalEl = document.getElementById('carrito-total');
    if (!lista || !totalEl) return;

    lista.innerHTML = '';

    if (carrito.length === 0) {
        lista.innerHTML = '<li class="empty-cart">No hay productos seleccionados.</li>';
        totalEl.innerText = '$0';
        return;
    }

    let total = 0;
    carrito.forEach((item, index) => {
        total += parseFloat(item.precio);
        lista.innerHTML += `
            <li class="cart-item">
                <div>
                    <div class="cart-item-title">${item.nombre}</div>
                    <div class="cart-item-price">$${Number(item.precio).toLocaleString()}</div>
                </div>
                <button class="btn-remove" onclick="eliminarDelCarrito(${index})">✕</button>
            </li>
        `;
    });

    totalEl.innerText = `$${total.toLocaleString()}`;
}

async function enviarPedido() {
    const inputCliente = document.getElementById('cliente-nombre');
    const cliente = inputCliente ? inputCliente.value.trim() : '';

    if (!cliente) {
        alert("Por favor escribe el nombre del cliente o número de mesa.");
        return;
    }

    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    const total = carrito.reduce((sum, item) => sum + parseFloat(item.precio), 0);

    try {
        const respuesta = await fetch('api/pedidos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cliente, total })
        });

        if (!respuesta.ok) throw new Error(`Error en servidor: ${respuesta.status}`);

        const resultado = await respuesta.json();

        if (resultado.status === 'ok') {
            alert("🎉 ¡Pedido registrado con éxito!");
            carrito = [];
            actualizarCarrito();
            if (inputCliente) inputCliente.value = '';
        } else {
            alert("Error al guardar: " + (resultado.error || 'Desconocido'));
        }
    } catch (error) {
        console.error("Error al enviar pedido:", error);
        alert("No se pudo enviar el pedido a la base de datos.");
    }
}

async function cargarVentas() {
    try {
        const res = await fetch('api/pedidos.php');
        if (!res.ok) throw new Error(`Error en servidor: ${res.status}`);

        const ventas = await res.json();
        const tablaBody = document.getElementById('tabla-ventas-body');
        const kpiTotal = document.getElementById('kpi-total-ventas');
        const kpiCantidad = document.getElementById('kpi-cantidad-pedidos');
        
        if (!tablaBody) return;
        tablaBody.innerHTML = '';

        if (!Array.isArray(ventas) || ventas.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay ventas registradas.</td></tr>';
            if (kpiTotal) kpiTotal.innerText = '$0';
            if (kpiCantidad) kpiCantidad.innerText = '0';
            return;
        }

        let totalAcumulado = 0;
        ventas.forEach(v => {
            totalAcumulado += parseFloat(v.total);
            tablaBody.innerHTML += `
                <tr>
                    <td><strong>#${v.id}</strong></td>
                    <td>${v.cliente}</td>
                    <td><strong style="color: var(--accent);">$${Number(v.total).toLocaleString()}</strong></td>
                    <td>${new Date(v.fecha).toLocaleString()}</td>
                </tr>
            `;
        });

        if (kpiTotal) kpiTotal.innerText = `$${totalAcumulado.toLocaleString()}`;
        if (kpiCantidad) kpiCantidad.innerText = ventas.length;

    } catch (error) {
        console.error("Error al cargar ventas:", error);
    }
}

document.addEventListener('DOMContentLoaded', cargarProductos);