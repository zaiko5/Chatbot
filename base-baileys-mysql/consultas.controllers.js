const db = require('./db');

async function guardarConsulta({ numero, mensaje, subtema_id, respuesta }) {
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
        let tema_id = null;
        if (subtema_id !== null && subtema_id !== undefined) {
            // Obtener el tema_id desde la tabla subtemas
            const [subtemaRows] = await conn.query("SELECT tema_id FROM subtemas WHERE id = ?", [subtema_id]);
            if (subtemaRows.length > 0) {
                tema_id = subtemaRows[0].tema_id;
            }
        }

        // Insertar consulta (sin prompt_utilizado)
        const [consultaResult] = await conn.query(`
            INSERT INTO consultas (usuario_id, mensaje, subtema_id, tema_id)
            VALUES (?, ?, ?, ?)`, [usuario_id, mensaje, subtema_id, tema_id]);

        const consulta_id = consultaResult.insertId;

        // Insertar respuesta
        await conn.query(`
            INSERT INTO respuestas (consulta_id, mensaje)
            VALUES (?, ?)`, [consulta_id, respuesta.content]);

    } catch (error) {
        console.error("Error al guardar en la base de datos:", error);
    } finally {
        conn.release();
    }
}

module.exports = guardarConsulta; // Asegúrate de exportar la función si está en un archivo separado