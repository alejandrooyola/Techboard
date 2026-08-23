//SELECCIONAR ELEMENTOS
const formulario = document.getElementById('formulario-tareas');
const inputTarea = document.getElementById('input-tarea');
const listaTareas = document.getElementById('lista-tareas');

//FUNCION PARA PEDIR Y PINTAR LAS TAREAS DESDE POSTGRESQL (GET)
const mostrarTareas = async () => {
    try {
        const res = await fetch('/api/tareas');
        const tareas = await res.json();

        listaTareas.innerHTML = ''; //LIMPIA LA LISTA
        tareas.forEach(tarea => {
            const nuevaTarea = document.createElement('li');
            if (tarea.completada) {nuevaTarea.classList.add('completada');
            }
            //INYECTAMOS EL TEXTO, BOTON DE ESTADO Y ELIMINAR USANDO EL ID DE LA BASE DE DATOS
            nuevaTarea.innerHTML = `
                <span data-id="${tarea.id}">${tarea.texto}</span> 
                <button class="btn-borrar" data-id="${tarea.id}">Borrar</button>
            `;
            listaTareas.appendChild(nuevaTarea);
        });
    } catch (error) {
        console.error('Error al cargar las tareas:', error);
    }
};

//CARGAR LAS TAREAS APENAS ABRE LA PAGINA
mostrarTareas();

//ESCUCHAR EL FORMULARIO PARA GUARDAR EN LA BASE DE DATOS (POST)
formulario.addEventListener('submit', async function (e) {
    e.preventDefault();
    const textoTarea = inputTarea.value.trim();
   
    if (textoTarea !== '') {
        await fetch('/api/tareas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: textoTarea })
        });
        mostrarTareas();
        inputTarea.value = '';
    }
});

//ESCUCHAR CLICS EN LA LISTA (DELEGACION DE EVENTOS)
listaTareas.addEventListener('click', async function (e) {
    //SI CLIQUEO EL BOTON BORRAR (DELETE)
    if (e.target.classList.contains('btn-borrar')) {
        const id = e.target.getAttribute('data-id');
        await fetch(`/api/tareas/${id}`, {method: 'DELETE' });
        mostrarTareas();
    }

    //SI HACE CLIC EN LA TAREA CAMBIA EL ESTADO COMPLETADA (PUT)
    else if (e.target.tagName === 'SPAN'|| e.target.tagName === 'LI') {
        const elementoLi = e.target.closest('li');
        const span = elementoLi.querySelector('span');
        const id = span.getAttribute('data-id');
        const estaCompletada = !elementoLi.classList.contains('completada');

        await fetch(`/api/tareas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completada: estaCompletada })
        });
        mostrarTareas();
    }
});
