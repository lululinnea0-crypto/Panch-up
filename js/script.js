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
            
 {

        document
            .querySelectorAll(".extra-checkbox:checked")
            .forEach(cb => {
                extras.push(cb.value);
                precioExtras += 500;
            });

    }

    const observaciones =
        document.getElementById("modal-observaciones").value.trim();

    const subtotal =
        (productoActual.precioBase + precioExtras) *
        productoActual.cantidad;

    carrito.push({
    id: Date.now(),

    nombre: productoActual.nombre,

    precioUnitario: productoActual.precioBase + precioExtras,

    extras: extras,

    observaciones: observaciones,

    cantidad: productoActual.cantidad,

    subtotal: subtotal
});

    cerrarModal();

    actualizarCarritoUI();
    guardarCarrito();
    toggleCarrito();

    }
        // --------------------
// Actualizar carrito
// --------------------
function actualizarCarritoUI() {

    const container = document.getElementById("carrito-items");

    const totalLabel = document.getElementById("carrito-total");

    const contador = document.getElementById("cart-count");

    container.innerHTML = "";

    if (carrito.length === 0) {

        container.innerHTML = `
            <p class="text-zinc-500 text-center py-8 text-sm">
                Tu carrito está vacío.
            </p>
        `;

        totalLabel.innerText = "$0";

        contador.innerText = "0";

        return;
    }

    let total = 0;

    let totalItems = 0;

    carrito.forEach((item, indice) => {

        total += item.subtotal;

        totalItems += item.cantidad;

        const tarjeta = document.createElement("div");

        tarjeta.className =
            "bg-black p-3 rounded-xl border border-gray-900 flex justify-between items-start";

        let html = `
            <div>

                <h4 class="font-bold text-sm">
                    ${item.nombre} x${item.cantidad}
                </h4>
        `;

        if (item.extras.length > 0) {

            html += `
                <p class="text-xs text-cyan-neon mt-1">
                    + Extras:
                    ${item.extras.join(", ")}
                </p>
            `;

        }

        if (item.observaciones !== "") {

            html += `
                <p class="text-xs text-gray-500 italic mt-1">
                    ${item.observaciones}
                </p>
            `;

        }

        html += `
                <span class="text-xs text-gray-400 block mt-2">
                    Subtotal:
                    $${item.subtotal.toLocaleString("es-AR")}
                </span>

            </div>

            <button
                onclick="removerDelCarrito(${indice})"
                class="text-red-500 hover:text-red-300 text-lg font-bold">

                ✕

            </button>
        `;

        tarjeta.innerHTML = html;

        container.appendChild(tarjeta);

    });

    totalLabel.innerText =
        "$" + total.toLocaleString("es-AR");

    contador.innerText = totalItems;

}

// --------------------
// Eliminar producto
// --------------------
function removerDelCarrito(indice){

    carrito.splice(indice,1);

    actualizarCarritoUI();

    guardarCarrito();

}
 // --------------------
// Checkout
// --------------------
function avanzarCheckout() {

    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const formulario =
        document.getElementById("formulario-checkout");

    const boton =
        document.getElementById("btn-principal-carrito");

    if (!checkoutAvanzado) {

        formulario.classList.remove("hidden");

        boton.innerText =
            "Enviar pedido por WhatsApp 🚀";

        checkoutAvanzado = true;

        return;
    }

    enviarPedidoWhatsApp();

}
        // --------------------
// Enviar pedido por WhatsApp
// --------------------
function enviarPedidoWhatsApp() {

    const nombre = document.getElementById("check-nombre").value.trim();
    const telefono = document.getElementById("check-telefono").value.trim();
    const direccion = document.getElementById("check-direccion").value.trim();
    const pago = document.getElementById("check-pago").value;

    if (!nombre || !telefono || !direccion || !pago) {

        alert("Completá todos los datos.");

        return;

    }

    let mensaje = "🌭 *Pedido Panch Upp*%0A%0A";

    let total = 0;

    carrito.forEach(item => {

        mensaje += "• " + item.nombre;

        mensaje += " x" + item.cantidad + "%0A";

        if (item.extras.length > 0) {

            mensaje += "Extras: " + item.extras.join(", ");

            mensaje += "%0A";

        }

        if (item.observaciones !== "") {

            mensaje += "Obs: " + item.observaciones;

            mensaje += "%0A";

        }

        mensaje += "Subtotal: $" + item.subtotal.toLocaleString("es-AR");

        mensaje += "%0A%0A";

        total += item.subtotal;

    });

    mensaje += "💰 Total: $" + total.toLocaleString("es-AR");

    mensaje += "%0A%0A";

    mensaje += "👤 Nombre: " + nombre;

    mensaje += "%0A";

    mensaje += "📞 Teléfono: " + telefono;

    mensaje += "%0A";

    mensaje += "📍 Dirección: " + direccion;

    mensaje += "%0A";

    mensaje += "💳 Pago: " + pago;

    const numero = "5493512901763";

    window.open(

        "https://wa.me/" + numero + "?text=" + mensaje,

        "_blank"

    );

}
        // Cargar carrito guardado al abrir la página
window.onload = function () {
    cargarCarrito();
};
