// Script para manejar las transiciones del modal
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const modal = document.getElementById('producto-modal');
    const cerrarModalBtn = document.querySelector('.cerrar-modal');
    
    // Duración de la transición de cierre en milisegundos (reducida para mayor velocidad)
    const duracionTransicion = 300;
    
    // Función para abrir el modal con los datos del producto
    window.abrirModal = function(producto) {
        // Obtener elementos del modal
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
        modal.classList.remove('cerrando');
        modal.classList.add('activo');
        
        // Bloquear el scroll del body
        document.body.style.overflow = 'hidden';
    };
    
    // Función para cerrar el modal con transición
    window.cerrarModal = function() {
        // Agregar clase para la animación de cierre
        modal.classList.add('cerrando');
        modal.classList.remove('activo');
        
        // Esperar a que termine la transición antes de ocultar completamente
        setTimeout(function() {
            // Restaurar el scroll del body
            document.body.style.overflow = 'auto';
        }, duracionTransicion);
    };
    
    // Configurar el evento para cerrar el modal
    if (cerrarModalBtn) {
        cerrarModalBtn.addEventListener('click', cerrarModal);
    }
    
    // Cerrar el modal al hacer clic fuera del contenido
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
    
    // Función auxiliar para calcular cuotas (si no está definida en app.js)
    function calcularCuotas(precio) {
        const precioNumerico = parseInt(precio);
        const precioCuota = Math.round(precioNumerico / 3);
        return precioCuota.toLocaleString();
    }
});