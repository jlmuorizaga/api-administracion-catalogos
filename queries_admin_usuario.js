const Pool = require('pg').Pool;
const {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, ENABLE_SSL} = require('./conexion_data_db.js');

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
    ...(ENABLE_SSL && {
        ssl: {
            rejectUnauthorized: false,
        },
    }),
});

const getUsuarioByCredentials = async (usuario, contrasenia) => {
    try {
        const results = await pool.query(
            'SELECT id, usuario, nombre FROM preesppropro.usuario WHERE usuario = $1 AND contrasenia = $2',
            [usuario, contrasenia]
        );
        return results.rows[0];
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getUsuarioByCredentials
};
