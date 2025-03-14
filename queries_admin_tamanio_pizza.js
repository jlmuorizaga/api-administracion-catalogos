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


const getListaTamaniosPizza = (request, response) => {
    pool.query(
        'SELECT id, nombre FROM preesppropro.tamanio_pizza ORDER BY nombre',
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}
const getTamanioPizza= (request, response) => {
    const idTamanioPizza = request.params.idTamanioPizza;
    pool.query(
        'SELECT id, nombre FROM preesppropro.tamanio_pizza WHERE id=$1 ORDER BY nombre',
        [idTamanioPizza],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows[0]);
        }
    );
}
const insertaTamanioPizza = (req, res) => {
    const { id, nombre } = req.body;
    pool.query(
        'INSERT INTO preesppropro.tamanio_pizza(id, nombre) ' 
        +'VALUES ($1, $2) RETURNING *',
        [id,nombre],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó nuevo tamaño pizza: ' + results.rows[0].id + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const actualizaTamanioPizza = (req, res) => {
    const idTamanioPizza = req.params.idTamanioPizza;
    const { nombre } = req.body;
    pool.query(
        'UPDATE preesppropro.tamanio_pizza SET nombre=$1 WHERE id=$2 RETURNING *',
        [nombre, idTamanioPizza],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se actualizó tamaño_pizza: ' + results.rows[0].id + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const eliminaTamanioPizza = (req, res) => {
    const idTamanioPizza = req.params.idTamanioPizza;
    pool.query(
        'DELETE FROM preesppropro.tamanio_pizza WHERE id=$1 ',
        [idTamanioPizza],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se eliminó ' + results.rowCount + ' tamanio_pizza: ' + idTamanioPizza + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

module.exports = {
    getListaTamaniosPizza,
    getTamanioPizza,
    insertaTamanioPizza,
    actualizaTamanioPizza,
    eliminaTamanioPizza
}