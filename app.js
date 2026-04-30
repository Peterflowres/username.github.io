let citas = [];
let busqueda = "";

const horarios = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM"
];

// ✅ TU NÚMERO YA LISTO (México +52)
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

            listaCitasHTML += `
                <li style="margin-bottom:10px; padding:10px; background:white; border-radius:8px; list-style:none;">
                    👤 <strong>${citas[i].nombre}</strong> — 
                    📞 ${citas[i].telefono} — 
                    📅 ${citas[i].fecha} — 
                    🕐 ${citas[i].horario}
                    <button class="btnCancelar" data-id="${citas[i].id}" style="background:lightcoral; border:none; padding:5px 10px; border-radius:5px; margin-left:10px; cursor:pointer;">❌ Cancelar</button>
                </li>`;
        }
    }

    if (busqueda !== "" && citasEncontradas === 0) {
        listaCitasHTML = `<p>😕 No se encontraron citas para "${busqueda}"</p>`;
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
    document.body.style.padding = "30px";
    document.body.style.background = "#f0f4f8";

    document.body.innerHTML = `
        <h1>📅 Sistema de Citas</h1>
        <p>📊 Total de citas agendadas: <strong id="totalCitas">${citas.length}</strong></p>
        <hr>

        <label><strong>Tu nombre:</strong></label><br>
        <input id="inputNombre" type="text" placeholder="Escribe tu nombre" style="padding:8px; margin-top:5px; border-radius:5px; border:1px solid #ccc; width:250px;"/>

        <br><br>

        <label><strong>Tu teléfono:</strong></label><br>
        <input id="inputTelefono" type="tel" placeholder="10 dígitos" style="padding:8px; margin-top:5px; border-radius:5px; border:1px solid #ccc; width:250px;"/>

        <br><br>

        <label><strong>Selecciona una fecha:</strong></label><br>
        <input id="inputFecha" type="date" style="padding:8px; margin-top:5px; border-radius:5px; border:1px solid #ccc;"/>

        <br><br>

        <button id="btnVerHorarios" style="padding:10px 20px; background:#4CAF50; color:white; border:none; border-radius:5px; cursor:pointer;">
            🔍 Ver horarios disponibles
        </button>

        <div id="horariosList"></div>

        <br>
        <hr>

        <h3>📋 Citas agendadas:</h3>
        <input id="inputBuscar" type="text" placeholder="🔍 Buscar por nombre o teléfono" style="padding:8px; border-radius:5px; border:1px solid #ccc; width:300px;"/>

        <br><br>

        <ul id="listaCitas" style="padding:0"></ul>
    `;

    document.getElementById("inputFecha").min =
        new Date().toISOString().split("T")[0];

    filtrarCitas();

    document.getElementById("inputBuscar").addEventListener("input", function() {
        busqueda = this.value;
        filtrarCitas();
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
            alert("Teléfono inválido");
            return;
        }

        let horariosHTML = `<br><h3>Horarios disponibles para ${fecha}:</h3>`;

        for (let i = 0; i < horarios.length; i++) {

            let ocupado = estaOcupado(fecha, horarios[i]);

            if (ocupado) {
                horariosHTML += `<button disabled style="background:lightcoral; margin:5px; padding:8px; border:none; border-radius:5px;">❌ ${horarios[i]}</button>`;
            } else {
                horariosHTML += `<button class="btnHorario"
                    data-nombre="${nombre}"
                    data-telefono="${telefono}"
                    data-fecha="${fecha}"
                    data-horario="${horarios[i]}"
                    style="background:lightgreen; margin:5px; padding:8px; border:none; border-radius:5px; cursor:pointer;">
                    ✅ ${horarios[i]}
                </button>`;
            }
        }

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

                // 🚀 WHATSAPP AUTOMÁTICO
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

// INIT
cargarCitas();
actualizarPagina();