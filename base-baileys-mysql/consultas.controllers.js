const db = require('./db');

function getCurrentWeek(){
    const ahora = new Date;
    const año = ahora.getFullYear();
    const mes = ahora.getMonth() + 1;  
    const dia = ahora.getDate();
    return semanaDelMes = Math.floor((dia - 1) / 7) + 1;z
}

async function guardarConsulta({ numero, mensaje, subtema_id, respuesta }) {
    const conn = await db.getConnection();

    try {
        // Verificar o insertar usuario
        let [rows] = await conn.query("SELECT id FROM usuario WHERE numero_celular = ?", [numero]);
        let usuario_id;

        if (rows.length > 0) {
            usuario_id = rows[0].id;
        } else {
            const [insertResult] = await conn.query("INSERT INTO usuario (numero_celular) VALUES (?)", [numero]);
            usuario_id = insertResult.insertId;
        }
        let tema_id = null;
        if (subtema_id !== null && subtema_id !== undefined) {
            // Obtener el tema_id desde la tabla subtemas
            const [subtemaRows] = await conn.query("SELECT tema_id FROM subtema WHERE id = ?", [subtema_id]);
            if (subtemaRows.length > 0) {
                tema_id = subtemaRows[0].tema_id;
            }
        }
        console.log(subtema_id)

        // Insertar consulta (sin prompt_utilizado)
        const ahora = new Date(); // <-- Esta línea es la que falta
        const year = ahora.getFullYear();
        const month = ahora.getMonth() + 1;  
        const day = ahora.getDate();
        const week = getCurrentWeek();
        const [consultaResult] = await conn.query(`
            INSERT INTO consulta (usuario_id, mensaje, subtema_id, tema_id, day, month, year, week )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [usuario_id, mensaje, subtema_id, tema_id, day, month, year, week]);
        

        const consulta_id = consultaResult.insertId;
        

        
        // Insertar respuesta
        await conn.query(`
            INSERT INTO respuesta (consulta_id, mensaje)
            VALUES (?, ?)`, [consulta_id, respuesta.content]);

    } catch (error) {
        console.error("Error al guardar en la base de datos:", error);
    } finally {
        conn.release();
    }
}

async function getPrompt() {
    let conn; 
    try {
        conn = await db.getConnection(); // Get a connection from the pool

        const [rows] = await conn.query("SELECT id, prompt as content FROM prompt WHERE id = 1");

        if (rows.length > 0) {
            return { id: 1, content: rows[0].content }; 
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching prompt from database:", error);
        throw error; 
    } finally {
        if (conn) {
            conn.release();
        }
    }
}

module.exports = {
    guardarConsulta,
    prompt: getPrompt // Export getPrompt as 'prompt' to match main.js import
};