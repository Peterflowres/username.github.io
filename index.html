const supabaseUrl = 'https://bijqxtrtacnaurfouvot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpanF4dHJ0YWNuYXVyZm91dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwOTM5OTksImV4cCI6MjA5MzY2OTk5OX0.tmUH2vystWgZc2eIm29-cHJTcbgGRGsZqBtTuDrfMtw';

let client;
let citas = [];
let busqueda = "";
let esAdmin = false;
let vistaActual = "agendar";
let fechaSeleccionada = new Date();
let slotSeleccionado = null;

const PASSWORD_ADMIN = "1234"; // 🔐 CAMBIAR ESTO EN PRODUCCIÓN
const numeroWhatsApp = "524425761233"; // 🔐 CAMBIAR ESTO

// --------- SLOTS AUTOMÁTICOS (9AM - 5PM cada 30 min) ---------
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
            const pasado = esHoy && slotFecha <= ahora;

            slots.push({ hora12, horaKey, ocupado, pasado });
        }
    }
    return slots;
}

// --------- STORAGE ---------
async function guardarCitaSupabase(cita) {
    // Generar código de verificación único (6 dígitos alfanuméricos)
    const codigoVerificacion = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data, error } = await client
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
        ])
        .select();

    if (error) {
        console.error("Error guardando cita:", error);
        alert("Error guardando cita: " + error.message);
        return false;
    }

    // Guardar el ID real devuelto por Supabase
    if (data && data.length > 0) {
        cita.id = data[0].id;
    }
    cita.codigoVerificacion = codigoVerificacion;
    return true;
}

async function cargarCitas() {
    const { data, error } = await client
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

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

function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

// --------- ESTILOS ---------
const estilos = `
    * { box-sizing: border-box; }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-6px); }
        75% { transform: translateX(6px); }
    }

    .fade-in { animation: fadeIn 0.3s ease both; }
    .shake   { animation: shake 0.25s ease 2; }

    .tarjeta {
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 2px 16px rgba(0,0,0,0.07);
        margin-bottom: 20px;
    }

    .btn-primary {
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 12px;
        padding: 14px 24px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        width: 100%;
        transition: background 0.2s, transform 0.1s;
    }
    .btn-primary:hover  { background: #1d4ed8; }
    .btn-primary:active { transform: scale(0.98); }

    .btn-danger {
        background: #fee2e2;
        color: #dc2626;
        border: none;
        border-radius: 8px;
        padding: 6px 12px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.2s;
    }
    .btn-danger:hover { background: #fca5a5; }

    .btn-whatsapp {
        background: #25D366;
        color: white;
        border: none;
        border-radius: 12px;
        padding: 14px 24px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        width: 100%;
        transition: background 0.2s, transform 0.1s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        text-decoration: none;
    }
    .btn-whatsapp:hover { background: #20bd5a; }

    .input-field {
        width: 100%;
        padding: 12px 16px;
        border-radius: 10px;
        border: 1.5px solid #e2e8f0;
        font-size: 15px;
        outline: none;
        transition: border 0.2s, box-shadow 0.2s;
        background: #f8fafc;
    }
    .input-field:focus {
        border-color: #2563eb;
        background: white;
        box-shadow: 0 0 0 4px rgba(37,99,235,0.08);
    }
    .input-field.error { border-color: #dc2626; }

    .dia-btn {
        flex-shrink: 0;
        width: 72px;
        height: 84px;
        border-radius: 16px;
        border: 2px solid #e2e8f0;
        background: white;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        transition: all 0.2s;
    }
    .dia-btn:hover    { border-color: #93c5fd; background: #eff6ff; }
    .dia-btn.activo   { background: #2563eb; border-color: #2563eb; color: white; transform: translateY(-3px); box-shadow: 0 8px 20px rgba(37,99,235,0.25); }
    .dia-btn .dia-nombre { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; }
    .dia-btn.activo .dia-nombre { color: #bfdbfe; }
    .dia-btn .dia-num { font-size: 22px; font-weight: 900; color: #1e293b; }
    .dia-btn.activo .dia-num { color: white; }

    .slot-btn {
        padding: 10px 16px;
        border-radius: 10px;
        border: 2px solid #e2e8f0;
        background: white;
        cursor: pointer;
        font-size: 13px;
        font-weight: 700;
        color: #475569;
        transition: all 0.15s;
    }
    .slot-btn:hover:not(:disabled)  { border-color: #93c5fd; background: #eff6ff; color: #2563eb; }
    .slot-btn.seleccionado          { background: #2563eb; border-color: #2563eb; color: white; box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
    .slot-btn:disabled              { background: #f1f5f9; color: #cbd5e1; cursor: not-allowed; border-color: transparent; }
    .slot-btn.ocupado               { background: #fee2e2; color: #fca5a5; border-color: transparent; cursor: not-allowed; }

    .nav-btn {
        padding: 10px 20px;
        border-radius: 10px;
        border: none;
        background: transparent;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        color: #64748b;
        transition: all 0.2s;
    }
    .nav-btn:hover  { color: #1e293b; background: #f1f5f9; }
    .nav-btn.activo { color: #2563eb; background: #eff6ff; }

    .cita-item {
        background: white;
        border-radius: 14px;
        padding: 16px 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        transition: all 0.2s;
        animation: fadeIn 0.3s ease both;
        flex-wrap: wrap;
        gap: 12px;
    }
    .cita-item:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.1); transform: translateY(-1px); }

    .badge-confirmado { background: #dcfce7; color: #16a34a; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em; }
    .badge-pasado     { background: #f1f5f9; color: #94a3b8; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em; }

    .avatar {
        width: 48px; height: 48px;
        border-radius: 12px;
        background: #1e293b;
        color: white;
        font-size: 18px;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .exito-box {
        background: white;
        border-radius: 24px;
        padding: 48px 32px;
        text-align: center;
        box-shadow: 0 8px 40px rgba(0,0,0,0.1);
        max-width: 480px;
        margin: 0 auto;
        animation: fadeIn 0.4s ease both;
    }

    .dias-scroll {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        padding-bottom: 8px;
        scrollbar-width: none;
    }
    .dias-scroll::-webkit-scrollbar { display: none; }

    .slots-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 10px;
        margin-top: 16px;
    }

    .error-msg {
        background: #fee2e2;
        color: #dc2626;
        border-radius: 10px;
        padding: 12px 16px;
        font-size: 14px;
        font-weight: 700;
        margin-top: 12px;
    }

    label { display: block; font-size: 12px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
`;

const styleTag = document.createElement("style");
styleTag.innerHTML = estilos;
document.head.appendChild(styleTag);

// --------- RENDER NAVBAR ---------
function renderNav() {
    return `
        <nav style="background:white; border-bottom:1px solid #e2e8f0; position:sticky; top:0; z-index:100; box-shadow:0 1px 8px rgba(0,0,0,0.06);">
            <div style="max-width:800px; margin:0 auto; padding:0 20px; height:64px; display:flex; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:10px; cursor:pointer;" onclick="cambiarVista('agendar')">
                    <div style="width:36px; height:36px; background:#2563eb; border-radius:10px; display:flex; align-items:center; justify-content:center;">
                        <span style="color:white; font-size:18px;">📅</span>
                    </div>
                    <span style="font-weight:900; font-size:18px; color:#1e293b; letter-spacing:-0.03em;">Sistema de Citas</span>
                </div>
                <div style="display:flex; gap:6px; align-items:center;">
                    <button class="nav-btn ${vistaActual === 'agendar' ? 'activo' : ''}" onclick="cambiarVista('agendar')">📋 Agendar</button>
                    <button class="nav-btn ${vistaActual === 'mis-citas' ? 'activo' : ''}" onclick="cambiarVista('mis-citas')">🔍 Mis Citas</button>
                    <button class="nav-btn ${vistaActual === 'admin' ? 'activo' : ''}" onclick="cambiarVista('admin')">🔐 Admin</button>
                </div>
            </div>
        </nav>
    `;
}

// --------- RENDER VISTA AGENDAR ---------
function renderAgendar() {
    const diasHTML = generarDias();
    const slotsHTML = renderSlots();

    return `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; align-items:start;" class="fade-in">

            <div class="tarjeta">
                <h2 style="margin:0 0 20px 0; font-size:22px; font-weight:900; color:#1e293b;">Reserva tu cita</h2>

                <div style="margin-bottom:16px;">
                    <label>Nombre completo</label>
                    <input id="inputNombre" class="input-field" type="text" placeholder="Tu nombre" />
                </div>

                <div style="margin-bottom:16px;">
                    <label>Teléfono</label>
                    <input id="inputTelefono" class="input-field" type="tel" placeholder="10 dígitos" />
                </div>

                <div style="margin-bottom:20px;">
                    <label>Email</label>
                    <input id="inputEmail" class="input-field" type="email" placeholder="tu@email.com" />
                </div>

                <div id="errorMsg" style="display:none;" class="error-msg"></div>

                <button class="btn-primary" onclick="confirmarCita()">
                    Verificar y confirmar →
                </button>
            </div>

            <div>
                <div class="tarjeta">
                    <h3 style="margin:0 0 14px 0; font-size:16px; font-weight:900; color:#1e293b;">📆 Selecciona el día</h3>
                    <div class="dias-scroll">${diasHTML}</div>
                </div>

                <div class="tarjeta">
                    <h3 style="margin:0 0 4px 0; font-size:16px; font-weight:900; color:#1e293b;">🕐 Horarios disponibles</h3>
                    <p style="font-size:12px; color:#94a3b8; margin:0 0 4px 0;">${fechaSeleccionada.toLocaleDateString("es-MX", { weekday:"long", month:"long", day:"numeric" })}</p>
                    <div class="slots-grid">${slotsHTML}</div>
                    <div style="display:flex; gap:16px; margin-top:16px; padding-top:16px; border-top:1px solid #f1f5f9;">
                        <div style="display:flex; align-items:center; gap:6px; font-size:11px; font-weight:700; color:#94a3b8;">
                            <div style="width:12px;height:12px;border-radius:4px;background:white;border:2px solid #e2e8f0;"></div> Disponible
                        </div>
                        <div style="display:flex; align-items:center; gap:6px; font-size:11px; font-weight:700; color:#94a3b8;">
                            <div style="width:12px;height:12px;border-radius:4px;background:#2563eb;"></div> Seleccionado
                        </div>
                        <div style="display:flex; align-items:center; gap:6px; font-size:11px; font-weight:700; color:#94a3b8;">
                            <div style="width:12px;height:12px;border-radius:4px;background:#fee2e2;"></div> Ocupado
                        </div>
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
        html += `
            <button class="dia-btn ${esActivo ? 'activo' : ''}" onclick="seleccionarDia('${fechaISO}')">
                <span class="dia-nombre">${nombre}</span>
                <span class="dia-num">${num}</span>
            </button>`;
    }
    return html;
}

function renderSlots() {
    const slots = generarSlots(fechaSeleccionada);
    return slots.map(s => {
        if (s.ocupado) {
            return `<button class="slot-btn ocupado" disabled>❌ ${s.hora12}</button>`;
        } else if (s.pasado) {
            return `<button class="slot-btn" disabled style="opacity:0.4;">🕐 ${s.hora12}</button>`;
        } else {
            const activo = slotSeleccionado === s.horaKey ? 'seleccionado' : '';
            return `<button class="slot-btn ${activo}" onclick="seleccionarSlot('${s.horaKey}')">✅ ${s.hora12}</button>`;
        }
    }).join("");
}

// --------- RENDER VISTA MIS CITAS ---------
function renderMisCitas() {
    return `
        <div class="fade-in" style="max-width:600px; margin:0 auto;">
            <div style="text-align:center; margin-bottom:32px;">
                <h2 style="font-size:28px; font-weight:900; color:#1e293b; margin:0 0 8px 0;">🔍 Busca tu cita</h2>
                <p style="color:#94a3b8; font-size:14px; margin:0;">Ingresa tu código de verificación para encontrar tu reservación</p>
            </div>

            <div style="position:relative; margin-bottom:24px;">
                <span style="position:absolute; left:16px; top:50%; transform:translateY(-50%); font-size:18px;">🔐</span>
                <input id="inputBuscarCita" class="input-field" type="text" placeholder="Código de verificación (6 caracteres)..." 
                    style="padding-left:48px; font-size:16px; padding-top:16px; padding-bottom:16px; text-transform:uppercase;"
                    oninput="renderBusquedaCitas()" />
            </div>

            <div id="resultadosCitas"></div>
        </div>
    `;
}

function renderBusquedaCitas() {
    const q = document.getElementById("inputBuscarCita").value.trim().toUpperCase();
    const contenedor = document.getElementById("resultadosCitas");

    if (!q) {
        contenedor.innerHTML = `
            <div style="text-align:center; padding:48px; background:white; border-radius:20px; border:2px dashed #e2e8f0;">
                <div style="font-size:40px; margin-bottom:12px;">🔐</div>
                <p style="color:#cbd5e1; font-weight:800; text-transform:uppercase; font-size:12px; letter-spacing:0.1em;">Ingresa tu código</p>
            </div>`;
        return;
    }

    const resultados = citas.filter(c => c.codigoVerificacion && c.codigoVerificacion === q);

    if (resultados.length === 0) {
        contenedor.innerHTML = `
            <div style="text-align:center; padding:48px; background:white; border-radius:20px;">
                <div style="font-size:40px; margin-bottom:12px;">😕</div>
                <p style="color:#94a3b8; font-weight:700;">No encontramos una cita con ese código</p>
            </div>`;
        return;
    }

    contenedor.innerHTML = resultados.map(c => {
        const fechaHora = new Date(`${c.fecha}T${c.horario}`);
        const pasada = fechaHora < new Date();
        return `
            <div class="cita-item">
                <div style="display:flex; align-items:center; gap:14px; flex:1;">
                    <div class="avatar">${c.nombre.charAt(0).toUpperCase()}</div>
                    <div>
                        <div style="font-weight:900; color:#1e293b; font-size:16px;">${c.nombre}</div>
                        <div style="font-size:13px; color:#64748b;">📞 ${c.telefono}</div>
                        <span class="${pasada ? 'badge-pasado' : 'badge-confirmado'}">${pasada ? 'Pasada' : 'Confirmada'}</span>
                    </div>
                </div>
                <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-end;">
                    <div style="text-align:right;">
                        <div style="font-size:12px; color:#94a3b8; font-weight:700; text-transform:uppercase;">${fechaHora.toLocaleDateString("es-MX", {month:"short", day:"numeric"})}</div>
                        <div style="font-size:20px; font-weight:900; color:#1e293b;">${fechaHora.toLocaleTimeString("es-MX", {hour:"2-digit", minute:"2-digit", hour12:true})}</div>
                    </div>
                    ${!pasada ? `<button onclick="cancelarCitaUsuario('${c.id}')" class="btn-danger" style="padding:8px 16px; font-size:12px;">🗑️ Cancelar cita</button>` : ''}
                </div>
            </div>`;
    }).join("");
}

// --------- RENDER VISTA ADMIN ---------
function renderAdmin() {
    if (!esAdmin) {
        return `
            <div style="max-width:420px; margin:0 auto;" class="fade-in">
                <div class="tarjeta" style="padding:48px 32px; text-align:center; position:relative; overflow:hidden;">
                    <div style="position:absolute; top:0; left:0; right:0; height:4px; background:#1e293b;"></div>
                    <div style="width:72px; height:72px; background:#1e293b; border-radius:20px; display:flex; align-items:center; justify-content:center; margin:0 auto 24px;">
                        <span style="font-size:32px;">🔐</span>
                    </div>
                    <h2 style="font-size:26px; font-weight:900; margin:0 0 8px 0; color:#1e293b;">Admin Login</h2>
                    <p style="color:#94a3b8; margin:0 0 32px 0; font-size:14px;">Ingresa tu contraseña para acceder al panel</p>
                    <div style="margin-bottom:16px;">
                        <input id="inputPassword" class="input-field" type="password" placeholder="Contraseña" 
                            onkeydown="if(event.key==='Enter') loginAdmin()" />
                    </div>
                    <div id="errorLogin" style="display:none;" class="error-msg">❌ Contraseña incorrecta</div>
                    <button class="btn-primary" style="margin-top:16px; background:#1e293b;" onclick="loginAdmin()">
                        Autenticar sesión
                    </button>
                </div>
            </div>`;
    }

    const citasOrdenadas = [...citas].sort((a, b) => new Date(a.fecha + "T" + a.horario) - new Date(b.fecha + "T" + b.horario));
    const q = busqueda;
    const filtradas = citasOrdenadas.filter(c =>
        normalizar(c.nombre).includes(normalizar(q)) ||
        c.telefono.includes(q)
    );

    return `
        <div class="fade-in">
            <div class="tarjeta" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;">
                <div>
                    <h2 style="margin:0 0 4px 0; font-size:26px; font-weight:900; color:#1e293b;">Panel Admin</h2>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:12px; color:#94a3b8; font-weight:700; text-transform:uppercase;">Total registros</span>
                        <span style="background:#2563eb; color:white; font-size:12px; font-weight:800; padding:2px 10px; border-radius:20px;">${citas.length}</span>
                    </div>
                </div>
                <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                    <div style="position:relative;">
                        <span style="position:absolute; left:12px; top:50%; transform:translateY(-50%);">🔍</span>
                        <input id="inputBuscarAdmin" class="input-field" type="text" placeholder="Buscar..." 
                            style="padding-left:40px; width:240px;"
                            oninput="busqueda=this.value; actualizarPagina();" value="${busqueda}" />
                    </div>
                    <button onclick="cerrarSesionAdmin()" style="padding:10px 16px; background:#fee2e2; color:#dc2626; border:none; border-radius:10px; font-weight:700; cursor:pointer;">
                        🔓 Cerrar sesión
                    </button>
                </div>
            </div>

            ${filtradas.length === 0 ? `
                <div style="text-align:center; padding:64px; background:white; border-radius:20px; border:2px dashed #e2e8f0;">
                    <div style="font-size:48px; margin-bottom:16px;">📭</div>
                    <p style="color:#94a3b8; font-weight:800; text-transform:uppercase; font-size:12px; letter-spacing:0.1em;">Sin resultados</p>
                </div>` :
            filtradas.map(c => {
                const fechaHora = new Date(`${c.fecha}T${c.horario}`);
                const pasada = fechaHora < new Date();
                return `
                <div class="cita-item">
                    <div style="display:flex; align-items:center; gap:14px;">
                        <div class="avatar">${c.nombre.charAt(0).toUpperCase()}</div>
                        <div>
                            <div style="font-weight:900; color:#1e293b; font-size:16px;">${c.nombre}</div>
                            <div style="font-size:13px; color:#64748b; margin-bottom:4px;">📞 ${c.telefono}</div>
                            <span class="${pasada ? 'badge-pasado' : 'badge-confirmado'}">${pasada ? 'Pasada' : 'Confirmada'}</span>
                        </div>
                    </div>
                    <div style="background:#f8fafc; border-radius:12px; padding:12px 20px; display:flex; gap:24px; border:1px solid #e2e8f0;">
                        <div>
                            <div style="font-size:10px; font-weight:800; color:#94a3b8; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px;">Fecha</div>
                            <div style="font-weight:900; color:#1e293b;">📅 ${fechaHora.toLocaleDateString("es-MX", {month:"short", day:"numeric", year:"numeric"})}</div>
                        </div>
                        <div style="width:1px; background:#e2e8f0;"></div>
                        <div>
                            <div style="font-size:10px; font-weight:800; color:#94a3b8; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px;">Hora</div>
                            <div style="font-weight:900; color:#1e293b;">🕐 ${fechaHora.toLocaleTimeString("es-MX", {hour:"2-digit", minute:"2-digit", hour12:true})}</div>
                        </div>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <a href="tel:${c.telefono}" style="padding:10px; background:#f1f5f9; border-radius:10px; text-decoration:none; font-size:18px; transition:background 0.2s;" title="Llamar">📞</a>
                        <button onclick="cancelarCita('${c.id}')" class="btn-danger" style="padding:10px 14px;">🗑️</button>
                    </div>
                </div>`;
            }).join("")}
        </div>`;
}

// --------- RENDER EXITO ---------
function renderExito(cita) {
    const fechaHora = new Date(`${cita.fecha}T${cita.horario}`);
    const mensaje = `Hola, quiero confirmar mi cita\n\n👤 Nombre: ${cita.nombre}\n📅 Fecha: ${fechaHora.toLocaleDateString("es-MX", {weekday:"long", year:"numeric", month:"long", day:"numeric"})}\n🕐 Hora: ${fechaHora.toLocaleTimeString("es-MX", {hour:"2-digit", minute:"2-digit", hour12:true})}`;
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    document.getElementById("contenido").innerHTML = `
        <div class="exito-box">
            <div style="width:80px; height:80px; background:#dcfce7; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 24px; font-size:40px;">✅</div>
            <h2 style="font-size:28px; font-weight:900; color:#1e293b; margin:0 0 12px 0;">¡Cita confirmada!</h2>
            <p style="color:#64748b; margin:0 0 24px 0; line-height:1.6;">
                Hola <strong>${cita.nombre}</strong>, tu cita quedó reservada para el 
                <strong>${fechaHora.toLocaleDateString("es-MX", {weekday:"long", month:"long", day:"numeric"})}</strong> 
                a las <strong>${fechaHora.toLocaleTimeString("es-MX", {hour:"2-digit", minute:"2-digit", hour12:true})}</strong>.
            </p>
            <div style="background:#eff6ff; border:2px solid #2563eb; border-radius:14px; padding:16px; margin-bottom:24px;">
                <div style="font-size:11px; font-weight:800; color:#2563eb; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:8px;">Tu código de verificación</div>
                <div style="font-size:28px; font-weight:900; color:#1e293b; letter-spacing:3px; font-family:monospace;">${cita.codigoVerificacion}</div>
                <div style="font-size:12px; color:#64748b; margin-top:8px;">Guarda este código para buscar tu cita</div>
            </div>
            <div style="display:flex; flex-direction:column; gap:12px;">
                <a href="${url}" target="_blank" class="btn-whatsapp">
                    💬 Notificar por WhatsApp
                </a>
                <button onclick="actualizarPagina()" style="background:none; border:none; color:#94a3b8; font-weight:700; font-size:14px; cursor:pointer; padding:12px; text-transform:uppercase; letter-spacing:0.08em;">
                    Agendar otra cita
                </button>
            </div>
        </div>`;
}

// --------- ACCIONES ---------
function cambiarVista(vista) {
    vistaActual = vista;
    busqueda = "";
    actualizarPagina();
}

function seleccionarDia(fechaISO) {
    fechaSeleccionada = new Date(fechaISO);
    slotSeleccionado = null;
    actualizarPagina();
}

function seleccionarSlot(horaKey) {
    slotSeleccionado = horaKey;
    actualizarPagina();
}

async function confirmarCita() {
    const nombre = document.getElementById("inputNombre").value.trim();
    const telefono = document.getElementById("inputTelefono").value.trim();
    const email = document.getElementById("inputEmail").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    const mostrarError = (msg) => {
        errorMsg.textContent = msg;
        errorMsg.style.display = "block";
        errorMsg.classList.remove("shake");
        void errorMsg.offsetWidth;
        errorMsg.classList.add("shake");
    };

    if (!nombre) return mostrarError("Por favor escribe tu nombre completo");
    if (!telefonoValido(telefono)) return mostrarError("Teléfono inválido, debe tener 10 dígitos");
    if (!email || !email.includes("@")) return mostrarError("Email inválido");
    if (!slotSeleccionado) return mostrarError("Por favor selecciona un horario");

    const fechaStr = fechaSeleccionada.toISOString().split("T")[0];
    const nuevaCita = {
        id: crypto.randomUUID(),
        nombre,
        telefono,
        email,
        fecha: fechaStr,
        horario: slotSeleccionado
    };

    const btnConfirmar = document.querySelector('.btn-primary');
    btnConfirmar.disabled = true;
    btnConfirmar.textContent = '⏳ Guardando...';

    const success = await guardarCitaSupabase(nuevaCita);
    btnConfirmar.disabled = false;
    btnConfirmar.textContent = 'Verificar y confirmar →';

    if (success) {
        citas.push(nuevaCita);
        slotSeleccionado = null;
        renderExito(nuevaCita);
    }
}

async function cancelarCitaUsuario(id) {
    if (!confirm("¿Estás seguro de que quieres cancelar tu cita? No podrás recuperarla.")) return;
    
    const { error } = await client
        .from('appointments')
        .delete()
        .eq('id', id);
    
    if (error) { 
        console.error("Error al cancelar:", error);
        alert("Error al cancelar la cita: " + error.message); 
        return; 
    }
    
    await cargarCitas();
    document.getElementById("inputBuscarCita").value = "";
    renderBusquedaCitas();
    mostrarNotificacion("✅ Cita cancelada correctamente", "success");
}

function mostrarNotificacion(mensaje, tipo = "success") {
    const notif = document.createElement("div");
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? '#dcfce7' : '#fee2e2'};
        color: ${tipo === 'success' ? '#16a34a' : '#dc2626'};
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 700;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    notif.textContent = mensaje;
    document.body.appendChild(notif);
    
    // Agregar keyframes dinámicamente si no existen
    if (!document.getElementById('notif-anim')) {
        const anim = document.createElement('style');
        anim.id = 'notif-anim';
        anim.innerHTML = '@keyframes slideIn { from { opacity:0; transform:translateX(100px); } to { opacity:1; transform:translateX(0); } }';
        document.head.appendChild(anim);
    }
    
    setTimeout(() => notif.remove(), 4000);
}

async function cancelarCita(id) {
    if (!confirm("¿Eliminar esta cita permanentemente?")) return;
    
    const { error } = await client
        .from('appointments')
        .delete()
        .eq('id', id);
    
    if (error) { 
        console.error("Error al eliminar:", error);
        alert("Error al eliminar: " + error.message); 
        return; 
    }
    
    await cargarCitas();
    actualizarPagina();
    mostrarNotificacion("✅ Cita eliminada", "success");
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

function cerrarSesionAdmin() {
    esAdmin = false;
    actualizarPagina();
}

// --------- PAGINA PRINCIPAL ---------
function actualizarPagina() {
    document.body.style.margin = "0";
    document.body.style.fontFamily = "'Inter', Arial, sans-serif";
    document.body.style.background = "#f1f5f9";
    document.body.style.minHeight = "100vh";

    let contenidoVista = "";
    if (vistaActual === "agendar") contenidoVista = renderAgendar();
    else if (vistaActual === "mis-citas") contenidoVista = renderMisCitas();
    else if (vistaActual === "admin") contenidoVista = renderAdmin();

    document.body.innerHTML = `
        ${renderNav()}
        <div style="max-width:900px; margin:0 auto; padding:32px 20px;">
            <div id="contenido">${contenidoVista}</div>
        </div>
        <footer style="text-align:center; padding:24px; background:#1e293b; color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; margin-top:48px;">
            <span style="color:#22c55e;">● Sistema activo</span> &nbsp;|&nbsp; Supabase activo &nbsp;|&nbsp; Base de datos en la nube
        </footer>
    `;
}

// --------- INIT ---------
async function init() {
    try {
        if (!window.supabase) {
            document.getElementById('app').innerHTML = `
                <div style="text-align:center; padding:48px;">
                    <h2 style="color:#dc2626;">Error al cargar</h2>
                    <p>No se pudo conectar con Supabase. Verifica tu conexión.</p>
                    <button onclick="location.reload()" style="padding:12px 24px; background:#2563eb; color:white; border:none; border-radius:8px; cursor:pointer;">Recargar</button>
                </div>`;
            return;
        }
        
        client = window.supabase.createClient(supabaseUrl, supabaseKey);
        await cargarCitas();
        actualizarPagina();
    } catch (error) {
        console.error("Error inicializando:", error);
        document.getElementById('app').innerHTML = `
            <div style="text-align:center; padding:48px;">
                <h2 style="color:#dc2626;">Error inesperado</h2>
                <p>${error.message}</p>
                <button onclick="location.reload()" style="padding:12px 24px; background:#2563eb; color:white; border:none; border-radius:8px; cursor:pointer;">Reintentar</button>
            </div>`;
    }
}

init();