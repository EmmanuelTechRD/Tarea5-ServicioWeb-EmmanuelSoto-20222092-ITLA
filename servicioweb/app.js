const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json()); // Middleware para manejar JSON en las solicitudes.

// Middleware para permitir solicitudes desde cualquier origen (CORS):
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Función para obtener la lista de contactos desde nuestra URL "http://www.raydelto.org/agenda.php":
const obtenerListaContactos = async () => {
    try {
        const response = await axios.get('https://www.raydelto.org/agenda.php');
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener la lista de contactos.');
    }
};

// Función para almacenar un nuevo contacto en el servicio web externo:
const almacenarContactoExterno = async (nuevoContacto) => {
    try {
        const response = await axios.post('https://www.raydelto.org/agenda.php', nuevoContacto, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error al almacenar el contacto en el servicio web externo.');
    }
};

// Nuestra ruta para listar contactos:
app.get('/listarContactos', async (req, res) => {
    try {
        const contactos = await obtenerListaContactos();
        res.json(contactos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Nuestra ruta para almacenar un contacto:
app.post('/almacenarContacto', async (req, res) => {
    const nuevoContacto = req.body; // Aquí suponemos que el cuerpo de la solicitud del servicio contiene el nuevo contacto.

    try {
        // Luego almacenamos el contacto en el servicio externo:
        await almacenarContactoExterno(nuevoContacto);

        // Aquí enviamos una respuesta, indicando si el contacto se almacenó correctamente:
        res.json({ mensaje: 'Contacto almacenado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`El servidor está escuchando en http://localhost:${port}`);
});