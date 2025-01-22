const Pool = require('pg').Pool;
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, URL_SERVER, ENABLE_SSL } = require('./conexion_data_db.js')


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

const getListaRelacionSalsaSucursal = (request, response) => {
    const idSucursal = request.params.idSucursal;
    console.log('idSucursal=', idSucursal)
    pool.query(
        'SELECT rss.id_salsa as "idSalsa", sal.descripcion as "descripcionSalsa",s.id as "idSucursal",s.clave as "claveSucursal" '
        + 'FROM preesppropro.relacion_salsa_sucursal as rss '
        + 'INNER JOIN preesppropro.salsa AS sal ON sal.id=rss.id_salsa '
        + 'INNER JOIN preesppropro.sucursal AS s ON s.id=rss.id_sucursal '
        + 'AND s.id=$1 '
        + 'ORDER BY descripcion',
        [idSucursal],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}



const getRegistroRelacionSalsaSucursal = (request, response) => {
    const idPromocion = request.params.idPromocion;
    pool.query(
        'SELECT id_promocion as "idPromocion", nombre, descripcion, tipo, definicion, precio, activa, img_url as "imgURL" '
        + 'FROM preesppropro.promocion_especial WHERE id_promocion=$1 ORDER BY nombre',
        [idPromocion],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows[0]);
        }
    );
}
const getListadoSalsasNoEstanEnRSS = (request, response) => {
    const idSucursal = request.params.idSucursal;
    console.log('idSucursal=', idSucursal)
    pool.query(
        'SELECT s.id as "idSalsa", s.descripcion as "descripcionSalsa "'
        + 'FROM preesppropro.salsa AS s '
        + 'LEFT JOIN preesppropro.relacion_salsa_sucursal AS rss '
        + 'ON s.id = rss.id_salsa AND rss.id_sucursal = $1 '
        + 'WHERE rss.id_salsa IS NULL ORDER BY s.id, s.descripcion',
        [idSucursal],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}

const insertaRegistroRelacionSalsaSucursal = (req, res) => {
    const { idProducto, idSucursal, precio } = req.body;
    pool.query(
        'INSERT INTO preesppropro.relacion_producto_sucursal(id_producto, id_sucursal, precio) VALUES ($1, $2, $3) RETURNING *',
        [idProducto, idSucursal, precio],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó nuevo registro relacion producto sucursal: ' + results.rows[0].id_producto + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const actualizaRegistroRelacionSalsaSucursal = (req, res) => {
    const idProducto = req.params.idOrilla;
    const idSucursal = req.params.idSucursal;
    const { precio } = req.body;
    pool.query(
        'UPDATE preesppropro.relacion_producto_sucursal SET precio=$3 WHERE id_producto=$1 and id_sucursal=$2 RETURNING *',
        [idProducto, idSucursal, precio],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se actualizó relacion producto sucursal: ' + results.rows[0].id_producto + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const eliminaRegistroRelacionSalsaSucursal = (req, res) => {
    const idProducto = req.params.idProducto;
    const idSucursal = req.params.idSucursal;
    console.log('Entré a eliminaRegistroRelacionProductoSucursal');
    console.log('idProducto=' + idProducto);
    console.log('idSucursal=' + idSucursal);
    pool.query(
        'DELETE FROM preesppropro.relacion_producto_sucursal WHERE id_producto=$1 and id_sucursal=$2',
        [idProducto, idSucursal],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se eliminó ' + results.rows[0] + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

module.exports = {
    getListaRelacionSalsaSucursal,
    getRegistroRelacionSalsaSucursal,
    getListadoSalsasNoEstanEnRSS,
    insertaRegistroRelacionSalsaSucursal,
    actualizaRegistroRelacionSalsaSucursal,
    eliminaRegistroRelacionSalsaSucursal,
}