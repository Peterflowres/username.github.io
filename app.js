let citas = [];
let busqueda = "";
let esAdmin = false;
const PASSWORD_ADMIN = "1234"; // 🔐 cambia esto por tu contraseña

const horarios = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM"
];

const numeroWhatsApp = "524425761233";

// --------- STORAGE ---------
function guardarCitas() {
    localStorage.setItem("citas", JSON.stringify(citas));
}

function cargarCitas() {
    const data = localStorage.getItem("citas");
    if (data) citas = JSON.parse(data);
}

// --------- HELPERS ---------
function telefonoValido(tel) {
    return /^[0-9]{10}$/.test(tel);
}

function estaOcupado(fecha, horario) {
    return citas.some(c => c.fecha === fecha && c.horario === horario);
}

function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// --------- ESTILOS ---------
const estilos = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    .tarjeta-cita {
        animation: fadeIn 0.3s ease;
    }
    .tarjeta-cita:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        transition: all 0.2s ease;
    }
`;

const styleTag = document.createElement("style");
styleTag.innerHTML = estilos;
document.head.appendChild(styleTag);

// --------- FILTRAR ---------
function filtrarCitas() {
    citas.sort((a, b) => {
        return new Date(a.fecha + " " + a.horario) - new Date(b.fecha + " " + b.horario);
    });

    let listaCitasHTML = "";
    let citasEncontradas = 0;

    for (let i = 0; i < citas.length; i++) {
        if (
            normalizar(citas[i].nombre).includes(normalizar(busqueda)) ||
            citas[i].telefono.includes(busqueda)
        ) {
            citasEncontradas++;

            if (esAdmin) {
                listaCitasHTML += `
                    <li class="tarjeta-cita" style="
                        margin-bottom:12px;
                        padding:15px 20px;
                        background:white;
                        border-radius:12px;
                        list-style:none;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                    ">
                        <span>
                            👤 <strong>${citas[i].nombre}</strong> — 
                            📞 ${citas[i].telefono} — 
                            📅 ${citas[i].fecha} — 
                            🕐 ${citas[i].horario}
                        </span>
                        <button class="btnCancelar" data-id="${citas[i].id}" style="
                            background:lightcoral;
                            border:none;
                            padding:6px 12px;
                            border-radius:8px;
                            cursor:pointer;
                            font-size:14px;
                        ">❌ Cancelar</button>
                    </li>`;
            } else {
                listaCitasHTML += `
                    <li class="tarjeta-cita" style="
                        margin-bottom:12px;
                        padding:15px 20px;
                        background:white;
                        border-radius:12px;
                        list-style:none;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                    ">
                        📅 ${citas[i].fecha} — 🕐 ${citas[i].horario} — <em style="color:#aaa;">datos privados</em>
                    </li>`;
            }
        }
    }

    if (busqueda !== "" && citasEncontradas === 0) {
        listaCitasHTML = `<p>😕 No se encontraron citas para "${busqueda}"</p>`;
    }

    if (citas.length === 0) {
        listaCitasHTML = `<p style="color:#aaa;">No hay citas agendadas aún.</p>`;
    }

    document.getElementById("listaCitas").innerHTML = listaCitasHTML;

    document.querySelectorAll(".btnCancelar").forEach(function(boton) {
        boton.addEventListener("click", function() {
            if (!confirm("¿Cancelar esta cita?")) return;
            const id = +boton.dataset.id;
            citas = citas.filter(c => c.id !== id);
            guardarCitas();
            busqueda = "";
            document.getElementById("inputBuscar").value = "";
            filtrarCitas();
            document.getElementById("totalCitas").textContent = citas.length;
        });
    });
}

// --------- PAGINA ---------
function actualizarPagina() {
    document.body.style.fontFamily = "Arial";
    document.body.style.background = "#f0f4f8";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    document.body.innerHTML = `
        <div style="max-width:650px; margin:0 auto; padding:40px 20px;">

            <div style="background:white; border-radius:16px; padding:30px; box-shadow:0 4px 20px rgba(0,0,0,0.08); margin-bottom:24px;">
                <h1 style="margin:0 0 5px 0;">📅 Sistema de Citas</h1>
                <p style="color:#888; margin:0 0 20px 0;">📊 Total de citas: <strong id="totalCitas">${citas.length}</strong></p>

                <label><strong>Tu nombre:</strong></label><br>
                <input id="inputNombre" type="text" placeholder="Escribe tu nombre" style="padding:10px; margin-top:5px; border-radius:8px; border:1px solid #ddd; width:100%; box-sizing:border-box;"/>

                <br><br>

                <label><strong>Tu teléfono:</strong></label><br>
                <input id="inputTelefono" type="tel" placeholder="10 dígitos" style="padding:10px; margin-top:5px; border-radius:8px; border:1px solid #ddd; width:100%; box-sizing:border-box;"/>

                <br><br>

                <label><strong>Selecciona una fecha:</strong></label><br>
                <input id="inputFecha" type="date" style="padding:10px; margin-top:5px; border-radius:8px; border:1px solid #ddd; width:100%; box-sizing:border-box;"/>

                <br><br>

                <button id="btnVerHorarios" style="
                    padding:12px 24px;
                    background:#4CAF50;
                    color:white;
                    border:none;
                    border-radius:8px;
                    cursor:pointer;
                    font-size:16px;
                    width:100%;
                ">🔍 Ver horarios disponibles</button>

                <div id="horariosList"></div>
            </div>

            <div style="background:white; border-radius:16px; padding:30px; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3 style="margin:0;">📋 Citas agendadas</h3>
                    <button id="btnAdmin" style="
                        padding:8px 16px;
                        background:${esAdmin ? "#ff6b6b" : "#4CAF50"};
                        color:white;
                        border:none;
                        border-radius:8px;
                        cursor:pointer;
                        font-size:14px;
                    ">${esAdmin ? "🔓 Cerrar sesión" : "🔐 Admin"}</button>
                </div>

                <input id="inputBuscar" type="text" placeholder="🔍 Buscar por nombre o teléfono" style="padding:10px; border-radius:8px; border:1px solid #ddd; width:100%; box-sizing:border-box;"/>
                <br><br>
                <ul id="listaCitas" style="padding:0; margin:0;"></ul>
            </div>

        </div>
    `;

    document.getElementById("inputFecha").min =
        new Date().toISOString().split("T")[0];

    filtrarCitas();

    document.getElementById("inputBuscar").addEventListener("input", function() {
        busqueda = this.value;
        filtrarCitas();
    });

    document.getElementById("btnAdmin").addEventListener("click", function() {
        if (esAdmin) {
            esAdmin = false;
            actualizarPagina();
        } else {
            let password = prompt("🔐 Ingresa la contraseña de admin:");
            if (password === PASSWORD_ADMIN) {
                esAdmin = true;
                actualizarPagina();
            } else {
                alert("❌ Contraseña incorrecta");
            }
        }
    });

    document.getElementById("btnVerHorarios").addEventListener("click", function() {
        let nombre = document.getElementById("inputNombre").value.trim();
        let telefono = document.getElementById("inputTelefono").value.trim();
        let fecha = document.getElementById("inputFecha").value;

        if (nombre === "" || telefono === "" || fecha === "") {
            alert("Por favor completa todos los campos!");
            return;
        }

        if (!telefonoValido(telefono)) {
            alert("Teléfono inválido (10 dígitos)");
            return;
        }

        let horariosHTML = `<br><h3>Horarios disponibles para ${fecha}:</h3><div style="display:flex; flex-wrap:wrap; gap:8px;">`;

        for (let i = 0; i < horarios.length; i++) {
            let ocupado = estaOcupado(fecha, horarios[i]);
            if (ocupado) {
                horariosHTML += `<button disabled style="background:#ffcccc; padding:10px 16px; border:none; border-radius:8px; font-size:14px;">❌ ${horarios[i]}</button>`;
            } else {
                horariosHTML += `<button class="btnHorario"
                    data-nombre="${nombre}"
                    data-telefono="${telefono}"
                    data-fecha="${fecha}"
                    data-horario="${horarios[i]}"
                    style="background:#d4edda; padding:10px 16px; border:none; border-radius:8px; cursor:pointer; font-size:14px;">
                    ✅ ${horarios[i]}
                </button>`;
            }
        }

        horariosHTML += `</div>`;
        document.getElementById("horariosList").innerHTML = horariosHTML;
        document.getElementById("horariosList").scrollIntoView({ behavior: "smooth" });

        document.querySelectorAll(".btnHorario").forEach(function(boton) {
            boton.addEventListener("click", function() {
                let nuevaCita = {
                    id: Date.now(),
                    nombre: boton.dataset.nombre,
                    telefono: boton.dataset.telefono,
                    fecha: boton.dataset.fecha,
                    horario: boton.dataset.horario
                };

                if (estaOcupado(nuevaCita.fecha, nuevaCita.horario)) {
                    alert("Ese horario ya fue tomado");
                    return;
                }

                citas.push(nuevaCita);
                guardarCitas();

                let mensaje = `Hola, quiero confirmar mi cita\n\n👤 Nombre: ${nuevaCita.nombre}\n📅 Fecha: ${nuevaCita.fecha}\n🕐 Hora: ${nuevaCita.horario}`;
                let url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
                window.open(url, "_blank");

                document.getElementById("inputNombre").value = "";
                document.getElementById("inputTelefono").value = "";
                document.getElementById("inputFecha").value = "";

                actualizarPagina();
            });
        });
    });
}

cargarCitas();
actualizarPagina();