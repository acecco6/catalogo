document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('palas.json');
        const productos = await response.json();
        
        // Variables para la paginación
        const productosPorPagina = 16;
        let paginaActual = 1;
        let productosFiltrados = productos;
        const container = document.getElementById('productos-container');

        // Cargar marcas únicas
        const marcas = [...new Set(productos.map(p => p.MARCA))];
        const marcasContainer = document.getElementById('marcasContainer');
        
        marcasContainer.innerHTML = ''; // Limpiar contenedor
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

            productosFiltrados = productos.filter(producto => {
                const precio = parseFloat(producto.PRECIO_VENTA);
                const cumplePrecio = precio >= precioMin && (precioMax === 0 || precio <= precioMax);
                const cumpleMarca = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(producto.MARCA);
                
                return cumplePrecio && cumpleMarca;
            });

            paginaActual = 1; // Resetear a la primera página
            container.innerHTML = ''; // Limpiar el contenedor antes de mostrar los filtrados
            mostrarProductos();
        }

        // Función para mostrar productos paginados
        function mostrarProductos() {
            const container = document.getElementById('productos-container');
            const inicio = (paginaActual - 1) * productosPorPagina;
            const fin = inicio + productosPorPagina;
            const productosAMostrar = productosFiltrados.slice(inicio, fin);

            // Remover solo el botón "Cargar más" si existe
            const botonExistente = container.querySelector('.load-more-container');
            if (botonExistente) {
                botonExistente.remove();
            }

            productosAMostrar.forEach((producto, index) => {
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
                        <img src="${producto.IMG || 'placeholder.jpg'}" alt="${producto.PALETA}" class="producto-imagen" loading="lazy">
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

                // Agregar delay a la animación basado en el índice
                col.style.animationDelay = `${index * 0.1}s`;
                container.appendChild(col);
            });

            // Agregar botón "Cargar más" si hay más productos
            if (fin < productosFiltrados.length) {
                const loadMoreBtn = document.createElement('div');
                loadMoreBtn.className = 'load-more-container';
                loadMoreBtn.innerHTML = `
                    <button class="btn btn-primary load-more-btn">
                        Cargar más productos
                    </button>
                `;
                loadMoreBtn.querySelector('button').addEventListener('click', async (e) => {
                    const btn = e.target;
                    btn.classList.add('loading');
                    btn.disabled = true;
                    
                    // Simular delay para mejor UX
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    paginaActual++;
                    mostrarProductos();
                });
                container.appendChild(loadMoreBtn);
            }
        }

        // Eventos para los filtros
        document.querySelectorAll('.marca-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', filtrarProductos);
        });

        document.getElementById('precioMin').addEventListener('input', filtrarProductos);
        document.getElementById('precioMax').addEventListener('input', filtrarProductos);

        // Mostrar productos iniciales
        mostrarProductos();

    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
});