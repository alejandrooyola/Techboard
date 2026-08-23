const express = require('express');
const {Pool}= require('pg');

const app = express();
const PUERTO = 3000;

app.use(express.json());
app.use(express.static('public'));

//CONFIGURACION DE POSTGRESQL
const pool = new Pool({
    user: 'postgres', //usuario por defecto
    host: 'localhost', //host por defecto
    database: 'TechBoard_db', //nombre de la base de datos
    password: '123456', //contraseña de la base de datos
    port: 5432, //puerto por defecto
});

//RUTA GET: LEER TODAS LAS TAREAS
app.get('/api/tareas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tareas ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//RUTA POST: CREAR UNA NUEVA TAREA
app.post('/api/tareas', async (req, res) => {
    try {
        const { texto } = req.body;
        const consulta ='INSERT INTO tareas (texto, completada) VALUES ($1, false) RETURNING *';
        const result = await pool.query(consulta, [texto]);

        res.json({ mensaje: 'tarea guardada en BD', tarea: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//RUTA PUT: ACTUALIZAR EL ESTADO DE COMPLETADA (TRUE/ FALSE)
app.put('/api/tareas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { completada } = req.body;
        const consulta = 'UPDATE tareas SET completada = $1 WHERE id = $2 RETURNING *';
        const result = await pool.query(consulta, [completada, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'tarea no encontrada' });
        }

        res.json({ mensaje: 'estado actualizado', tarea: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//DELETE: ELIMINAR UNA TAREA POR ID
app.delete('/api/tareas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM tareas WHERE id = $1 RETURNING *', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'tarea no encontrada' });
        }

        res.json({ mensaje: 'tarea eliminada', tarea: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PUERTO, () => {
    console.log(`servidor de postgres listo en http://localhost:${PUERTO}`);
});
