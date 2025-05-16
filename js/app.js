// Variables globales
let productos = []; // Almacenará todos los productos
let productosFiltrados = []; // Almacenará los productos filtrados
let marcasSeleccionadas = []; // Almacenará las marcas seleccionadas
let itemsPorPagina = 20; // Número de productos a mostrar por página
let paginaActual = 1; // Página actual

// Función para cargar los productos desde el archivo JSON
function cargarProductos() {
    fetch('palas.json')
        .then(response => response.json())
        .then(data => {
            productos = data;
            productosFiltrados = [...productos];
            aplicarFiltros();
        })
        .catch(error => console.error('Error cargando productos:', error));
}

// Función para calcular el precio en 3 cuotas sin interés
function calcularCuotas(precio) {
    const precioNumerico = parseInt(precio);
    const precioCuota = Math.round(precioNumerico / 3);
    return precioCuota.toLocaleString();
}

// Función para mostrar los productos en el contenedor
function mostrarProductos() {
    const contenedor = document.getElementById('productos-container');
    contenedor.innerHTML = ''; // Limpiar el contenedor
    
    // Calcular el índice de inicio y fin para la paginación
    const inicio = 0;
    const fin = paginaActual * itemsPorPagina;
    
    // Obtener los productos a mostrar según la paginación
    const productosAMostrar = productosFiltrados.slice(inicio, fin);
    
    // Mostrar los productos
    productosAMostrar.forEach(producto => {
        const cardHTML = `
            <div class="col-12 col-md-6 col-lg-3 producto-item" 
                 data-marca="${producto.MARCA}" 
                 data-precio="${producto.PRECIO_VENTA_TRANSFERENCIA}">
                <div class="producto-card" data-producto-index="${productos.indexOf(producto)}">
                    <div class="producto-imagen">
                        <span class="marca-badge">${producto.MARCA}</span>
                        <img src="${producto.IMG}" alt="${producto.PALETA}">
                    </div>
                    <div class="producto-info">
                        <h5 class="producto-nombre">${producto.PALETA}</h5>
                        <div class="producto-precio">$ ${parseInt(producto.PRECIO_VENTA).toLocaleString()}</div>
                        <div class="producto-precio-transferencia">$ ${parseInt(producto.PRECIO_VENTA_TRANSFERENCIA).toLocaleString()} con transferencia</div>
                        <div class="producto-cuotas">
                            <i class="fas fa-credit-card"></i> 
                            3 cuotas sin interés de $ ${calcularCuotas(producto.PRECIO_VENTA)}
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += cardHTML;
    });
    
    // Agregar eventos de clic a las tarjetas de productos
    document.querySelectorAll('.producto-card').forEach(card => {
        card.addEventListener('click', function() {
            const productoIndex = this.getAttribute('data-producto-index');
            abrirModal(productos[productoIndex]);
        });
    });
    
    // Mostrar u ocultar el botón "Cargar más" según corresponda
    mostrarBotonCargarMas();
}

// Función para abrir el modal con los detalles del producto
function abrirModal(producto) {
    // Obtener elementos del modal
    const modal = document.getElementById('producto-modal');
    const modalImg = document.getElementById('modal-img');
    const modalNombre = document.getElementById('modal-nombre');
    const modalMarca = document.getElementById('modal-marca');
    const modalPrecio = document.getElementById('modal-precio');
    const modalPrecioTransferencia = document.getElementById('modal-precio-transferencia');
    const modalCuotas = document.getElementById('modal-cuotas');
    
    // Llenar el modal con los datos del producto
    modalImg.src = producto.IMG;
    modalImg.alt = producto.PALETA;
    modalNombre.textContent = producto.PALETA;
    modalMarca.textContent = producto.MARCA;
    modalPrecio.innerHTML = `$ ${parseInt(producto.PRECIO_VENTA).toLocaleString()}`;
    modalPrecioTransferencia.innerHTML = `<i class="fas fa-percentage"></i> $ ${parseInt(producto.PRECIO_VENTA_TRANSFERENCIA).toLocaleString()} con transferencia`;
    modalCuotas.innerHTML = `<i class="fas fa-credit-card"></i> 3 cuotas sin interés de $ ${calcularCuotas(producto.PRECIO_VENTA)}`;
    
    // Mostrar el modal
    modal.classList.add('activo');
    
    // Bloquear el scroll del body
    document.body.style.overflow = 'hidden';
}

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.getElementById('producto-modal');
    modal.classList.remove('activo');
    
    // Restaurar el scroll del body
    document.body.style.overflow = 'auto';
}

// Función para mostrar u ocultar el botón "Cargar más"
function mostrarBotonCargarMas() {
    const contenedor = document.getElementById('productos-container');
    
    // Eliminar el botón existente si hay uno
    const botonExistente = document.getElementById('cargar-mas-btn');
    if (botonExistente) {
        botonExistente.remove();
    }
    
    // Verificar si hay más productos para cargar
    if (paginaActual * itemsPorPagina < productosFiltrados.length) {
        // Crear el botón "Cargar más"
        const botonCargarMas = document.createElement('div');
        botonCargarMas.className = 'col-12 text-center mt-4';
        botonCargarMas.innerHTML = `
            <button id="cargar-mas-btn" class="btn-cargar-mas">
                Cargar más productos
                <i class="fas fa-arrow-down ms-2"></i>
            </button>
        `;
        contenedor.parentNode.appendChild(botonCargarMas);
        
        // Agregar evento de clic al botón
        document.getElementById('cargar-mas-btn').addEventListener('click', () => {
            paginaActual++;
            mostrarProductos();
        });
    }
}

// Función para aplicar los filtros
function aplicarFiltros() {
    // Obtener los valores de los filtros
    const textoBusqueda = document.getElementById('searchInput').value.toLowerCase();
    const precioMin = document.getElementById('precioMin').value ? parseInt(document.getElementById('precioMin').value) : 0;
    const precioMax = document.getElementById('precioMax').value ? parseInt(document.getElementById('precioMax').value) : Infinity;
    
    // Filtrar los productos
    productosFiltrados = productos.filter(producto => {
        // Filtrar por texto de búsqueda
        const coincideTexto = producto.PALETA.toLowerCase().includes(textoBusqueda);
        
        // Filtrar por marca
        const coincideMarca = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(producto.MARCA);
        
        // Filtrar por precio
        const precio = parseInt(producto.PRECIO_VENTA_TRANSFERENCIA);
        const coincidePrecio = precio >= precioMin && precio <= precioMax;
        
        return coincideTexto && coincideMarca && coincidePrecio;
    });
    
    // Resetear la paginación
    paginaActual = 1;
    
    // Mostrar los productos filtrados
    mostrarProductos();
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Cargar los productos
    cargarProductos();
    
    // Configurar los eventos de filtrado
    document.getElementById('searchInput').addEventListener('input', aplicarFiltros);
    document.getElementById('precioMin').addEventListener('input', aplicarFiltros);
    document.getElementById('precioMax').addEventListener('input', aplicarFiltros);
    
    // Configurar los botones de marca
    const botonesMarcar = document.querySelectorAll('.marca-btn');
    botonesMarcar.forEach(boton => {
        boton.addEventListener('click', () => {
            const marca = boton.getAttribute('data-marca');
            
            // Alternar la selección de la marca
            if (marcasSeleccionadas.includes(marca)) {
                marcasSeleccionadas = marcasSeleccionadas.filter(m => m !== marca);
                boton.classList.remove('active');
            } else {
                marcasSeleccionadas.push(marca);
                boton.classList.add('active');
            }
            
            // Aplicar los filtros
            aplicarFiltros();
        });
    });
    
    // Configurar el botón para mostrar/ocultar filtros en móviles
    const toggleFiltrosBtn = document.getElementById('toggleFiltros');
    const filtrosContainer = document.getElementById('filtrosContainer');
    
    if (toggleFiltrosBtn && filtrosContainer) {
        toggleFiltrosBtn.addEventListener('click', () => {
            filtrosContainer.classList.toggle('active');
            
            // Cambiar el texto del botón según el estado
            if (filtrosContainer.classList.contains('active')) {
                toggleFiltrosBtn.innerHTML = '<i class="fas fa-times"></i> Cerrar filtros';
            } else {
                toggleFiltrosBtn.innerHTML = '<i class="fas fa-filter"></i> Filtros';
            }
        });
    }
    
    // Configurar el evento para cerrar el modal
    const cerrarModalBtn = document.querySelector('.cerrar-modal');
    if (cerrarModalBtn) {
        cerrarModalBtn.addEventListener('click', cerrarModal);
    }
    
    // Cerrar el modal al hacer clic fuera del contenido
    const modal = document.getElementById('producto-modal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                cerrarModal();
            }
        });
    }
    
    // Cerrar el modal con la tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('activo')) {
            cerrarModal();
        }
    });
});