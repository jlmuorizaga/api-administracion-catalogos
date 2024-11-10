const Pool = require('pg').Pool;

const {DB_HOST,DB_USER,DB_PASSWORD,DB_NAME,DB_PORT,URL_SERVER} = require('./conexion_data_db.js')


//Pool de conexiones a base de datos
const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
    ssl: {
        rejectUnauthorized: false,
    },

});


const getListaTiposProducto = (request, response) => {
    pool.query(
        'SELECT id, descripcion, img_url as "imgURL", nombre, orden FROM preesppropro.producto_tipo order by nombre asc',
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}
const getTipoProducto= (request, response) => {
    const idTipoProducto = request.params.idTipoProducto;    
    pool.query(
        'SELECT id, descripcion, img_url as "imgURL", nombre, orden FROM preesppropro.producto_tipo WHERE id=$1;',
        [idTipoProducto],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows[0]);
        }
    );
}
const insertaTipoProducto = (req, res) => {
    const { id, descripcion, imgURL, nombre, orden} = req.body;
    pool.query(
        'INSERT INTO preesppropro.producto_tipo(id, descripcion, img_url, nombre, orden) '
        +'VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [id,descripcion,imgURL,nombre,orden],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó nuevo tipo_producto: ' + results.rows[0].id + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const actualizaTipoProducto= (req, res) => {
    const idTipoProducto = req.params.idTipoProducto;
    const { descripcion,imgURL, nombre, orden } = req.body;
    pool.query(
        'UPDATE preesppropro.producto_tipo SET descripcion=$2, img_url=$3, nombre=$4, orden=$5 WHERE id=$1 RETURNING *',
        [idTipoProducto,descripcion,imgURL, nombre, orden],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se actualizó tpo_producto: ' + results.rows[0].id + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const eliminaTipoProducto = (req, res) => {
    const idTipoProducto = req.params.idTipoProducto;
    pool.query(
        'DELETE FROM preesppropro.producto_tipo WHERE id=$1 ',
        [idTipoProducto],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se eliminó ' + results.rowCount + ' tpo_producto: ' + idTipoProducto + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

module.exports = {
    getListaTiposProducto,
    getTipoProducto,
    insertaTipoProducto,
    actualizaTipoProducto,
    eliminaTipoProducto
}