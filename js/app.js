//Selectores
const form = document.querySelector('#form');
const contenido = document.querySelector('#contenido');
const entidadSelect = document.querySelector('#entidad');
const municipioSelect = document.querySelector('#municipio');
const localidadSelect = document.querySelector('#localidad');

//Eventos
leerEventos();
function leerEventos() {
     document.addEventListener('DOMContentLoaded', disOpciones);
     form.addEventListener('submit', validarCodigo);
}

//Funciones

//Deshabilitar opciones de los select
function disOpciones() {
     entidad.disabled = true;
     entidad.classList.add('disabled');

     municipio.disabled = true;
     municipio.classList.add('disabled');

     localidad.disabled = true;
     localidad.classList.add('disabled');
}

//Función de mensajes
function mostrarMensaje(mensaje, tipo) {
     const div = document.createElement('div');
     div.classList.add('mensaje');
     div.textContent = mensaje;

     //Valida el tipo de mensaje
     if(tipo === 'error') {
          div.classList.add('error');
     } else {
          div.classList.add('success');
     }

     //Valida que solo haya un mensaje de error
     const cantidad = document.querySelectorAll('.mensaje');
     if(cantidad.length === 0) {
          document.querySelector('.title').appendChild(div);
     }

     //Configurar solo por 3seg
     setTimeout(() => {
          div.remove();
     }, 3000);
}

//Validación del código postal
function validarCodigo(e) {
     e.preventDefault();
     
     //Selecciona el postal
     const postal = document.querySelector('#postal').value;

     //Valida que el campo no este vacio
     if(postal === '') {
          mostrarMensaje('No puede dejar campos vacios', 'error');
          disOpciones();
          limpiarEstado();
          limpiarMunicipio();
          limpiarLocalidad();
          return;
     } 

     buscarDatos(postal);
}

//Busqueda de datos en la API
function buscarDatos(postal) {
     const url = `https://api-sepomex.hckdrk.mx/query/info_cp/${postal}?type=simplified`;

     fetch(url)
               .then(datos => datos.json())
               .then(datos => {
                    mostrarDatos(datos.response);
               })
               .catch(function(error) {
                    mostrarMensaje('El código postal ingresado es invalido', 'error');
                    disOpciones();
                    limpiarEstado();
                    limpiarMunicipio();
                    limpiarLocalidad();
               })

}

//Mostrar datos de la API
function mostrarDatos(datos) { 
     const { estado, municipio, asentamiento } = datos;

     mostrarMensaje('Datos encontrados correctamente', 'success');

     //Obtener coincidencias
     obtenerEstado(estado);
     obtenerMunicipio(municipio);
     obtenerLocalidad(asentamiento);
}

//Validación de estado
function obtenerEstado(estado) {
     //Limpia busqueda anterior
     limpiarEstado();

     const llenado = document.createElement('option');
     llenado.value = estado;
     llenado.textContent = estado;
     entidadSelect.appendChild(llenado);
}

//Validación de municipio
function obtenerMunicipio(municipio) {
     //limpiar busqueda anterior
     limpiarMunicipio();

     const llenado = document.createElement('option');
     llenado.value = municipio;
     llenado.textContent = municipio;
     municipioSelect.appendChild(llenado);
}

//Validación de localidad
function obtenerLocalidad(asentamiento) {
     //Limpia busqueda anterior
     limpiarLocalidad();

     localidadSelect.disabled = false;
     localidadSelect.classList.remove('disabled');

     for(let i = 0; i < asentamiento.length; i++) {
          const llenado = document.createElement('option');
          llenado.value = i;
          llenado.textContent = asentamiento[i];
          localidadSelect.appendChild(llenado);
     }
}

//Limpiar contenido de estado
function limpiarEstado() {
     while(entidadSelect.firstChild) {
          entidadSelect.removeChild(entidadSelect.firstChild);
     }
}

//Limpiar contenido de municipio
function limpiarMunicipio() {
     while(municipioSelect.firstChild) {
          municipioSelect.removeChild(municipioSelect.firstChild);
     }
}

//Limpiar contenido de localidad
function limpiarLocalidad() {
     while(localidadSelect.children[1]) {
          localidadSelect.removeChild(localidadSelect.children[1]);
     }
}