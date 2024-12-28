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


const getListaProducto = (request, response) => {
    pool.query(
        'SELECT id, descripcion, tamanio, usa_salsa, id_tipo_producto, ruta_imagen, categoria1, categoria2, categoria3 '
        +'FROM preesppropro.producto ORDER BY descripcion;',
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}

const getListaProducto2 = (request, response) => {
    pool.query(
        'SELECT p.id as "id", p.descripcion as "descripcion_p", tamanio as "tamanio", '
        +'usa_salsa as "usa_salsa", id_tipo_producto as "id_tipo_producto",' 
        +'pt.nombre as "nombre_tp", ruta_imagen as "ruta_imagen", categoria1 as "categoria1",' 
        +'categoria2 as "categoria2", categoria3 as "categoria3" '
        +'FROM preesppropro.producto as p, preesppropro.producto_tipo as pt where p.id_tipo_producto=pt.id ORDER BY p.descripcion;',
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
        'SELECT id, descripcion, tamanio, usa_salsa, id_tipo_producto, ruta_imagen, categoria1, categoria2, categoria3 '
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
    const { id, descripcion_p,  tamanio, usa_salsa, id_tipo_producto, ruta_imagen, categoria1, categoria2, categoria3} = req.body;
    pool.query(
        'INSERT INTO preesppropro.producto(id, descripcion, tamanio, usa_salsa, id_tipo_producto, ruta_imagen, categoria1, categoria2, categoria3) '
        +'VALUES ($1, $2, $3, $4, $5, $6,$7, $8, $9) RETURNING *',
        [id,descripcion_p,tamanio, usa_salsa, id_tipo_producto, ruta_imagen, categoria1, categoria2, categoria3],
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
    const { descripcion_p, tamanio, usa_salsa, id_tipo_producto, ruta_imagen, categoria1, categoria2, categoria3 } = req.body;
    pool.query(
        'UPDATE preesppropro.producto SET descripcion=$1, tamanio=$2, usa_salsa=$3, '
        +'id_tipo_producto=$4, ruta_imagen=$5, categoria1=$6, categoria2=$7, categoria3=$8 WHERE id=$9 RETURNING *',
        [descripcion_p, tamanio, usa_salsa, id_tipo_producto, ruta_imagen, categoria1, categoria2, categoria3,idProducto],
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
    getListaProducto2,
    getProducto,
    insertaProducto,
    actualizaProducto,
    eliminaProducto
}