// ============================================
// SISTEMA DE CITAS - VERSIÓN CORREGIDA
// ============================================

const supabaseUrl = 'https://bijqxtrtacnaurfouvot.supabase.co';
const supabaseKey = 'TU_SUPABASE_KEY';

// 📧 CONFIGURACIÓN DE RESEND PARA EMAILS
const RESEND_API_KEY = 'TU_RESEND_API_KEY';
const EMAIL_FROM = 'onboarding@resend.dev';

let client;
let citas = [];
let busqueda = "";
let esAdmin = false;
let vistaActual = "agendar";
let fechaSeleccionada = new Date();
let slotSeleccionado = null;

const PASSWORD_ADMIN = "1234";
const numeroWhatsApp = "524425761233";

// --------- SLOTS AUTOMÁTICOS ---------
function generarSlots(fecha) {
    const slots = [];
    const ahora = new Date();
    const esHoy = fecha.toDateString() === ahora.toDateString();

    for (let h = 9; h < 17; h++) {
        for (let m = 0; m < 60; m += 30) {

            const slotFecha = new Date(fecha);
            slotFecha.setHours(h, m, 0, 0);

            const hora12 = slotFecha.toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });

            const horaKey = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

            const fechaStr = fecha.toISOString().split("T")[0];

            const ocupado = citas.some(c =>
                c.fecha === fechaStr &&
                c.horario === horaKey
            );

            const pasado = esHoy && slotFecha <= ahora;

            slots.push({
                hora12,
                horaKey,
                ocupado,
                pasado
            });
        }
    }

    return slots;
}

// --------- STORAGE ---------
async function guardarCitaSupabase(cita) {

    const codigoVerificacion = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    const { error } = await client
        .from('appointments')
        .insert([
            {
                client_name: cita.nombre,
                client_phone: cita.telefono,
                client_email: cita.email,
                appointment_date: cita.fecha,
                appointment_time: cita.horario,
                client_verification_code: codigoVerificacion
            }
        ]);

    if (error) {
        console.error("Error guardando cita:", error);
        alert("Error guardando cita: " + error.message);
        return false;
    }

    cita.codigoVerificacion = codigoVerificacion;

    return true;
}

async function cargarCitas() {

    const { data, error } = await client
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

    if (error) {
        console.error("Error cargando citas:", error);
        return;
    }

    citas = data.map(c => ({
        id: c.id,
        nombre: c.client_name,
        telefono: c.client_phone,
        email: c.client_email,
        fecha: c.appointment_date,
        horario: c.appointment_time,
        codigoVerificacion: c.client_verification_code
    }));
}

// --------- HELPERS ---------
function telefonoValido(tel) {
    return /^[0-9]{10}$/.test(tel);
}

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// 📧 ENVIAR EMAIL
async function enviarEmail(email, asunto, html) {

    try {

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: EMAIL_FROM,
                to: email,
                subject: asunto,
                html: html
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Error enviando email:', data);
            return false;
        }

        console.log('Email enviado:', data);

        return true;

    } catch (error) {

        console.error(error);

        return false;
    }
}

// 📧 HTML EMAIL
function crearEmailConfirmacion(cita) {

    const fechaHora = new Date(`${cita.fecha}T${cita.horario}`);

    const fechaFormato = fechaHora.toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const horaFormato = fechaHora.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    return `
    <div style="font-family:Arial;padding:24px;background:#f1f5f9;">
        <div style="max-width:600px;margin:auto;background:white;padding:32px;border-radius:16px;">
            <h1 style="margin-top:0;">✅ Cita confirmada</h1>

            <p>Hola <strong>${cita.nombre}</strong></p>

            <p>Tu cita fue reservada correctamente.</p>

            <div style="background:#f8fafc;padding:20px;border-radius:12px;">

                <p><strong>📅 Fecha:</strong> ${fechaFormato}</p>

                <p><strong>🕐 Hora:</strong> ${horaFormato}</p>

                <p>
                    <strong>🔐 Código:</strong>
                    ${cita.codigoVerificacion}
                </p>

            </div>
        </div>
    </div>
    `;
}

// --------- ESTILOS ---------
const estilos = `
* {
    box-sizing:border-box;
}

@keyframes fadeIn {
    from {
        opacity:0;
        transform:translateY(12px);
    }
    to {
        opacity:1;
        transform:translateY(0);
    }
}

@keyframes shake {
    0%,100% { transform:translateX(0); }
    25% { transform:translateX(-6px); }
    75% { transform:translateX(6px); }
}

@keyframes slideIn {
    from {
        opacity:0;
        transform:translateX(100%);
    }
    to {
        opacity:1;
        transform:translateX(0);
    }
}

.fade-in {
    animation:fadeIn .3s ease both;
}

.shake {
    animation:shake .25s ease 2;
}

.tarjeta {
    background:white;
    border-radius:16px;
    padding:24px;
    box-shadow:0 2px 16px rgba(0,0,0,.07);
    margin-bottom:20px;
}

.btn-primary {
    background:#2563eb;
    color:white;
    border:none;
    border-radius:12px;
    padding:14px 24px;
    width:100%;
    cursor:pointer;
    font-weight:700;
}

.btn-primary:disabled {
    opacity:.7;
    cursor:not-allowed;
}

.input-field {
    width:100%;
    padding:12px 16px;
    border-radius:10px;
    border:1px solid #e2e8f0;
    background:#f8fafc;
}

.slot-btn {
    padding:10px;
    border-radius:10px;
    border:2px solid #e2e8f0;
    background:white;
    cursor:pointer;
    font-weight:700;
}

.slot-btn.ocupado {
    background:#fee2e2;
    cursor:not-allowed;
}

.slot-btn.seleccionado {
    background:#2563eb;
    border-color:#2563eb;
    color:white;
}

.error-msg {
    background:#fee2e2;
    color:#dc2626;
    padding:12px;
    border-radius:10px;
    margin-top:12px;
    font-weight:700;
}

.slots-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(100px,1fr));
    gap:10px;
}

.cita-item {
    background:white;
    padding:16px;
    border-radius:14px;
    margin-bottom:12px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    flex-wrap:wrap;
    gap:12px;
}

.avatar {
    width:48px;
    height:48px;
    border-radius:12px;
    background:#1e293b;
    color:white;
    display:flex;
    align-items:center;
    justify-content:center;
    font-weight:900;
}
`;

const styleTag = document.createElement("style");
styleTag.innerHTML = estilos;
document.head.appendChild(styleTag);

// --------- NAV ---------
function renderNav() {

    return `
    <nav style="background:white;padding:16px;border-bottom:1px solid #e2e8f0;">
        <div style="max-width:900px;margin:auto;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">

            <div style="font-weight:900;font-size:20px;">
                📅 Sistema de Citas
            </div>

            <div style="display:flex;gap:10px;">

                <button onclick="cambiarVista('agendar')">
                    Agendar
                </button>

                <button onclick="cambiarVista('mis-citas')">
                    Mis Citas
                </button>

                <button onclick="cambiarVista('admin')">
                    Admin
                </button>

            </div>

        </div>
    </nav>
    `;
}

// --------- AGENDAR ---------
function renderAgendar() {

    const slots = generarSlots(fechaSeleccionada);

    return `
    <div class="fade-in">

        <div class="tarjeta">

            <h2>Reserva tu cita</h2>

            <div style="margin-bottom:16px;">
                <input id="inputNombre" class="input-field" placeholder="Nombre completo">
            </div>

            <div style="margin-bottom:16px;">
                <input id="inputTelefono" class="input-field" placeholder="Teléfono">
            </div>

            <div style="margin-bottom:16px;">
                <input id="inputEmail" class="input-field" placeholder="Email">
            </div>

            <div class="slots-grid">

                ${slots.map(s => {

                    if (s.ocupado) {
                        return `
                        <button class="slot-btn ocupado" disabled>
                            ❌ ${s.hora12}
                        </button>
                        `;
                    }

                    if (s.pasado) {
                        return `
                        <button class="slot-btn" disabled>
                            🕐 ${s.hora12}
                        </button>
                        `;
                    }

                    return `
                    <button
                        onclick="seleccionarSlot('${s.horaKey}')"
                        class="slot-btn ${slotSeleccionado === s.horaKey ? 'seleccionado' : ''}">
                        ✅ ${s.hora12}
                    </button>
                    `;

                }).join("")}

            </div>

            <div id="errorMsg" style="display:none;" class="error-msg"></div>

            <button
                style="margin-top:20px;"
                class="btn-primary"
                onclick="confirmarCita()">

                Verificar y confirmar →

            </button>

        </div>

    </div>
    `;
}

// --------- MIS CITAS ---------
function renderMisCitas() {

    return `
    <div class="fade-in">

        <div class="tarjeta">

            <h2>🔍 Buscar cita</h2>

            <input
                id="inputBuscarCita"
                class="input-field"
                placeholder="Código de verificación"
                oninput="renderBusquedaCitas()">

            <div id="resultadosCitas" style="margin-top:20px;"></div>

        </div>

    </div>
    `;
}

function renderBusquedaCitas() {

    const q = document
        .getElementById("inputBuscarCita")
        .value
        .trim()
        .toUpperCase();

    const contenedor = document.getElementById("resultadosCitas");

    if (!q) {
        contenedor.innerHTML = "";
        return;
    }

    const resultados = citas.filter(c =>
        c.codigoVerificacion === q
    );

    if (!resultados.length) {

        contenedor.innerHTML = `
        <p>No encontramos citas</p>
        `;

        return;
    }

    contenedor.innerHTML = resultados.map(c => {

        const fechaHora = new Date(`${c.fecha}T${c.horario}`);

        return `
        <div class="cita-item">

            <div style="display:flex;gap:12px;align-items:center;">

                <div class="avatar">
                    ${(c.nombre?.charAt(0) || "?").toUpperCase()}
                </div>

                <div>

                    <div style="font-weight:900;">
                        ${c.nombre}
                    </div>

                    <div>
                        📞 ${c.telefono}
                    </div>

                </div>

            </div>

            <div>

                <div>
                    📅 ${fechaHora.toLocaleDateString()}
                </div>

                <div>
                    🕐 ${fechaHora.toLocaleTimeString()}
                </div>

                <button
                    style="margin-top:10px;"
                    onclick="cancelarCitaUsuario('${c.id}')">

                    Cancelar

                </button>

            </div>

        </div>
        `;

    }).join("");
}

// --------- ADMIN ---------
function renderAdmin() {

    if (!esAdmin) {

        return `
        <div class="tarjeta">

            <h2>🔐 Admin Login</h2>

            <input
                id="inputPassword"
                type="password"
                class="input-field"
                placeholder="Contraseña">

            <div id="errorLogin" style="display:none;" class="error-msg">
                Contraseña incorrecta
            </div>

            <button
                style="margin-top:20px;"
                class="btn-primary"
                onclick="loginAdmin()">

                Entrar

            </button>

        </div>
        `;
    }

    return `
    <div class="fade-in">

        ${citas.map(c => {

            const fechaHora = new Date(`${c.fecha}T${c.horario}`);

            return `
            <div class="cita-item">

                <div style="display:flex;gap:12px;align-items:center;">

                    <div class="avatar">
                        ${(c.nombre?.charAt(0) || "?").toUpperCase()}
                    </div>

                    <div>

                        <div style="font-weight:900;">
                            ${c.nombre}
                        </div>

                        <div>
                            📞 ${c.telefono}
                        </div>

                    </div>

                </div>

                <div>

                    <div>
                        📅 ${fechaHora.toLocaleDateString()}
                    </div>

                    <div>
                        🕐 ${fechaHora.toLocaleTimeString()}
                    </div>

                    <button
                        style="margin-top:10px;"
                        onclick="cancelarCita('${c.id}')">

                        Eliminar

                    </button>

                </div>

            </div>
            `;

        }).join("")}

    </div>
    `;
}

// --------- ÉXITO ---------
function renderExito(cita) {

    const fechaHora = new Date(`${cita.fecha}T${cita.horario}`);

    const mensaje = `Hola quiero confirmar mi cita`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    document.getElementById("contenido").innerHTML = `
    <div class="tarjeta fade-in" style="text-align:center;">

        <h2>✅ Cita confirmada</h2>

        <p>
            ${cita.nombre}
        </p>

        <p>
            📅 ${fechaHora.toLocaleDateString()}
        </p>

        <p>
            🕐 ${fechaHora.toLocaleTimeString()}
        </p>

        <h1>
            ${cita.codigoVerificacion}
        </h1>

        <a
            href="${url}"
            target="_blank">

            WhatsApp

        </a>

    </div>
    `;
}

// --------- ACCIONES ---------
function cambiarVista(vista) {
    vistaActual = vista;
    actualizarPagina();
}

function seleccionarSlot(hora) {
    slotSeleccionado = hora;
    actualizarPagina();
}

async function confirmarCita() {

    const nombre = document.getElementById("inputNombre").value.trim();
    const telefono = document.getElementById("inputTelefono").value.trim();
    const email = document.getElementById("inputEmail").value.trim();

    const errorMsg = document.getElementById("errorMsg");

    const boton = document.querySelector(".btn-primary");

    const mostrarError = (msg) => {

        boton.disabled = false;
        boton.innerText = "Verificar y confirmar →";

        errorMsg.textContent = msg;
        errorMsg.style.display = "block";

        errorMsg.classList.remove("shake");

        void errorMsg.offsetWidth;

        errorMsg.classList.add("shake");
    };

    boton.disabled = true;
    boton.innerText = "Procesando...";

    if (!nombre) {
        return mostrarError("Escribe tu nombre");
    }

    if (!telefonoValido(telefono)) {
        return mostrarError("Teléfono inválido");
    }

    if (!emailValido(email)) {
        return mostrarError("Email inválido");
    }

    if (!slotSeleccionado) {
        return mostrarError("Selecciona horario");
    }

    const fechaStr = fechaSeleccionada.toISOString().split("T")[0];

    const nuevaCita = {
        id: crypto.randomUUID(),
        nombre,
        telefono,
        email,
        fecha: fechaStr,
        horario: slotSeleccionado
    };

    const citaExistente = citas.some(c =>
        c.fecha === nuevaCita.fecha &&
        c.horario === nuevaCita.horario
    );

    if (citaExistente) {
        return mostrarError("Ese horario ya se ocupó");
    }

    try {

        const success = await guardarCitaSupabase(nuevaCita);

        if (!success) {
            return mostrarError("No se pudo guardar");
        }

        citas.push(nuevaCita);

        slotSeleccionado = null;

        const htmlEmail = crearEmailConfirmacion(nuevaCita);

        await enviarEmail(
            email,
            "✅ Cita confirmada",
            htmlEmail
        );

        boton.disabled = false;
        boton.innerText = "Verificar y confirmar →";

        renderExito(nuevaCita);

    } catch (error) {

        console.error(error);

        boton.disabled = false;
        boton.innerText = "Verificar y confirmar →";

        mostrarError("Error inesperado");
    }
}

async function cancelarCitaUsuario(id) {

    if (!confirm("Cancelar cita?")) return;

    const { error } = await client
        .from('appointments')
        .delete()
        .eq('id', id);

    if (error) {
        alert(error.message);
        return;
    }

    await cargarCitas();

    renderBusquedaCitas();

    mostrarNotificacion("✅ Cita cancelada");
}

async function cancelarCita(id) {

    if (!confirm("Eliminar cita?")) return;

    const { error } = await client
        .from('appointments')
        .delete()
        .eq('id', id);

    if (error) {
        alert(error.message);
        return;
    }

    await cargarCitas();

    actualizarPagina();

    mostrarNotificacion("✅ Cita eliminada");
}

function mostrarNotificacion(mensaje, tipo = "success") {

    const notif = document.createElement("div");

    notif.style.cssText = `
        position:fixed;
        top:20px;
        right:20px;
        background:${tipo === 'success' ? '#dcfce7' : '#fee2e2'};
        color:${tipo === 'success' ? '#16a34a' : '#dc2626'};
        padding:16px 24px;
        border-radius:12px;
        font-weight:700;
        z-index:9999;
        animation:slideIn .3s ease;
    `;

    notif.textContent = mensaje;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, 3500);
}

function loginAdmin() {

    const password = document.getElementById("inputPassword").value;

    const errorLogin = document.getElementById("errorLogin");

    if (password === PASSWORD_ADMIN) {

        esAdmin = true;

        actualizarPagina();

    } else {

        errorLogin.style.display = "block";

        errorLogin.classList.remove("shake");

        void errorLogin.offsetWidth;

        errorLogin.classList.add("shake");
    }
}

// --------- APP ---------
function actualizarPagina() {

    document.body.style.margin = "0";
    document.body.style.fontFamily = "Arial";
    document.body.style.background = "#f1f5f9";

    let contenidoVista = "";

    if (vistaActual === "agendar") {
        contenidoVista = renderAgendar();
    }

    else if (vistaActual === "mis-citas") {
        contenidoVista = renderMisCitas();
    }

    else if (vistaActual === "admin") {
        contenidoVista = renderAdmin();
    }

    let app = document.getElementById("app");

    if (!app) {

        app = document.createElement("div");

        app.id = "app";

        document.body.appendChild(app);
    }

    app.innerHTML = `
        ${renderNav()}

        <div style="max-width:900px;margin:auto;padding:32px 20px;">
            <div id="contenido">
                ${contenidoVista}
            </div>
        </div>
    `;
}

// --------- INIT ---------
async function init() {

    let intentos = 0;

    while (!window.supabase && intentos < 30) {

        await new Promise(r => setTimeout(r, 100));

        intentos++;
    }

    if (!window.supabase) {

        alert("No se pudo cargar Supabase");

        return;
    }

    client = window.supabase.createClient(
        supabaseUrl,
        supabaseKey
    );

    console.log("✅ Supabase conectado");

    await cargarCitas();

    actualizarPagina();
}

init();