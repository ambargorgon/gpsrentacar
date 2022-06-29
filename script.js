// Variables globales
let card;
let cerrarSesion = document.querySelector(".cerrarSesion")
let ordenarPreciosSelect = document.querySelector(".ordenarPrecios");
let sectionFondoVacio = document.querySelector("#fondoBar");
let sectionFondoTitulos= document.querySelector("#fondoTit");
let botonRegistro = document.querySelector(".btnRegistrarse");
let botonMisReservas = document.querySelector(".reservar");
let selectMoneda = document.querySelector(".selectMoneda");
let selectorPR = document.querySelector(".selectorprecios");
let fechaInicio = document.getElementById("dateFechaInicio");
let fechaFinal = document.getElementById("dateFechaFinal");
let usuarioGuardado = localStorage.getItem("Usuario");


// Iniciacion
document.addEventListener("DOMContentLoaded", function () {
  grabarNombre();
  imprimirProductos(autosDisponibles);
  sectionFondoVacio.style.display = "none"
});

// Registro
function guardarUsuario() {
  let nombreUsuario = document.querySelector(".nombreUsu").value;
  capitalizar(nombreUsuario);
  localStorage.setItem("Usuario", nombreUsuarioCap);
  grabarNombre();
}

function capitalizar(nombreUsuario) {
  return (nombreUsuarioCap = nombreUsuario[0].toUpperCase() + nombreUsuario.slice(1));
}

function guardarFechas() {
  let dateInicio = new Date(fechaInicio.value)
      dateInicio.setMinutes(dateInicio.getMinutes() + dateInicio.getTimezoneOffset())
  let dateFinal = new Date(fechaFinal.value)
      dateFinal.setMinutes(dateFinal.getMinutes() + dateFinal.getTimezoneOffset())
  let dateFinal_ = dateFinal.toLocaleDateString();
  let dateInicio_ = dateInicio.toLocaleDateString();
  // Difrencia de dias
  let fecha1 = moment(dateInicio);
  let fecha2 = moment(dateFinal);
  let diasDiferencia = fecha2.diff(fecha1, 'days')
  localStorage.setItem("Fecha Incio", dateInicio_);
  localStorage.setItem("Fecha Final", dateFinal_)
  localStorage.setItem("Dias diferencia", diasDiferencia);
}

// Impresion Cards
function imprimirProductos(array) {
  document.querySelector(".textoFechas").innerHTML = "";
  document.querySelector(".espacioAutos").style.display = "display: block";
  document.querySelector(".autosConsulta").style = "none";
  selectorPR.style.display = "initial";
  ordenarPreciosSelect.style.display = "initial";

  // Obtencion del DIV contenedor de cards
  let contenedor = document.querySelector(".espacioAutos");
  contenedor.innerHTML = "";
  //contenido en cards
  for (const auto of array) {
    card = document.createElement("div");
    card.innerHTML = `<div class="cartas" id="contenedorCards">
                                <h1 class="titulo-cartas"> ${auto.modelo}</h1>
                                <img src="${auto.img}" id:"imagen-cards" style= "width:200px";>
                                <h3 class= "marca-cards"> Marca: ${auto.marca}</h3>
                                <h4 class="precio-cards" id="precioCards${auto.id}">Precio por dia: $${auto.precio}</h4>
                                <button class="btn${auto.id}" onclick="masDetalles('${auto.imgDetalles}')">Más Detalles</button>
                         </div> `;

    contenedor.appendChild(card);
  } 
    ordenarPrecios(array);
    cambiarPrecio(array)
}

// FIltrado por Select
selectorPR.addEventListener("change", () => {
  if (selectorPR.value == "-10000") {
    const preciosBajos = autosDisponibles.filter((auto) => auto.precio < 10000);
    imprimirProductos(preciosBajos);
  } else if (selectorPR.value == "-15000") {
    const preciosMedios = autosDisponibles.filter((auto) => auto.precio >= 10000 && auto.precio < 14900);
    imprimirProductos(preciosMedios);
  } else if (selectorPR.value == "+15000") {
    const preciosAltos = autosDisponibles.filter((auto) => auto.precio >= 15000);
    imprimirProductos(preciosAltos);
  }});

// Selector Ordenar Por
function ordenarPrecios(array) {
  ordenarPreciosSelect.addEventListener("change", () => {
    if (ordenarPreciosSelect.value == "menorAMayor") {
      array.sort(function (a, b) {
        return a.precio - b.precio;
      });
    } else if (ordenarPreciosSelect.value == "mayorAMenor") {
      array.sort(function (a, b) {
        return b.precio - a.precio;
      }); 
    } else if (ordenarPreciosSelect.value == "alfabetico") {
      array.sort(function (a, b) {
        return a.modelo.localeCompare(b.modelo);
      });
    }
    imprimirProductos(array);
    array == autosConsulta && imprimirConsulta(array)
  });
}

// Select Moneda
function cambiarPrecio(array) {
  let diasDiferenciaSt = localStorage.getItem("Dias diferencia"); 
  selectMoneda.options[0].selected = "selected";
  selectMoneda.addEventListener("change", () => {
    if (selectMoneda.value == "argentinos") {
      console.log("argentinos");
      imprimirProductos(array);
      array == autosConsulta && imprimirConsulta(autosConsulta);
    } else if (selectMoneda.value == "dolares") {
      fetch("https://api-dolar-argentina.herokuapp.com/api/dolaroficial")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        for (const auto of array){
        let cartas = document.querySelector(`#precioCards${auto.id}`);
        dolarFinal = (auto.precio / data.venta).toFixed(0);
        cartas.innerHTML = `Precio por dia: US$${dolarFinal}`
        if(array == autosConsulta){
        let precioConsulta = document.querySelector(`#precioDias${auto.id}`);
        precioConsulta.innerHTML = `Precio por ${diasDiferenciaSt} dias: US$${dolarFinal * diasDiferenciaSt}`}
        }});
    } else if (selectMoneda.value == "reales") {
      fetch("https://api-dolar-argentina.herokuapp.com/api/real/nacion")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          for (const auto of array){
            let cartas = document.querySelector(`#precioCards${auto.id}`);
            realFinal = (auto.precio / data.venta).toFixed(0);
            cartas.innerHTML = `Precio por dia: R$${realFinal}`
            if(array == autosConsulta){
              let precioConsulta = document.querySelector(`#precioDias${auto.id}`);
              precioConsulta.innerHTML = `Precio por ${diasDiferenciaSt} dias: R$${realFinal * diasDiferenciaSt}`}
            }});
    }
  });
}

// Imprimir consulta
const autosConsulta = autosDisponibles.filter((auto) => auto.condicion === "disponible");

function imprimirConsulta(autosConsulta) {  
  let diasDiferenciaSt = localStorage.getItem("Dias diferencia")
  let fechaInicio = localStorage.getItem("Fecha Incio");
  let fechaFinal = localStorage.getItem("Fecha Final");
  // Validacion de consulta
  if(fechaFinal != "Invalid Date" && fechaInicio != "Invalid Date"){
  selectorPR.style.display = "none";
  ordenarPreciosSelect.style.display = "none";
   let contConsulta = document.querySelector(".espacioAutos");
  contConsulta.innerHTML = "";
  let imprimirFecha = fechaFinal != "Invalid Date" &&"Autos disponibles desde el " + fechaInicio + " al " + fechaFinal;
  document.querySelector(".textoFechas").innerHTML = imprimirFecha || ""
  // Contenido en cards
  for (const auto of autosConsulta) {
    card = document.createElement("div");

    card.innerHTML = `<div class="cartas" id="contenedorCards">
                        <h1 class="titulo-cartas"> ${auto.modelo}</h1>
                        <img src="${auto.img}" id:"imagen-cards" style= "width:200px";>
                        <h3 class= "marca-cards"> Marca: ${auto.marca}</h3>
                        <h4 class="precio-cards" id="precioCards${auto.id}"> Precio por día: $${auto.precio}</h4>
                        <h4 class="precio-cards" id="precioDias${auto.id}"> Precio por ${diasDiferenciaSt} días: $${auto.precio * diasDiferenciaSt}</h4>
                        <button type="button" class="reservaAuto" id="btn${auto.id}" onclick="guardarReserva('${auto.modelo}',${auto.id})">Reservar</button><br>
                        <button id="masDetallesConsulta"onclick="masDetalles('${auto.imgDetalles}')">Más Detalles</button>
                     </div> `;

    contConsulta.appendChild(card);
  }cambiarPrecio(autosConsulta);
}else{
  Swal.fire({
    position: "top",
    icon: "error",
    title: "Selecciona una fecha válida",
    showConfirmButton: false,
    timer: 1500,
    toast: true,
  });
  }
}

// Cambio de fondos
function aparecerConsulta(){
document.querySelector(".contenedorFechas").style.display = "initial";
document.querySelector(".misReservas").style.display = "none"
sectionFondoVacio.style.display = "none"
sectionFondoTitulos.style.display = "initial"
}

// Boton Mis Reservas / Registrarse
function grabarNombre() {
  // Obtencion de datos
  let diasDiferenciaSt = localStorage.getItem("Dias diferencia")
  let inicioObtenido = localStorage.getItem("Fecha Incio");
  let finalObtenido = localStorage.getItem("Fecha Final");

  if (usuarioGuardado != null) {
    cerrarSesion.style.display = "initial";
    cerrarSesion.addEventListener("click", () => {localStorage.clear();  location.reload();})
  // Saludo en NAV    
    botonMisReservas.innerHTML = "Mis reservas";
    let saludoEnNav = document.querySelector(".saludoEnNav");
    let nombrecortado = usuarioGuardado.split(" ");
    let primerNombre = nombrecortado[0];
    saludoEnNav.innerHTML = `Hola  ${primerNombre}!`;
// Imprimir "Mis reservas"
    botonMisReservas.addEventListener("click", () => {
    let autoObtenido = localStorage.getItem("Auto Reservado");
    let autoEnObjeto = JSON.parse(autoObtenido);
    console.log(autoEnObjeto)
      if (autoEnObjeto != null && inicioObtenido != null && finalObtenido != null) {
        let contReservas = document.querySelector(".misReservas");
        sectionFondoTitulos.style.display = "none"
        sectionFondoVacio.style.display = "initial"
        document.querySelector(".misReservas").style.display ="initial"
        document.querySelector(".contenedorFechas").style.display = "none";
        contReservas.innerHTML = `  <div class="contenedorReservas">
                                            <div class="apartadoTitulo">
                                              <h2 class="tituloReserva">Mis Reservas</h2><br>
                                            </div>
                                        <section class="apartadoReservas">
                                            <div class="contenidoReserva">
                                              <img src=${autoEnObjeto.img} class="imagenReserva">
                                              <h3 class= "modeloReserva">${autoEnObjeto.marca}, ${autoEnObjeto.modelo}</h3>
                                              <h3 class= "precioPorDia">Precio por día: $${autoEnObjeto.precio}</h3>
                                              <h3 class= "precioPorXDias">Precio por ${diasDiferenciaSt} días: $${autoEnObjeto.precio * diasDiferenciaSt}</h3>
                                            </div> 
                                            <div class="preciosReserva"> 
                                              <h3 class="inicioReserva">Inicio: ${inicioObtenido || "-"}</h3>
                                              <h3 class="finalReserva">Final: ${finalObtenido|| "-"}</h3>
                                            </div>
                                        </section>
                                        <section class="otrosBotones">
                                          <button class="confirmacion" onclick="reservaHecha()">Confirmar Reserva</button></a>
                                          <a href="https://api.whatsapp.com/send?phone=542944417270" target="_blank">
                                          <button class="contactar">Contactar con GPS</button></a>
                                          <button class="consultar" onclick="aparecerConsulta()">Consultar de nuevo</button></a>
                                        </section>
                                    </div>`
      }else{
        if(autoEnObjeto == null){
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "No tienes ninguna reserva",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });}
      } });
  
  } else {
    cerrarSesion.style.display = "none"
    // PopUP de Registro
    botonMisReservas.innerHTML = `Registrarse`;
    let close = document.querySelector(".close");
    let open = document.querySelector(".open");
    let popUp = document.querySelector(".popUp");
    let popUpContainer = document.querySelector(".popUp-container");

    open.addEventListener("click", function (e) {
      e.preventDefault();
      popUpContainer.style.opacity = "1";
      popUpContainer.style.visibility = "visible";
      popUp.classList.toggle("popUp-close");
    });

    close.addEventListener("click", function (e) {
      e.preventDefault();
      popUp.classList.toggle("popUp-close");
      setTimeout(() => {
        popUpContainer.style.opacity = "0";
        popUpContainer.style.visibility = "hidden";
      }, 320);
    });

    window.addEventListener("click", function (e) {
      if (e.target == popUpContainer) {
        popUp.classList.toggle("popUp-close");
        setTimeout(() => {
          popUpContainer.style.opacity = "0";
          popUpContainer.style.visibility = "hidden";
        }, 320);
      }
    });

    botonRegistro.addEventListener("click", function (e) {
      e.preventDefault();
      popUp.classList.toggle("popUp-close");
      setTimeout(() => {
        popUpContainer.style.opacity = "0";
        popUpContainer.style.visibility = "hidden";
      }, 320);
      location.reload();
    });
  }
}

// PopUp reserva 
function reservado() {
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Tu reserva se ejecutó exitosamente",
    text: 'Chequea el apartado de "Mis reservas"',
    showConfirmButton: false,
    timer: 2500,
    toast: true,
    width: 300,
    
  });  
}

// Guardar Reservas
function guardarReserva(autoModelo, id) {
  console.log(autosDisponibles[id])
  if (usuarioGuardado != null) {
    autoModelo = JSON.stringify(autosDisponibles[id]);
    localStorage.setItem("Auto Reservado", autoModelo);
    reservado();
    grabarNombre()
  } else {
    Swal.fire({
      position: "top",
      icon: "error",
      title: "Primero debes Iniciar Sesion",
      showConfirmButton: false,
      timer: 1500,
      toast: true,
    });
  }
}

// PopUp Mas Detalles
function masDetalles(img){
  Swal.fire({
          imageUrl: img,
          imageWidth: 400,
          imageHeight: 400,
          background: "#e7e7e7",
          confirmButtonColor: "#ff4719",
          showClass: {
              popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
          }
      })}
      
// Reserva Finalizada
function reservaHecha(){
  Swal.fire({
    position: "center",
    width: 450,
    icon: "success",
    title: "Tu reserva se ejecutó exitosamente",
    text: "Gracias por confiar en nosotros!",
    showConfirmButton: false,
    timer: 1500,
  });  
}
