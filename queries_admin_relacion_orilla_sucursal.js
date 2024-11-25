const Pool = require('pg').Pool;

const {DB_HOST,DB_USER,DB_PASSWORD,DB_NAME,DB_PORT} = require('./conexion_data_db.js')


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


const getListaRelacionOrillaSucursal = (request, response) => {
    const idSucursal = request.params.idSucursal;
    console.log('idSucursal=',idSucursal)
    pool.query(
        'SELECT ros.id_orilla as "idOrilla", o.descripcion as "descripcionOrilla", tp.id as "idTamanioPizza",tp.nombre as "tamanioPizza",'
        +'ros.id_sucursal as "idSucursal", s.clave as "claveSucursal",ros.precio as "precio"'
        +'FROM preesppropro.relacion_orilla_sucursal as ros '
        +'INNER JOIN preesppropro.orilla as o ON ros.id_orilla=o.id '
        +'INNER JOIN preesppropro.tamanio_pizza as tp ON o.id_tamanio=tp.id '
        +'INNER JOIN preesppropro.sucursal AS s ON s.id=ros.id_sucursal and s.id=$1 '
        +'ORDER BY "descripcionOrilla","tamanioPizza"',
        [idSucursal],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}


const getRegistroRelacionOrillaSucursal= (request, response) => {
    const idPromocion = request.params.idPromocion;
    pool.query(
        'SELECT id_promocion as "idPromocion", nombre, descripcion, tipo, definicion, precio, activa, img_url as "imgURL" '
        +'FROM preesppropro.promocion_especial WHERE id_promocion=$1 ORDER BY nombre',
        [idPromocion],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows[0]);
        }
    );
}
const insertaRegistroRelacionOrillaSucursal = (req, res) => {
    const { idPromocion, nombre,descripcion,tipo,definicion,precio,activa,imgURL } = req.body;
    pool.query(
        'INSERT INTO preesppropro.promocion_especial(id_promocion, nombre, descripcion,'
        +'tipo, definicion, precio, activa,img_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [idPromocion, nombre,descripcion,tipo,definicion,precio,activa,imgURL],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó nueva promocion_especial: ' + results.rows[0].id_promocion + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const actualizaRegistroRelacionOrillaSucursal= (req, res) => {
    const idPromocion = req.params.idPromocion;
    const { nombre,descripcion,tipo,definicion,precio,activa, imgURL } = req.body;
    console.log('Estoy en ActualizaPromocionEspecial');
    console.log('idPromocion=',idPromocion);
    pool.query(
        'UPDATE preesppropro.promocion_especial	SET nombre=$2, descripcion=$3, '
        +'tipo=$4, definicion=$5, precio=$6, activa=$7, img_url=$8 WHERE id_promocion=$1 RETURNING *',
        [idPromocion,nombre,descripcion,tipo,definicion,precio,activa, imgURL],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se actualizó promocion_especial: ' + results.rows[0].id_promocion + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const eliminaRegistroRelacionOrillaSucursal = (req, res) => {
    const idPromocion = req.params.idPromocion;
    console.log('Entré a eliminiaPromocionEspecial');
    console.log('idPromocion='+idPromocion);
    pool.query(
        'DELETE FROM preesppropro.promocion_especial WHERE id_promocion=$1',        
        [idPromocion],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se eliminó ' + results.rowCount + ' promocion_especial: ' + idPromocion + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

module.exports = {
    getListaRelacionOrillaSucursal,
    getRegistroRelacionOrillaSucursal,
    insertaRegistroRelacionOrillaSucursal,
    actualizaRegistroRelacionOrillaSucursal,
    eliminaRegistroRelacionOrillaSucursal,
}