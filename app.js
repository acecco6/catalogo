document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('palas.json');
        const productos = await response.json();
        
        // Cargar marcas únicas
        const marcas = [...new Set(productos.map(p => p.MARCA))];
        const marcasContainer = document.getElementById('marcasContainer');
        
        marcas.forEach(marca => {
            const div = document.createElement('div');
            div.innerHTML = `
                <input type="checkbox" id="marca-${marca}" value="${marca}" class="marca-checkbox">
                <label for="marca-${marca}" class="marca-label">${marca}</label>
            `;
            marcasContainer.appendChild(div);
        });

        // Función para filtrar productos
        function filtrarProductos() {
            const marcasSeleccionadas = Array.from(document.querySelectorAll('.marca-checkbox:checked'))
                .map(checkbox => checkbox.value);
            
            const precioMin = parseFloat(document.getElementById('precioMin').value) || 0;
            const precioMax = parseFloat(document.getElementById('precioMax').value) || Infinity;

            const productosFiltrados = productos.filter(producto => {
                const precio = parseFloat(producto.PRECIO_VENTA);
                const cumplePrecio = precio >= precioMin && (precioMax === 0 || precio <= precioMax);
                const cumpleMarca = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(producto.MARCA);
                
                return cumplePrecio && cumpleMarca;
            });

            mostrarProductos(productosFiltrados);
        }

        // Eventos para los filtros
        document.querySelectorAll('.marca-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', filtrarProductos);
        });

        document.getElementById('precioMin').addEventListener('input', filtrarProductos);
        document.getElementById('precioMax').addEventListener('input', filtrarProductos);

        // Mostrar todos los productos inicialmente
        mostrarProductos(productos);

    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
});

function mostrarProductos(productos) {
    const container = document.getElementById('productos-container');
    container.innerHTML = '';

    productos.forEach(producto => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-lg-4 col-xl-3';
        
        // Formatear precios
        const precioOriginal = parseInt(producto.PRECIO_VENTA);
        const precioTransferencia = parseInt(producto.PRECIO_VENTA_TRANSFERENCIA);
        const precioCuota = Math.round(precioOriginal / 3);

        const precioFormateado = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(precioOriginal);

        const precioTransferenciaFormateado = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(precioTransferencia);

        const precioCuotaFormateado = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(precioCuota);

        col.innerHTML = `
            <div class="card producto-card">
                <span class="marca-badge">${producto.MARCA}</span>
                <img src="${producto.IMG || 'placeholder.jpg'}" alt="${producto.PALETA}" class="producto-imagen">
                <div class="card-body">
                    <h5 class="producto-nombre">${producto.PALETA}</h5>
                    <div class="precio-container">
                        <p class="precio">${precioFormateado}</p>
                        <p class="precio-transferencia">
                            ${precioTransferenciaFormateado} con transferencia
                        </p>
                        <small class="precio-cuotas">
                            3 cuotas sin interés de ${precioCuotaFormateado}
                        </small>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(col);
    });
}

// Función para filtrar productos
function filtrarProductos() {
    const marcasSeleccionadas = Array.from(document.querySelectorAll('.marca-checkbox:checked'))
        .map(checkbox => checkbox.value);
    
    const precioMin = parseInt(document.getElementById('precioMin').value) || 0;
    const precioMax = parseInt(document.getElementById('precioMax').value) || Infinity;

    const productosFiltrados = productos.filter(producto => {
        const precio = parseInt(producto.PRECIO_VENTA);
        const cumplePrecio = precio >= precioMin && (precioMax === 0 || precio <= precioMax);
        const cumpleMarca = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(producto.MARCA);
        
        return cumplePrecio && cumpleMarca;
    });

    mostrarProductos(productosFiltrados);
}

// Antes de cargar las marcas
marcasContainer.innerHTML = ''; // Limpia el contenedor antes de agregar nuevas marcas

// Luego agrega las marcas