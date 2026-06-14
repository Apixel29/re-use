const db = require('../config/db');

exports.getSavedArticles = async (req, res) => {
    const userId = req.user.id;
    try {
        // Hacemos un JOIN para devolver la información útil del producto guardado
        const query = `
            SELECT p.ID_Producto, p.Titulo, p.Precio, p.Fotos, p.Estado, p.Tipo_Adquisicion, u.Nombre as Vendedor
            FROM Guardado g
            JOIN Producto p ON g.ID_Producto = p.ID_Producto
            JOIN Usuario u ON p.ID_Usuario = u.ID_Usuario
            WHERE g.ID_Usuario = $1
            ORDER BY g.ID_Guardado DESC
        `;
        const result = await db.query(query, [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al listar guardados:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

exports.saveArticle = async (req, res) => {
    const userId = req.user.id;
    const { articleId } = req.params;

    try {
        // Verificar si ya está guardado para evitar duplicados SQL
        const check = await db.query('SELECT ID_Guardado FROM Guardado WHERE ID_Usuario = $1 AND ID_Producto = $2', [userId, articleId]);
        if (check.rows.length > 0) {
            return res.status(400).json({ error: 'El artículo ya está en tu lista de guardados.' });
        }

        await db.query('INSERT INTO Guardado (ID_Usuario, ID_Producto) VALUES ($1, $2)', [userId, articleId]);
        res.status(201).json({ message: 'Artículo guardado exitosamente.' });
    } catch (error) {
        console.error('Error al guardar artículo:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

exports.removeSavedArticle = async (req, res) => {
    const userId = req.user.id;
    const { articleId } = req.params;

    try {
        const result = await db.query('DELETE FROM Guardado WHERE ID_Usuario = $1 AND ID_Producto = $2 RETURNING ID_Guardado', [userId, articleId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'El artículo no estaba guardado.' });
        }

        res.status(200).json({ message: 'Artículo removido de guardados.' });
    } catch (error) {
        console.error('Error al remover artículo guardado:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};