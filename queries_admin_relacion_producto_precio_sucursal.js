
const Pool = require('pg').Pool;

const {DB_HOST,DB_USER,DB_PASSWORD,DB_NAME,DB_PORT} = require('./conexion_data_db.js')


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


const getListaRelacionProductoPrecioSucursal = (request, response) => {
    const idSucursal = request.params.idSucursal;
    console.log('idSucursal='+idSucursal);
    pool.query(

        'SELECT id_producto, descripcion ||\' - \'|| tamanio as descripcion,id_sucursal, clave,nombre_sucursal, precio_normal,aplica_bebida_chica_gratis '
   +'FROM preesppropro.relacion_producto_sucursal rs , preesppropro.producto p, preesppropro.sucursal s '
   +'WHERE id_sucursal=$1 and rs.id_producto=p.id and rs.id_sucursal=s.id',
                [idSucursal],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}
const getRelacionProductoPrecioSucursal = (request, response) => {
    const idSucursal = request.params.idSucursal;
    const idProducto = request.params.idProducto;    
    pool.query(
        'SELECT id_producto, descripcion ||\' - \'|| tamanio as descripcion,id_sucursal, clave,nombre_sucursal, precio_normal,aplica_bebida_chica_gratis '
   +'FROM preesppropro.relacion_producto_sucursal rs , preesppropro.producto p, preesppropro.sucursal s '
   +'WHERE id_sucursal=$1 and rs.id_producto=$2 and rs.id_producto=p.id and rs.id_sucursal=s.id',
                [idSucursal,idProducto],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}
const insertaRelacionProductoPrecioSucursal = (request, response) => {
    const { idProducto, idSucursal,precionormal,aplicabebidachicagratis} = request.body;
   pool.query(
    'INSERT INTO preesppropro.relacion_producto_sucursal(id_producto, id_sucursal,'
    +'precio_normal,aplica_bebida_chica_gratis) VALUES ($1, $2, $3, $4) RETURNING *;',        
        [idProducto,idSucursal,precionormal,aplicabebidachicagratis],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó nuevo registro relacion_producto_precio_sucursal: ' + results.rows[0].id_producto + '"}';
            response.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const actualizaRelacionProductoPrecioSucursal= (request, response) => {
    const idProducto = request.params.idProducto;
    const idSucursal = request.params.idSucursal;    
    const {precionormal,aplicabebidachicagratis } = request.body;

    pool.query(
        'UPDATE preesppropro.relacion_producto_sucursal '
        +'SET id_producto=$1, id_sucursal=$2, precio_normal=$3, aplica_bebida_chica_gratis=$4 WHERE id_producto=$1 and id_sucursal=$2 RETURNING *;',        
        [idProducto,idSucursal,precionormal,aplicabebidachicagratis],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se actualizó relacion_producto_precio_sucursal: ' + results.rows[0].id_producto + '"}';
            response.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const eliminaRelacionProductoPrecioSucursal = (request, response) => {
    const idProducto = request.params.idProducto;
    const idSucursal = request.params.idSucursal; 
    pool.query(
        'DELETE FROM preesppropro.relacion_producto_sucursal WHERE id_producto=$1 and id_sucursal=$2',        
        [idProducto,idSucursal],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se eliminó ' + results.rowCount + ' relacion_producto_precio_sucursal: ' + idProducto + '"}';
            response.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

module.exports = {
    getListaRelacionProductoPrecioSucursal,
    getRelacionProductoPrecioSucursal,
    insertaRelacionProductoPrecioSucursal,
    actualizaRelacionProductoPrecioSucursal,
    eliminaRelacionProductoPrecioSucursal
}