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


const getListaRegiones = (request, response) => {
    pool.query(
        'SELECT id as "idRegion", nombre as "nombreRegion", poligono, latitud, longitud FROM preesppropro.region ORDER BY nombre',
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}
const getRegion= (request, response) => {
    const idRegion = request.params.idRegion
    pool.query(
        'SELECT id, nombre, poligono, latitud, longitud FROM preesppropro.region WHERE id=$1 ORDER BY nombre',
        [idRegion],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows[0]);
        }
    );
}
const insertaRegion = (req, res) => {
    const { idRegion, nombreRegion, poligono, latitud, longitud } = req.body;
    pool.query(
        'INSERT INTO preesppropro.region (id, nombre, poligono, latitud, longitud) VALUES ($1, $2, $3, $4, $5) RETURNING *',        
        [idRegion,nombreRegion,poligono, latitud, longitud],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó nueva region: ' + results.rows[0].id + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const actualizaRegion= (req, res) => {
    const idRegion = req.params.idRegion;
    const { nombreRegion, poligono, latitud, longitud } = req.body;
    pool.query(
        'UPDATE preesppropro.region SET nombre=$1, poligono=$3, latitud=$4, longitud=$5 WHERE id=$2 RETURNING *',
        [nombreRegion,idRegion,poligono, latitud, longitud],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se actualizó region: ' + results.rows[0].id + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const eliminaRegion = (req, res) => {
    const idRegion = req.params.idRegion;
    pool.query(
        'DELETE FROM preesppropro.region WHERE id=$1 ',
        [idRegion],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se eliminó ' + results.rowCount + ' region: ' + idRegion + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

module.exports = {
    getListaRegiones,
    getRegion,
    insertaRegion,
    actualizaRegion,
    eliminaRegion
}