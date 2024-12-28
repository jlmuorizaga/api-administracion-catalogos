const Pool = require('pg').Pool;
const {DB_HOST, DB_USER,DB_PASSWORD, DB_NAME,DB_PORT,URL_SERVER,ENABLE_SSL} = require('./conexion_data_db.js')


//Pool de conexiones a base de datos
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


const getListaCategorias = (request, response) => {
    pool.query(
        'SELECT codigo, nombre FROM preesppropro.categoria ORDER BY nombre',
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}
const getCategoria= (request, response) => {
    const codigo = request.params.codigo;
    pool.query(
        'SELECT codigo, nombre FROM preesppropro.categoria WHERE codigo=$1 ORDER BY nombre',
        [codigo],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows[0]);
        }
    );
}
const insertaCategoria = (req, res) => {
    const { codigo, nombre } = req.body;
    pool.query(

        'INSERT INTO preesppropro.categoria(codigo, nombre) '
        +'VALUES ($1, $2) RETURNING *',
        [codigo,nombre],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó nueva categoria: ' + results.rows[0].codigo+ '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const actualizaCategoria= (req, res) => {
    const codigo = req.params.codigo;
    const { nombre } = req.body;
    pool.query(
        'UPDATE preesppropro.categoria SET nombre=$2 WHERE codigo=$1 RETURNING *',
        [codigo,nombre],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se actualizó categoria: ' + results.rows[0].codigo + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const eliminaCategoria = (req, res) => {
    const codigo = req.params.codigo;
    pool.query(
        'DELETE FROM preesppropro.categoria WHERE codigo=$1',
        [codigo],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se eliminó ' + results.rowCount + ' categoria: ' + codigo + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

module.exports = {
    getListaCategorias,
    getCategoria,
    insertaCategoria,
    actualizaCategoria,
    eliminaCategoria
}