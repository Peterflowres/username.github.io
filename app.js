// ==================== app.js ====================
// Sistema de Citas - Versión 9.5
// Paleta Lujo Silencioso + Validaciones + WhatsApp + Modal + Toasts

const supabaseUrl = 'https://bijqxtrtacnaurfouvot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpanF4dHJ0YWNuYXVyZm91dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwOTM5OTksImV4cCI6MjA5MzY2OTk5OX0.tmUH2vystWgZc2eIm29-cHJTcbgGRGsZqBtTuDrfMtw';

let supabaseClient;
let citas = [];
let busqueda = "";
let esAdmin = false;
let vistaActual = "agendar";
let fechaSeleccionada = new Date();
let slotSeleccionado = null;
let enviando = false;

const PASSWORD_ADMIN = "1234";
const numeroWhatsApp = "524425761233";

// ---------- ESTILOS (Paleta 2 - Lujo Silencioso) ----------
const estilos = `
    * { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-6px); }
        75% { transform: translateX(6px); }
    }
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(100%); }
        to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .fade-in { animation: fadeIn 0.3s ease both; }
    .shake   { animation: shake 0.25s ease 2; }

    body {
        background: #F5F5F5;
        font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        margin: 0;
        min-height: 100vh;
    }

    .tarjeta {
        background: #FFFFFF;
        border-radius: 20px;
        padding: 28px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.05);
        margin-bottom: 24px;
        border: 1px solid rgba(0,0,0,0.05);
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .tarjeta:hover {
        box-shadow: 0 12px 32px rgba(0,0,0,0.08);
    }

    .btn-primary {
        background: #D4AF37;
        color: #1A1A1A;
        border: none;
        border-radius: 40px;
        padding: 14px 24px;
        font-size: 15px;
        font-weight: 800;
        cursor: pointer;
        width: 100%;
        transition: all 0.2s;
        letter-spacing: 0.5px;
    }
    .btn-primary:hover:not(:disabled) { 
        background: #C49F2A;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(212,175,55,0.3);
    }
    .btn-primary:active { transform: translateY(0); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

    .btn-danger {
        background: transparent;
        color: #8B5A2B;
        border: 1.5px solid #8B5A2B;
        border-radius: 30px;
        padding: 6px 14px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
    }
    .btn-danger:hover {
        background: #8B5A2B;
        color: white;
    }

    .btn-whatsapp {
        background: #25D366;
        color: white;
        border: none;
        border-radius: 40px;
        padding: 14px 24px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        width: 100%;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        text-decoration: none;
    }
    .btn-whatsapp:hover {
        background: #20bd5a;
        transform: translateY(-2px);
    }

    .btn-copy {
        background: #1A1A1A;
        color: #D4AF37;
        border: none;
        border-radius: 30px;
        padding: 8px 16px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }
    .btn-copy:hover {
        background: #2C2C2C;
    }

    .input-field {
        width: 100%;
        padding: 14px 18px;
        border-radius: 40px;
        border: 1.5px solid #E5E5E5;
        font-size: 15px;
        outline: none;
        transition: all 0.2s;
        background: #FFFFFF;
        font-family: inherit;
    }
    .input-field:focus {
        border-color: #D4AF37;
        box-shadow: 0 0 0 3px rgba(212,175,55,0.15);
    }
    .input-field.error {
        border-color: #8B5A2B;
        background: #FFF8F5;
    }

    .dia-btn {
        flex-shrink: 0;
        width: 72px;
        height: 84px;
        border-radius: 18px;
        border: 1.5px solid #E5E5E5;
        background: white;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.2s;
    }
    .dia-btn:hover    { border-color: #D4AF37; background: #FFFCF5; transform: translateY(-2px); }
    .dia-btn.activo   { background: #1A1A1A; border-color: #D4AF37; color: white; transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
    .dia-btn .dia-nombre { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
    .dia-btn.activo .dia-nombre { color: #D4AF37; }
    .dia-btn .dia-num { font-size: 22px; font-weight: 800; color: #1A1A1A; }
    .dia-btn.activo .dia-num { color: white; }

    .slot-btn {
        padding: 10px 16px;
        border-radius: 40px;
        border: 1.5px solid #E5E5E5;
        background: white;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        color: #333;
        transition: all 0.2s;
    }
    .slot-btn:hover:not(:disabled)  { border-color: #D4AF37; background: #FFFCF5; color: #1A1A1A; }
    .slot-btn.seleccionado          { background: #1A1A1A; border-color: #D4AF37; color: #D4AF37; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .slot-btn:disabled              { background: #F5F5F5; color: #CCC; cursor: not-allowed; border-color: #E5E5E5; }
    .slot-btn.ocupado               { background: #FFF0EB; color: #8B5A2B; border-color: #E5E5E5; cursor: not-allowed; }

    .nav-btn {
        padding: 10px 22px;
        border-radius: 40px;
        border: none;
        background: transparent;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        color: #666;
        transition: all 0.2s;
    }
    .nav-btn:hover  { color: #1A1A1A; background: #F0F0F0; }
    .nav-btn.activo { color: #D4AF37; background: #1A1A1A; }

    .cita-item {
        background: white;
        border-radius: 20px;
        padding: 18px 24px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        transition: all 0.2s;
        animation: fadeIn 0.3s ease both;
        flex-wrap: wrap;
        gap: 16px;
        border: 1px solid #F0F0F0;
    }
    .cita-item:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }

    .badge-confirmado { background: #2C5F2D15; color: #2C5F2D; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 40px; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid #2C5F2D30; }
    .badge-pasado     { background: #F5F5F5; color: #999; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 40px; text-transform: uppercase; letter-spacing: 0.05em; }

    .avatar {
        width: 48px; height: 48px;
        border-radius: 30px;
        background: #1A1A1A;
        color: #D4AF37;
        font-size: 18px;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .exito-box {
        background: white;
        border-radius: 32px;
        padding: 48px 40px;
        text-align: center;
        box-shadow: 0 16px 48px rgba(0,0,0,0.1);
        max-width: 520px;
        margin: 0 auto;
        animation: fadeIn 0.4s ease both;
        border: 1px solid #F0F0F0;
    }

    .dias-scroll {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        padding-bottom: 12px;
        scrollbar-width: thin;
    }
    .dias-scroll::-webkit-scrollbar { height: 4px; }
    .dias-scroll::-webkit-scrollbar-track { background: #E5E5E5; border-radius: 10px; }
    .dias-scroll::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 10px; }

    .slots-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));
        gap: 12px;
        margin-top: 20px;
    }

    .error-msg {
        background: #FFF0EB;
        color: #8B5A2B;
        border-radius: 40px;
        padding: 12px 20px;
        font-size: 13px;
        font-weight: 600;
        margin-top: 16px;
        border-left: 3px solid #8B5A2B;
    }

    label { display: block; font-size: 11px; font-weight: 800; color: #999; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }

    .validation-icon {
        position: absolute;
        right: 18px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
    }
    .input-wrapper {
        position: relative;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.2s ease;
    }
    .modal-container {
        background: white;
        border-radius: 32px;
        max-width: 480px;
        width: 90%;
        padding: 32px;
        box-shadow: 0 24px 48px rgba(0,0,0,0.2);
        border: 1px solid #D4AF37;
    }
    .modal-container h3 {
        color: #1A1A1A;
        font-size: 24px;
        margin-bottom: 20px;
    }
    .summary-item {
        background: #F8F8F8;
        padding: 12px 16px;
        border-radius: 16px;
        margin-bottom: 12px;
        font-size: 14px;
    }
    .summary-item strong {
        color: #D4AF37;
    }

    .toast {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #1A1A1A;
        color: #D4AF37;
        padding: 12px 24px;
        border-radius: 50px;
        font-weight: 600;
        z-index: 2000;
        animation: slideIn 0.3s ease;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
`;

// Insertar estilos
const styleTag = document.createElement("style");
styleTag.innerHTML = estilos;
document.head.appendChild(styleTag);

// ---------- UTILERIAS ----------
function telefonoValido(tel) { return /^[0-9]{10}$/.test(tel); }
function emailValido(email) { 
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}
function normalizar(texto) { return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }

function mostrarToast(mensaje, esError = false) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = mensaje;
    toast.style.background = esError ? "#8B5A2B" : "#1A1A1A";
    toast.style.color = esError ? "white" : "#D4AF37";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ---------- SLOTS (9AM - 5PM cada 30min) ----------
function generarSlots(fecha) {
    const slots = [];
    const ahora = new Date();
    const esHoy = fecha.toDateString() === ahora.toDateString();
    for (let h = 9; h < 17; h++) {
        for (let m = 0; m < 60; m += 30) {
            const slotFecha = new Date(fecha);
            slotFecha.setHours(h, m, 0, 0);
            const hora12 = slotFecha.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true });
            const horaKey = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
            const fechaStr = fecha.toISOString().split("T")[0];
            const ocupado = citas.some(c => c.fecha === fechaStr && c.horario === horaKey);
            const pasado = esHoy && slotFecha < ahora;
            slots.push({ hora12, horaKey, ocupado, pasado });
        }
    }
    return slots;
}

// ---------- SUPABASE OPERACIONES ----------
async function guardarCitaSupabase(cita, codigo) {
    const { error } = await supabaseClient
        .from('appointments')
        .insert([{
            client_name: cita.nombre,
            client_phone: cita.telefono,
            client_email: cita.email,
            appointment_date: cita.fecha,
            appointment_time: cita.horario,
            client_verification_code: codigo
        }]);
    if (error) {
        console.error("Error guardando cita:", error);
        mostrarToast("Error: " + error.message, true);
        return false;
    }
    return true;
}

async function cargarCitas() {
    const { data, error } = await supabaseClient
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

// ---------- RENDER PRINCIPAL ----------
function renderNav() {
    return `
        <nav style="background:#1A1A1A; border-bottom:1px solid #D4AF37; position:sticky; top:0; z-index:100; box-shadow:0 2px 12px rgba(0,0,0,0.1);">
            <div style="max-width:1000px; margin:0 auto; padding:0 24px; height:70px; display:flex; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:12px; cursor:pointer;" onclick="cambiarVista('agendar')">
                    <div style="width:40px; height:40px; background:#D4AF37; border-radius:12px; display:flex; align-items:center; justify-content:center;">
                        <span style="color:#1A1A1A; font-size:20px;">📅</span>
                    </div>
                    <span style="font-weight:800; font-size:18px; color:#D4AF37; letter-spacing:-0.02em;">Sistema de Citas</span>
                </div>
                <div style="display:flex; gap:8px; align-items:center;">
                    <button class="nav-btn ${vistaActual === 'agendar' ? 'activo' : ''}" onclick="cambiarVista('agendar')">📋 Agendar</button>
                    <button class="nav-btn ${vistaActual === 'mis-citas' ? 'activo' : ''}" onclick="cambiarVista('mis-citas')">🔍 Mis Citas</button>
                    <button class="nav-btn ${vistaActual === 'admin' ? 'activo' : ''}" onclick="cambiarVista('admin')">🔐 Admin</button>
                </div>
            </div>
        </nav>
    `;
}

function renderAgendar() {
    const diasHTML = generarDias();
    const slotsHTML = renderSlots();
    return `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:28px; align-items:start;" class="fade-in">
            <div class="tarjeta">
                <h2 style="margin:0 0 24px 0; font-size:24px; font-weight:800; color:#1A1A1A;">Reserva tu cita</h2>
                <div style="margin-bottom:20px;">
                    <label>Nombre completo</label>
                    <input id="inputNombre" class="input-field" type="text" placeholder="Tu nombre" />
                </div>
                <div style="margin-bottom:20px;">
                    <label>Teléfono (10 dígitos)</label>
                    <input id="inputTelefono" class="input-field" type="tel" placeholder="4421234567" />
                </div>
                <div style="margin-bottom:24px;">
                    <label>Email</label>
                    <div class="input-wrapper">
                        <input id="inputEmail" class="input-field" type="email" placeholder="tu@email.com" />
                        <span id="emailValidationIcon" class="validation-icon"></span>
                    </div>
                </div>
                <div id="errorMsg" style="display:none;" class="error-msg"></div>
                <button id="btnConfirmar" class="btn-primary" onclick="confirmarCita()">Verificar y confirmar →</button>
            </div>
            <div>
                <div class="tarjeta"><h3 style="margin:0 0 16px 0; font-size:18px; font-weight:700; color:#1A1A1A;">📆 Selecciona el día</h3><div class="dias-scroll">${diasHTML}</div></div>
                <div class="tarjeta">
                    <h3 style="margin:0 0 8px 0; font-size:18px; font-weight:700; color:#1A1A1A;">🕐 Horarios disponibles</h3>
                    <p style="font-size:13px; color:#999; margin:0 0 16px 0;">${fechaSeleccionada.toLocaleDateString("es-MX", { weekday:"long", month:"long", day:"numeric" })}</p>
                    <div class="slots-grid">${slotsHTML}</div>
                    <div style="display:flex; gap:24px; margin-top:20px; padding-top:20px; border-top:1px solid #F0F0F0;">
                        <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:#666;"><div style="width:14px;height:14px;border-radius:14px;background:white;border:1.5px solid #D4AF37;"></div> Disponible</div>
                        <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:#666;"><div style="width:14px;height:14px;border-radius:14px;background:#1A1A1A;border:1.5px solid #D4AF37;"></div> Seleccionado</div>
                        <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:#666;"><div style="width:14px;height:14px;border-radius:14px;background:#FFF0EB;"></div> Ocupado</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generarDias() {
    let html = "";
    for (let i = 0; i < 7; i++) {
        const dia = new Date();
        dia.setDate(dia.getDate() + i);
        const esActivo = dia.toDateString() === fechaSeleccionada.toDateString();
        const nombre = dia.toLocaleDateString("es-MX", { weekday: "short" });
        const num = dia.getDate();
        const fechaISO = dia.toISOString();
        html += `<button class="dia-btn ${esActivo ? 'activo' : ''}" onclick="seleccionarDia('${fechaISO}')"><span class="dia-nombre">${nombre}</span><span class="dia-num">${num}</span></button>`;
    }
    return html;
}

function renderSlots() {
    const slots = generarSlots(fechaSeleccionada);
    return slots.map(s => {
        if (s.ocupado) return `<button class="slot-btn ocupado" disabled>❌ ${s.hora12}</button>`;
        if (s.pasado) return `<button class="slot-btn" disabled style="opacity:0.5;">🕐 ${s.hora12}</button>`;
        const activo = slotSeleccionado === s.horaKey ? 'seleccionado' : '';
        return `<button class="slot-btn ${activo}" onclick="seleccionarSlot('${s.horaKey}')">✅ ${s.hora12}</button>`;
    }).join("");
}

function renderMisCitas() {
    return `
        <div class="fade-in" style="max-width:600px; margin:0 auto;">
            <div style="text-align:center; margin-bottom:40px;">
                <h2 style="font-size:32px; font-weight:800; color:#1A1A1A; margin:0 0 12px 0;">🔍 Busca tu cita</h2>
                <p style="color:#999; font-size:14px; margin:0;">Ingresa tu código de verificación</p>
            </div>
            <div style="position:relative; margin-bottom:28px;">
                <span style="position:absolute; left:18px; top:50%; transform:translateY(-50%); font-size:18px;">🔐</span>
                <input id="inputBuscarCita" class="input-field" type="text" placeholder="Código (6 caracteres)..." style="padding-left:52px; font-size:16px; padding-top:16px; padding-bottom:16px; text-transform:uppercase; text-align:center; letter-spacing:2px;" oninput="renderBusquedaCitas()" />
            </div>
            <div id="resultadosCitas"></div>
        </div>
    `;
}

function renderBusquedaCitas() {
    const q = document.getElementById("inputBuscarCita")?.value.trim().toUpperCase() || "";
    const contenedor = document.getElementById("resultadosCitas");
    if (!contenedor) return;
    if (!q) {
        contenedor.innerHTML = `<div style="text-align:center; padding:60px; background:white; border-radius:28px; border:1px dashed #D4AF37;"><div style="font-size:48px; margin-bottom:16px;">🔐</div><p style="color:#999; font-weight:600;">Ingresa tu código</p></div>`;
        return;
    }
    const resultados = citas.filter(c => c.codigoVerificacion && c.codigoVerificacion === q);
    if (resultados.length === 0) {
        contenedor.innerHTML = `<div style="text-align:center; padding:60px; background:white; border-radius:28px;"><div style="font-size:48px; margin-bottom:16px;">😕</div><p style="color:#999; font-weight:600;">No encontramos una cita con ese código</p></div>`;
        return;
    }
    contenedor.innerHTML = resultados.map(c => {
        const fechaHora = new Date(`${c.fecha}T${c.horario}`);
        const pasada = fechaHora < new Date();
        return `
            <div class="cita-item">
                <div style="display:flex; align-items:center; gap:16px; flex:1;">
                    <div class="avatar">${c.nombre.charAt(0).toUpperCase()}</div>
                    <div>
                        <div style="font-weight:800; color:#1A1A1A; font-size:17px;">${c.nombre}</div>
                        <div style="font-size:13px; color:#999;">📞 ${c.telefono}</div>
                        <span class="${pasada ? 'badge-pasado' : 'badge-confirmado'}">${pasada ? 'Pasada' : 'Confirmada'}</span>
                    </div>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px; align-items:flex-end;">
                    <div style="text-align:right;">
                        <div style="font-size:12px; color:#999; font-weight:600; text-transform:uppercase;">${fechaHora.toLocaleDateString("es-MX", {month:"short", day:"numeric"})}</div>
                        <div style="font-size:20px; font-weight:800; color:#1A1A1A;">${fechaHora.toLocaleTimeString("es-MX", {hour:"2-digit", minute:"2-digit", hour12:true})}</div>
                    </div>
                    ${!pasada ? `<button onclick="cancelarCitaUsuario('${c.id}')" class="btn-danger" style="padding:8px 20px;">🗑️ Cancelar</button>` : ''}
                </div>
            </div>`;
    }).join("");
}

function renderAdmin() {
    if (!esAdmin) {
        return `
            <div style="max-width:440px; margin:0 auto;" class="fade-in">
                <div class="tarjeta" style="padding:52px 36px; text-align:center;">
                    <div style="width:80px; height:80px; background:#1A1A1A; border-radius:40px; display:flex; align-items:center; justify-content:center; margin:0 auto 28px;"><span style="font-size:36px;">🔐</span></div>
                    <h2 style="font-size:28px; font-weight:800; margin:0 0 12px 0; color:#1A1A1A;">Admin Login</h2>
                    <p style="color:#999; margin:0 0 36px 0; font-size:14px;">Ingresa tu contraseña</p>
                    <div style="margin-bottom:20px;"><input id="inputPassword" class="input-field" type="password" placeholder="Contraseña" onkeydown="if(event.key==='Enter') loginAdmin()" /></div>
                    <div id="errorLogin" style="display:none;" class="error-msg">❌ Contraseña incorrecta</div>
                    <button class="btn-primary" style="margin-top:16px; background:#1A1A1A; color:#D4AF37;" onclick="loginAdmin()">Autenticar sesión</button>
                </div>
            </div>`;
    }
    const citasOrdenadas = [...citas].sort((a, b) => new Date(a.fecha + "T" + a.horario) - new Date(b.fecha + "T" + b.horario));
    const filtradas = citasOrdenadas.filter(c => normalizar(c.nombre).includes(normalizar(busqueda)) || c.telefono.includes(busqueda));
    return `
        <div class="fade-in">
            <div class="tarjeta" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;">
                <div><h2 style="margin:0 0 6px 0; font-size:28px; font-weight:800; color:#1A1A1A;">Panel Admin</h2><div style="display:flex; align-items:center; gap:10px;"><span style="font-size:13px; color:#999; font-weight:600;">Total registros</span><span style="background:#1A1A1A; color:#D4AF37; font-size:13px; font-weight:800; padding:4px 16px; border-radius:40px;">${citas.length}</span></div></div>
                <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                    <div style="position:relative;"><span style="position:absolute; left:16px; top:50%; transform:translateY(-50%);">🔍</span><input id="inputBuscarAdmin" class="input-field" type="text" placeholder="Buscar..." style="padding-left:44px; width:260px;" oninput="busqueda=this.value; actualizarPagina();" value="${busqueda}" /></div>
                    <button onclick="cerrarSesionAdmin()" style="padding:12px 20px; background:#1A1A1A; color:#D4AF37; border:none; border-radius:40px; font-weight:700; cursor:pointer;">🔓 Cerrar sesión</button>
                </div>
            </div>
            ${filtradas.length === 0 ? `<div style="text-align:center; padding:80px; background:white; border-radius:28px; border:1px dashed #D4AF37;"><div style="font-size:56px; margin-bottom:20px;">📭</div><p style="color:#999; font-weight:600;">Sin resultados</p></div>` : filtradas.map(c => {
                const fechaHora = new Date(`${c.fecha}T${c.horario}`);
                const pasada = fechaHora < new Date();
                return `<div class="cita-item"><div style="display:flex; align-items:center; gap:16px;"><div class="avatar">${c.nombre.charAt(0).toUpperCase()}</div><div><div style="font-weight:800; color:#1A1A1A; font-size:17px;">${c.nombre}</div><div style="font-size:13px; color:#999; margin-bottom:6px;">📞 ${c.telefono}</div><span class="${pasada ? 'badge-pasado' : 'badge-confirmado'}">${pasada ? 'Pasada' : 'Confirmada'}</span></div></div><div style="background:#F8F8F8; border-radius:20px; padding:12px 24px; display:flex; gap:28px; border:1px solid #F0F0F0;"><div><div style="font-size:11px; font-weight:800; color:#999; text-transform:uppercase; margin-bottom:6px;">Fecha</div><div style="font-weight:800; color:#1A1A1A;">📅 ${fechaHora.toLocaleDateString("es-MX", {month:"short", day:"numeric", year:"numeric"})}</div></div><div style="width:1px; background:#E5E5E5;"></div><div><div style="font-size:11px; font-weight:800; color:#999; text-transform:uppercase; margin-bottom:6px;">Hora</div><div style="font-weight:800; color:#1A1A1A;">🕐 ${fechaHora.toLocaleTimeString("es-MX", {hour:"2-digit", minute:"2-digit", hour12:true})}</div></div></div><div style="display:flex; gap:12px;"><a href="tel:${c.telefono}" style="padding:10px 14px; background:#F5F5F5; border-radius:30px; text-decoration:none; font-size:18px;">📞</a><button onclick="cancelarCita('${c.id}')" class="btn-danger">🗑️</button></div></div>`;
            }).join("")}
        </div>`;
}

function mostrarModalConfirmacion(cita, codigo) {
    const fechaHora = new Date(`${cita.fecha}T${cita.horario}`);
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
        <div class="modal-container">
            <h3>📋 Confirmar cita</h3>
            <div class="summary-item"><strong>👤 Nombre:</strong> ${cita.nombre}</div>
            <div class="summary-item"><strong>📞 Teléfono:</strong> ${cita.telefono}</div>
            <div class="summary-item"><strong>✉️ Email:</strong> ${cita.email}</div>
            <div class="summary-item"><strong>📅 Fecha:</strong> ${fechaHora.toLocaleDateString("es-MX", {weekday:"long", day:"numeric", month:"long", year:"numeric"})}</div>
            <div class="summary-item"><strong>🕐 Hora:</strong> ${fechaHora.toLocaleTimeString("es-MX", {hour:"2-digit", minute:"2-digit", hour12:true})}</div>
            <div class="summary-item"><strong>🔐 Código:</strong> ${codigo}</div>
            <div style="display:flex; gap:12px; margin-top:24px;">
                <button id="confirmarDefinitivo" class="btn-primary">✅ Confirmar definitivamente</button>
                <button id="cancelarModal" class="btn-danger" style="background:transparent;">❌ Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("confirmarDefinitivo").onclick = async () => {
        modal.remove();
        await guardarYFinalizar(cita, codigo);
    };
    document.getElementById("cancelarModal").onclick = () => modal.remove();
}

async function guardarYFinalizar(cita, codigo) {
    const boton = document.getElementById("btnConfirmar");
    if(enviando) return;
    enviando = true;
    if(boton) { boton.disabled = true; boton.innerText = "Guardando..."; }
    
    const success = await guardarCitaSupabase(cita, codigo);
    if (!success) {
        if(boton) { boton.disabled = false; boton.innerText = "Verificar y confirmar →"; }
        enviando = false;
        return;
    }
    cita.codigoVerificacion = codigo;
    citas.push(cita);
    slotSeleccionado = null;
    enviando = false;
    if(boton) { boton.disabled = false; boton.innerText = "Verificar y confirmar →"; }
    renderExito(cita);
}

function renderExito(cita) {
    const fechaHora = new Date(`${cita.fecha}T${cita.horario}`);
    const mensaje = `✨ *CITA CONFIRMADA* ✨\n\n👤 *Cliente:* ${cita.nombre}\n📅 *Fecha:* ${fechaHora.toLocaleDateString("es-MX", {weekday:"long", year:"numeric", month:"long", day:"numeric"})}\n🕐 *Hora:* ${fechaHora.toLocaleTimeString("es-MX", {hour:"2-digit", minute:"2-digit", hour12:true})}\n🔐 *Código de verificación:* ${cita.codigoVerificacion}\n\n✅ Guarda este código para consultar o cancelar tu cita.\n📍 ¡Te esperamos!`;
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    document.getElementById("contenido").innerHTML = `
        <div class="exito-box">
            <div style="width:88px; height:88px; background:#2C5F2D15; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 28px; font-size:44px;">✅</div>
            <h2 style="font-size:32px; font-weight:800; color:#1A1A1A; margin:0 0 16px 0;">¡Cita confirmada!</h2>
            <p style="color:#666; margin:0 0 28px 0; line-height:1.6;">Hola <strong>${cita.nombre}</strong>, tu cita quedó reservada para el <strong>${fechaHora.toLocaleDateString("es-MX", {weekday:"long", month:"long", day:"numeric"})}</strong> a las <strong>${fechaHora.toLocaleTimeString("es-MX", {hour:"2-digit", minute:"2-digit", hour12:true})}</strong>.</p>
            <div style="background:#F8F8F8; border:2px solid #D4AF37; border-radius:24px; padding:20px; margin-bottom:28px;">
                <div style="font-size:12px; font-weight:800; color:#D4AF37; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:12px;">Tu código de verificación</div>
                <div style="font-size:32px; font-weight:800; color:#1A1A1A; letter-spacing:4px; font-family:monospace;">${cita.codigoVerificacion}</div>
                <button class="btn-copy" style="margin-top:16px;" onclick="copiarCodigo('${cita.codigoVerificacion}')">📋 Copiar código</button>
                <div style="font-size:12px; color:#999; margin-top:12px;">Guarda este código para gestionar tu cita</div>
            </div>
            <div style="display:flex; flex-direction:column; gap:14px;">
                <a href="${url}" target="_blank" class="btn-whatsapp">💬 Notificar por WhatsApp (con código)</a>
                <button onclick="cambiarVista('agendar')" style="background:none; border:none; color:#999; font-weight:600; font-size:14px; cursor:pointer; padding:14px;">+ Agendar otra cita</button>
            </div>
        </div>`;
}

function copiarCodigo(codigo) {
    navigator.clipboard.writeText(codigo);
    mostrarToast("✅ Código copiado al portapapeles");
}

// ---------- ACCIONES GLOBALES ----------
function cambiarVista(vista) { vistaActual = vista; busqueda = ""; actualizarPagina(); }
function seleccionarDia(fechaISO) { fechaSeleccionada = new Date(fechaISO); slotSeleccionado = null; actualizarPagina(); }
function seleccionarSlot(horaKey) { slotSeleccionado = horaKey; actualizarPagina(); }

function validarEmailTiempoReal() {
    const emailInput = document.getElementById("inputEmail");
    const icon = document.getElementById("emailValidationIcon");
    if(emailInput && icon) {
        const valido = emailValido(emailInput.value);
        icon.textContent = valido ? "✅" : "❌";
        emailInput.classList.toggle("error", !valido && emailInput.value.length > 0);
    }
}

async function confirmarCita() {
    if(enviando) return;
    const nombre = document.getElementById("inputNombre").value.trim();
    const telefono = document.getElementById("inputTelefono").value.trim();
    const email = document.getElementById("inputEmail").value.trim();
    const errorMsg = document.getElementById("errorMsg");
    const mostrarError = (msg) => {
        if(errorMsg) {
            errorMsg.textContent = msg;
            errorMsg.style.display = "block";
            errorMsg.classList.remove("shake");
            void errorMsg.offsetWidth;
            errorMsg.classList.add("shake");
        }
        mostrarToast(msg, true);
    };
    if (!nombre) return mostrarError("Por favor escribe tu nombre completo");
    if (!telefonoValido(telefono)) return mostrarError("Teléfono inválido, debe tener 10 dígitos");
    if (!emailValido(email)) return mostrarError("Email inválido (ej: nombre@dominio.com)");
    if (!slotSeleccionado) return mostrarError("Por favor selecciona un horario");
    const fechaStr = fechaSeleccionada.toISOString().split("T")[0];
    const citaExistente = citas.some(c => c.fecha === fechaStr && c.horario === slotSeleccionado);
    if (citaExistente) return mostrarError("Ese horario ya fue tomado, elige otro");
    const codigoVerificacion = Math.random().toString(36).substring(2, 8).toUpperCase();
    const nuevaCita = { id: crypto.randomUUID(), nombre, telefono, email, fecha: fechaStr, horario: slotSeleccionado };
    mostrarModalConfirmacion(nuevaCita, codigoVerificacion);
}

async function cancelarCitaUsuario(id) {
    if (!confirm("¿Estás seguro de que quieres cancelar tu cita? No podrás recuperarla.")) return;
    const { error } = await supabaseClient.from('appointments').delete().eq('id', id);
    if (error) { mostrarToast("Error: " + error.message, true); return; }
    await cargarCitas();
    const inputBuscar = document.getElementById("inputBuscarCita");
    if(inputBuscar) inputBuscar.value = "";
    renderBusquedaCitas();
    mostrarToast("✅ Cita cancelada correctamente");
}

async function cancelarCita(id) {
    if (!confirm("¿Eliminar esta cita permanentemente?")) return;
    const { error } = await supabaseClient.from('appointments').delete().eq('id', id);
    if (error) { mostrarToast("Error: " + error.message, true); return; }
    await cargarCitas();
    actualizarPagina();
    mostrarToast("✅ Cita eliminada");
}

function loginAdmin() {
    const password = document.getElementById("inputPassword")?.value;
    const errorLogin = document.getElementById("errorLogin");
    if (password === PASSWORD_ADMIN) { esAdmin = true; actualizarPagina(); }
    else if(errorLogin) { errorLogin.style.display = "block"; errorLogin.classList.remove("shake"); void errorLogin.offsetWidth; errorLogin.classList.add("shake"); mostrarToast("Contraseña incorrecta", true); }
}
function cerrarSesionAdmin() { esAdmin = false; actualizarPagina(); }

function actualizarPagina() {
    let contenidoVista = "";
    if (vistaActual === "agendar") contenidoVista = renderAgendar();
    else if (vistaActual === "mis-citas") contenidoVista = renderMisCitas();
    else if (vistaActual === "admin") contenidoVista = renderAdmin();
    document.getElementById("root").innerHTML = `
        ${renderNav()}
        <div style="max-width:1000px; margin:0 auto; padding:40px 24px;">
            <div id="contenido">${contenidoVista}</div>
        </div>
        <footer style="text-align:center; padding:32px; background:#1A1A1A; color:#999; font-size:12px; font-weight:500; margin-top:48px;">
            <span style="color:#D4AF37;">● Sistema activo</span> &nbsp;|&nbsp; Citas seguras &nbsp;|&nbsp; Soporte 24/7
        </footer>
    `;
    if (vistaActual === "mis-citas") renderBusquedaCitas();
    const emailInput = document.getElementById("inputEmail");
    if(emailInput) emailInput.addEventListener("input", validarEmailTiempoReal);
    document.addEventListener("keydown", (e) => {
        if(e.key === "Enter" && vistaActual === "agendar" && document.activeElement?.tagName !== "BUTTON") {
            e.preventDefault();
            confirmarCita();
        }
    });
}

// ---------- INICIALIZACIÓN ----------
async function init() {
    if (!window.supabase) {
        alert("❌ Error: No se pudo cargar Supabase. Recarga la página.");
        return;
    }
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    await cargarCitas();
    actualizarPagina();
}
init();