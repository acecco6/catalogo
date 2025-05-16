const productos = [
    {
        marca: "BULLPADEL",
        modelo: "HACK 02 Performance 2024",
        precio: 294848,
        precioTransferencia: 241679,
        cuotas: 98283,
        imagen: "https://http2.mlstatic.com/D_NQ_NP_695674-MLU77692950565_072024-O.webp"
    },
    {
        marca: "ADIDAS",
        modelo: "MATCH Black 3.4 2025",
        precio: 256914,
        precioTransferencia: 210585,
        cuotas: 85638
    },
    {
        marca: "ADIDAS",
        modelo: "DRIVE Grey 3.4 2025",
        precio: 267451,
        precioTransferencia: 219222,
        cuotas: 89150
    }
    // Puedes agregar más productos aquí
];

function cargarProductos() {
    const contenedor = document.getElementById('productos');
    
    productos.forEach(producto => {
        const cardHTML = `
            <div class="col-12 col-md-6 col-lg-3">
                <div class="card">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.modelo}">
                    <div class="card-body">
                        <h6 class="marca">${producto.marca}</h6>
                        <h5 class="card-title">${producto.modelo}</h5>
                        <p class="precio">$ ${producto.precio.toLocaleString()}</p>
                        <p class="precio-transferencia">$ ${producto.precioTransferencia.toLocaleString()} con transferencia</p>
                        <p class="cuotas">3 cuotas sin interés de $ ${producto.cuotas.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += cardHTML;
    });
}

document.addEventListener('DOMContentLoaded', cargarProductos);