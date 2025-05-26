const db = require('./db');

async function guardarConsulta({ numero, mensaje, subtema_id, prompt, respuesta }) {
    const conn = await db.getConnection();

    try {
        // Verificar o insertar usuario
        let [rows] = await conn.query("SELECT id FROM usuarios WHERE numero_celular = ?", [numero]);
        let usuario_id;

        if (rows.length > 0) {
            usuario_id = rows[0].id;
        } else {
            const [insertResult] = await conn.query("INSERT INTO usuarios (numero_celular) VALUES (?)", [numero]);
            usuario_id = insertResult.insertId;
        }

        // Insertar consulta
        const [consultaResult] = await conn.query(`
            INSERT INTO consultas (usuario_id, mensaje, subtema_id, prompt_utilizado) 
            VALUES (?, ?, ?, ?)`, [usuario_id, mensaje, subtema_id, prompt]);

        const consulta_id = consultaResult.insertId;

        // Insertar respuesta
        await conn.query(`
            INSERT INTO respuestas (consulta_id, mensaje) 
            VALUES (?, ?)`, [consulta_id, respuesta]);

    } catch (error) {
        console.error("Error al guardar en la base de datos:", error);
    } finally {
        conn.release();
    }
}