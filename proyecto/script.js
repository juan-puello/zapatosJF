function verProducto(nombre, imagen, precio, descripcion) {
    const producto = { nombre, imagen, precio, descripcion };
    localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
    window.location.href = 'producto.html';
}

if (window.location.pathname.includes('producto.html')) {
    const producto = JSON.parse(localStorage.getItem('productoSeleccionado'));

    const detalle = document.getElementById('detalleProducto');
    const chancletas = document.getElementById('chancletas');
    const zapatos = document.getElementById('zapatos');

    if (detalle) detalle.style.display = 'none';
    if (chancletas) chancletas.style.display = 'none';
    if (zapatos) zapatos.style.display = 'none';

    if (producto && detalle) {
        detalle.style.display = 'block';
        document.getElementById('imgProducto').src = producto.imagen;
        document.getElementById('nombreProducto').innerText = producto.nombre;
        document.getElementById('precioProducto').innerText = producto.precio;
        document.getElementById('descripcionProducto').innerText = producto.descripcion;
    }
}

// ----------------- CARRITO -----------------
function agregarAlCarrito() {
    if (!usuarioLogueado()) {
        alert("Debes iniciar sesión para agregar productos al carrito.");
        return;
    }

    const producto = JSON.parse(localStorage.getItem('productoSeleccionado'));
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert('Producto agregado al carrito');
    actualizarContador();
}

if (window.location.pathname.includes('carrito.html')) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedor = document.getElementById('carrito');
    const totalEl = document.getElementById('total');
    let total = 0;

    carrito.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('carrito-item');
        div.innerHTML = `
            <span>${item.nombre} - ${item.precio}</span>
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        contenedor.appendChild(div);
        total += parseFloat(item.precio.replace(/[^0-9]/g, ''));
    });

    totalEl.innerText = 'Total: $' + total.toLocaleString();

    // Botón finalizar compra
    if (carrito.length > 0) {
        const finalizarBtn = document.createElement('button');
        finalizarBtn.innerText = 'Finalizar Compra';
        finalizarBtn.style.marginTop = '10px';
        finalizarBtn.style.width = '100%';
        finalizarBtn.style.backgroundColor = '#d4af37';
        finalizarBtn.style.color = 'black';
        finalizarBtn.style.border = 'none';
        finalizarBtn.style.padding = '1rem';
        finalizarBtn.style.borderRadius = '10px';
        finalizarBtn.style.cursor = 'pointer';
        finalizarBtn.addEventListener('click', finalizarCompra);
        contenedor.appendChild(finalizarBtn);
    }
}

function finalizarCompra() {
    if (!usuarioLogueado()) {
        alert("Debes iniciar sesión para finalizar la compra.");
        return;
    }

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    const total = carrito.reduce((sum, item) => sum + parseFloat(item.precio.replace(/[^0-9]/g, '')), 0);
    alert(`¡Compra realizada con éxito! Total: $${total.toLocaleString()}`);
    localStorage.removeItem('carrito');
    location.reload();
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    location.reload();
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
    location.reload();
}

function usuarioLogueado() {
    return localStorage.getItem('usuarioActual') !== null;
}

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios')) || [];
}

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('btnLogin');
    const registroBtn = document.getElementById('btnRegistro');

    const loginModal = document.getElementById('modalLogin');
    const registroModal = document.getElementById('modalRegistro');

    loginBtn.addEventListener('click', () => loginModal.style.display = 'block');
    registroBtn.addEventListener('click', () => registroModal.style.display = 'block');

    document.getElementById('closeLogin').addEventListener('click', () => loginModal.style.display = 'none');
    document.getElementById('closeRegistro').addEventListener('click', () => registroModal.style.display = 'none');

    window.addEventListener('click', (e) => {
        if (e.target == loginModal) loginModal.style.display = 'none';
        if (e.target == registroModal) registroModal.style.display = 'none';
    });

    // Login
    document.getElementById('loginSubmit').addEventListener('click', () => {
        const email = document.getElementById('loginEmail').value.trim();
        const pass = document.getElementById('loginPass').value.trim();

        if (!email || !pass) { alert("Todos los campos son obligatorios."); return; }

        const usuarios = obtenerUsuarios();
        const usuario = usuarios.find(u => u.email === email && u.pass === pass);

        if (usuario) {
            localStorage.setItem('usuarioActual', JSON.stringify(usuario));
            alert("Bienvenido, " + usuario.nombre);
            loginModal.style.display = 'none';
            actualizarContador();
        } else {
            alert("Usuario no registrado o datos incorrectos");
        }
    });

    // Registro
    document.getElementById('registroSubmit').addEventListener('click', () => {
        const nombre = document.getElementById('regNombre').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const celular = document.getElementById('regCelular').value.trim();
        const pass = document.getElementById('regPass').value.trim();

        if (!nombre || !email || !celular || !pass) { alert("Todos los campos son obligatorios."); return; }

        let usuarios = obtenerUsuarios();
        if (usuarios.find(u => u.email === email)) { alert("Este correo ya está registrado."); return; }

        const nuevoUsuario = { nombre, email, celular, pass };
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('usuarioActual', JSON.stringify(nuevoUsuario));
        alert("Usuario registrado con éxito. Bienvenido, " + nombre);
        registroModal.style.display = 'none';
        actualizarContador();
    });

    actualizarContador();
    agregarEventoCarritoFlotante();
});

function actualizarContador() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contador = document.getElementById('contador-carrito');
    if (contador) contador.innerText = carrito.length;
}

function agregarEventoCarritoFlotante() {
    const carritoFlotante = document.getElementById('carrito-flotante');
    const dropdown = document.getElementById('dropdown-carrito');
    carritoFlotante.addEventListener('click', () => {
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        } else {
            mostrarCarritoDropdown();
            dropdown.style.display = 'block';
        }
    });
}

function mostrarCarritoDropdown() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const dropdown = document.getElementById('dropdown-carrito');
    dropdown.innerHTML = '';
    carrito.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('carrito-item');
        div.innerHTML = `
            <span>${item.nombre} - ${item.precio}</span>
            <button onclick="eliminarDelCarritoDropdown(${index})">Eliminar</button>
        `;
        dropdown.appendChild(div);
    });

    if (carrito.length > 0) {
        const finalizarBtn = document.createElement('button');
        finalizarBtn.innerText = 'Finalizar Compra';
        finalizarBtn.style.marginTop = '10px';
        finalizarBtn.style.width = '100%';
        finalizarBtn.style.backgroundColor = '#d4af37';
        finalizarBtn.style.color = 'black';
        finalizarBtn.style.border = 'none';
        finalizarBtn.style.padding = '0.5rem';
        finalizarBtn.style.borderRadius = '10px';
        finalizarBtn.style.cursor = 'pointer';
        finalizarBtn.addEventListener('click', finalizarCompra);
        dropdown.appendChild(finalizarBtn);
    }
}

function eliminarDelCarritoDropdown(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContador();
    mostrarCarritoDropdown();
}
