const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
    // Nota: Adaptado a las columnas de tu BD. Si tu front envía 'boleta', 
    // debes hacer un ALTER TABLE a tu base de datos para agregarla.
    const { nombre, apellido_paterno, apellido_materno, correo, contrasena } = req.body;

    // 1. Validación estricta del dominio institucional
    if (!correo || !correo.endsWith('@alumno.ipn.mx')) {
        return res.status(400).json({ error: 'Validación fallida: Solo se permiten correos @alumno.ipn.mx.' });
    }

    try {
        // 2. Verificar si el usuario ya existe
        const userCheck = await db.query('SELECT * FROM Usuario WHERE Correo_Institucional = $1', [correo]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado.' });
        }

        // 3. Hashear la contraseña (Factor de costo: 10)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);

        // 4. Insertar en PostgreSQL (usando RETURNING para obtener el ID generado)
        const insertQuery = `
            INSERT INTO Usuario (Nombre, Apellido_Paterno, Apellido_Materno, Correo_Institucional, Contrasena)
            VALUES ($1, $2, $3, $4, $5) RETURNING ID_Usuario;
        `;
        const result = await db.query(insertQuery, [nombre, apellido_paterno, apellido_materno, correo, hashedPassword]);
        const newUserId = result.rows[0].id_usuario;

        // 5. Simular el envío de correo (MVP)
        const verifyToken = jwt.sign({ id: newUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // En producción, aquí va Nodemailer. Por ahora, lo imprimimos en consola.
        console.log(`[MVP SIMULACIÓN EMAIL] Enlace de validación para ${correo}: http://localhost:3000/api/auth/verify/${verifyToken}`);

        // Respuesta 202 Accepted según nuestra corrección arquitectónica
        res.status(202).json({ 
            message: 'Registro exitoso. Revisa tu consola para ver el enlace de activación.' 
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error interno del servidor al registrar el usuario.' });
    }
};