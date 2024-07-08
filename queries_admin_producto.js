const Pool = require('pg').Pool;

const {DB_HOST,DB_USER,DB_PASSWORD,DB_NAME,DB_PORT,URL_SERVER} = require('./conexion_data_db.js')


//Pool de conexiones a base de datos
const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
 /*   ssl: {
        rejectUnauthorized: false,
    },
*/
});


const getListaProducto = (request, response) => {
    pool.query(
        'SELECT id, descripcion, tamanio, usa_salsa, id_tipo_producto, ruta_imagen '
        +'FROM preesppropro.producto ORDER BY descripcion;',
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}
const getProducto= (request, response) => {
    const idProducto = request.params.idProducto;    
    pool.query(
        'SELECT id, descripcion, tamanio, usa_salsa, id_tipo_producto, ruta_imagen '
        +'FROM preesppropro.producto WHERE id=$1;',
        [idProducto],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows[0]);
        }
    );
}
const insertaProducto = (req, res) => {
    const { id, descripcion,  tamanio, usa_salsa, id_tipo_producto, ruta_imagen} = req.body;
    pool.query(
        'INSERT INTO preesppropro.producto(id, descripcion, tamanio, usa_salsa, id_tipo_producto, ruta_imagen) '
        +'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [id,descripcion,tamanio, usa_salsa, id_tipo_producto, ruta_imagen],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó nuevo producto: ' + results.rows[0].id + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const actualizaProducto= (req, res) => {
    const idProducto = req.params.idProducto;
    const { descripcion, tamanio, usa_salsa, id_tipo_producto, ruta_imagen } = req.body;
    pool.query(
        'UPDATE preesppropro.producto SET descripcion=$1, tamanio=$2, usa_salsa=$3, '
        +'id_tipo_producto=$4, ruta_imagen=$5 WHERE id=$6 RETURNING *',
        [descripcion, tamanio, usa_salsa, id_tipo_producto, ruta_imagen,idProducto],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se actualizó producto: ' + results.rows[0].id + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const eliminaProducto = (req, res) => {
    const idProducto = req.params.idProducto;
    pool.query(
        'DELETE FROM preesppropro.producto WHERE id=$1 ',
        [idProducto],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se eliminó ' + results.rowCount + ' producto: ' + idProducto + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

module.exports = {
    getListaProducto,
    getProducto,
    insertaProducto,
    actualizaProducto,
    eliminaProducto
}