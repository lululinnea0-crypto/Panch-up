// ================================
// PANCH UPP - MOTOR DEL CARRITO
// ================================

let carrito = [];
let productoActual = {};
let checkoutAvanzado = false;
        // =======================
// GUARDAR CARRITO
// =======================

function guardarCarrito() {

    localStorage.setItem(

        "carritoPanchUpp",

        JSON.stringify(carrito)

    );

}

function cargarCarrito() {

    const datos = localStorage.getItem(

        "carritoPanchUpp"

    );

    if(datos){

        carrito = JSON.parse(datos);

        actualizarCarritoUI();

    }

}

// --------------------
// Abrir / cerrar carrito
// --------------------
function toggleCarrito() {
    const sidebar = document.getElementById("carrito-sidebar");

    sidebar.classList.toggle("translate-x-full");

    if (sidebar.classList.contains("translate-x-full")) {
        checkoutAvanzado = false;
        document.getElementById("formulario-checkout").classList.add("hidden");
        document.getElementById("btn-principal-carrito").innerText =
            "Finalizar Pedido";
    }
}

// --------------------
// Abrir modal
// --------------------
function abrirModal(nombre, precioBase, esSuper) {

    productoActual = {
        nombre,
        precioBase,
        esSuper,
        cantidad: 1
    };

    document.getElementById("modal-titulo").innerText = nombre;

    document.getElementById("modal-precio-base").innerText =
        "$" + precioBase.toLocaleString("es-AR");

    document.getElementById("modal-cantidad").innerText = 1;

    document.getElementById("modal-observaciones").value = "";

    document
        .querySelectorAll(".extra-checkbox")
        .forEach(cb => cb.checked = false);

    if (esSuper) {
        document
            .getElementById("extras-container")
            .classList.remove("hidden");
    } else {
        document
            .getElementById("extras-container")
            .classList.add("hidden");
    }

    document
        .getElementById("modal-producto")
        .classList.remove("hidden");
}

// --------------------
// Cerrar modal
// --------------------
function cerrarModal() {
    document
        .getElementById("modal-producto")
        .classList.add("hidden");
}

// --------------------
// Cantidad
// --------------------
function alterarCantidad(valor) {

    productoActual.cantidad += valor;

    if (productoActual.cantidad < 1) {
        productoActual.cantidad = 1;
    }

    document.getElementById("modal-cantidad").innerText =
        productoActual.cantidad;
}

// --------------------
// Agregar al carrito
// --------------------
function agregarAlCarritoConfirmado() {

    let extras = [];
    let precioExtras = 0;

    if (productoActual.esSuper) {
