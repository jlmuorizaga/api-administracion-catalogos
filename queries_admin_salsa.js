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


const getListaSalsas = (request, response) => {
    pool.query(
        'SELECT id, descripcion FROM preesppropro.salsa ORDER BY descripcion',
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}
const getSalsa= (request, response) => {
    const id = request.params.id;
    pool.query(
        'SELECT id, descripcion FROM preesppropro.salsa WHERE id=$1 ORDER BY descripcion',
        [id],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows[0]);
        }
    );
}
const insertaSalsa = (req, res) => {
    const { id, descripcion } = req.body;
    pool.query(
        'INSERT INTO preesppropro.salsa(id, descripcion) ' 
        +'VALUES ($1, $2) RETURNING *',
        [id,descripcion],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó nueva salsa: ' + results.rows[0].id + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const actualizaSalsa= (req, res) => {
    const id = req.params.id;
    const { descripcion } = req.body;
    pool.query(
        'UPDATE preesppropro.salsa SET descripcion=$1 WHERE id=$2 RETURNING *',
        [descripcion,id],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se actualizó salsa: ' + results.rows[0].id + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const eliminaSalsa = (req, res) => {
    const id = req.params.id;
    pool.query(
        'DELETE FROM preesppropro.salsa WHERE id=$1 ',
        [id],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se eliminó ' + results.rowCount + ' salsa: ' + id + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

module.exports = {
    getListaSalsas,
    getSalsa,
    insertaSalsa,
    actualizaSalsa,
    eliminaSalsa
}