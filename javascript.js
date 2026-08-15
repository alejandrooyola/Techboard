const formulario = document.getElementById("formulario-tarea");
const inputTareas = document.getElementById("input-tarea");
const listaTareas = document.getElementById("lista-tareas");

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();
    const textoTarea = inputTareas.value.trim();
    if (textoTarea !== '') {
        const nuevaTarea = document.createElement("li");
        nuevaTarea.textContent = textoTarea;
        listaTareas.appendChild(nuevaTarea);
        inputTareas.value = '';
    }
});