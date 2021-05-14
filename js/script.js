let request;
let tbody;

window.addEventListener('load', () => {
  request = new XMLHttpRequest();
  tbody = $("tbody");
  GetData();
});

function GetData() {
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      $("spinnerBlockScreen").className = "hidden";
      if (request.status == 200) {
        fillTable(JSON.parse(request.responseText));
      }
      else {
        console.error("error:", request.responseText);
      }
    }
    else{
      $("spinnerBlockScreen").className = "visible";
    }
  }

  request.open('GET', 'http://localhost:3000/materias', true);
  request.send();
}

function fillTable(data) {
  data.forEach(e => {
    let tr = document.createElement('tr');
    tr.id = e.id;
    tr.addEventListener('dblclick', openModal);

    for (fieldValue in e) {
      if (fieldValue == 'id') continue;

      let td = document.createElement('td');

      td.appendChild(document.createTextNode(e[fieldValue]));
      tr.appendChild(td);
    };

    tbody.appendChild(tr);
  });
}

function openModal(event) {
  let id = event.target.parentNode.id;
  let tds = event.target.parentNode.childNodes;

  $("txtNombre").value = tds[0].textContent;
  $("selectCuatrimestre").value = tds[1].textContent;
  $("txtFechaFinal").value = tds[2].textContent;

  if(tds[3].textContent == $("rdbM").value)
    $("rdbM").checked = true;
  else
    $("rdbN").checked = true;

  $("btnEliminar").onclick = () => deleteMateria(id);
  $("btnModificar").onclick = () => updateMateria(id);
  $("btnCerrar").onclick = () => hide($("modalBlockScreen"));

  makeVisible($("modalBlockScreen"));
}

function deleteMateria(id) {
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      $("spinnerBlockScreen").className = "hidden";
      if (request.status == 200) {
        clearTable();
        GetData();
      }
      else {
        console.error("error:", request.responseText);
      }
    }
    else{
      $("spinnerBlockScreen").className = "visible";
    }
  }

  request.open('POST', 'http://localhost:3000/eliminar', true);
  request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  request.send(JSON.stringify({ id }));
  hide($("modalBlockScreen"));
}

function updateMateria(id) {
  let nombre = $("txtNombre");
  let cuatrimestre = $("selectCuatrimestre");
  let fecha = $("txtFechaFinal");
  let turno = $("rdbM").checked ? $("rdbM") : $("rdbN");

  let nameIsValid = validateStringInput(nombre.value);
  let dateIsValid = validateDateInput(fecha.value);

  nombre.className = nameIsValid ? "normalInput" : "errorInput";
  fecha.className = dateIsValid ? "normalInput" : "errorInput";

  if (nameIsValid && dateIsValid) {
    let data = {
      id,
      nombre: nombre.value,
      cuatrimestre: cuatrimestre.selectedOptions,
      fecha: fecha.value,
      turno: turno.value
    };

    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        $("spinnerBlockScreen").className = "hidden";
        if (request.status == 200) {
          let tds = $(id).childNodes;
          
          tds[0].textContent = data.nombre;
          // tds[1].textContent = data.cuatrimestre;
          tds[2].textContent = data.fecha;
          tds[3].textContent = data.turno;
        }
        else {
          console.error("error:", request.responseText);
        }
      }
      else{
        $("spinnerBlockScreen").className = "visible";
      }
    }

    request.open('POST', 'http://localhost:3000/editar', true);
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send(JSON.stringify(data));
    hide($("modalBlockScreen"));
  }
}

function validateStringInput(fieldString) {
  return fieldString.length >= 6;
}

function validateDateInput(dateInput) {
  let dateArray = dateInput.split('/');
  return Date.parse([dateArray[1], dateArray[0], dateArray[2]]) >= Date.now();
}

function clearTable() {
  while (tbody.firstChild) {
    tbody.removeChild(tbody.lastChild);
  }
}

function makeVisible(element){
  element.className = 'visible';
}

function hide(element){
  element.className = 'hidden';
}
function $(id) {
  return document.getElementById(id);
}