const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const SqlConnection = require('./sql/connection');

const app = express();
const port = 3000;

// Middleware para leer JSON en los requests
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'frontend'
app.use(express.static(__dirname));

// Endpoint /register para insertar usuario en MySQL
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send("Username and password are required.");
        return;
    }

    const db = new SqlConnection();

    try {
        // Conectar a base de datos
        await db.connectToDb();

        console.log("Conected to the database");
        // Ejecutar consulta de inserción
        const result = await db.query(
            "INSERT INTO user (iduser, password) VALUES (?, ?)",
            [username, password]
        );

        console.log("Usuario registrado con ID:", result.insertId);
        res.status(200).send("User registered successfully!");

    } catch (err) {
        console.error("Error al registrar usuario:", err);
        res.status(500).send("There was an error while registering.");
    } finally {
        // Cerrar conexión
        await db.closeConnection();
    }
});

app.get('/user/:username', async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).send("Username is required.");
    }

    const db = new SqlConnection();

    try {
        await db.connectToDb();
        const query = "SELECT * FROM user WHERE iduser = ?";
        const result = await db.query(query, [username]);
        await db.closeConnection();

        if (result.length === 0) {
            res.status(404).send("User not found.");
        } else {
            res.status(200).json(result[0]); // Devuelve el usuario encontrado
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Database error: " + error.message);
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});