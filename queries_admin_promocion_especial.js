const Pool = require('pg').Pool;

const {DB_HOST,DB_USER,DB_PASSWORD,DB_NAME,DB_PORT} = require('./conexion_data_db.js')


//Pool de conexiones a base de datos
const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
  /* ssl: {
        rejectUnauthorized: false,
    },*/

});


const getListaPromocionesEspeciales = (request, response) => {
    pool.query(
        'SELECT id_promocion as "idPromocion", nombre, descripcion, tipo, definicion, precio, activa '
        +'FROM preesppropro.promocion_especial',
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}

const getListaPromocionesEspecialesQueNoEstanEnRelacionPromocionEspecialSucursal= (request, response) => {
    const idSucursal = request.params.idSucursal;
    pool.query(
        ' SELECT pe.id_promocion as "idPromocion", pe.nombre, pe.descripcion, pe.tipo, pe.definicion, pe.precio, pe.activa '
        +'FROM preesppropro.promocion_especial as pe WHERE (pe.id_promocion not in(SELECT id_promocion as "idPromocion" '
        +'FROM preesppropro.relacion_promocion_especial_sucursal where id_sucursal=$1)) AND activa=\'S\' order by pe.nombre asc ',
        [idSucursal],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }        
    );
}

const getPromocionEspecial= (request, response) => {
    const idPromocion = request.params.idPromocion;
    pool.query(
        'SELECT id_promocion as "idPromocion", nombre, descripcion, tipo, definicion, precio, activa '
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
const insertaPromocionEspecial = (req, res) => {
    const { idPromocion, nombre,descripcion,tipo,definicion,precio,activa } = req.body;
    pool.query(
        'INSERT INTO preesppropro.promocion_especial(id_promocion, nombre, descripcion,'
        +'tipo, definicion, precio, activa) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [idPromocion, nombre,descripcion,tipo,definicion,precio,activa],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó nueva promocion_especial: ' + results.rows[0].id_promocion + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const actualizaPromocionEspecial= (req, res) => {
    const idPromocion = req.params.idPromocion;
    const { nombre,descripcion,tipo,definicion,precio,activa } = req.body;
    console.log('Estoy en ActualizaPromocionEspecial');
    console.log('idPromocion=',idPromocion);
    pool.query(
        'UPDATE preesppropro.promocion_especial	SET nombre=$2, descripcion=$3, '
        +'tipo=$4, definicion=$5, precio=$6, activa=$7 WHERE id_promocion=$1 RETURNING *',
        [idPromocion,nombre,descripcion,tipo,definicion,precio,activa],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se actualizó promocion_especial: ' + results.rows[0].id_promocion + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const eliminaPromocionEspecial = (req, res) => {
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
    getListaPromocionesEspeciales,
    getPromocionEspecial,
    insertaPromocionEspecial,
    actualizaPromocionEspecial,
    eliminaPromocionEspecial,
    getListaPromocionesEspecialesQueNoEstanEnRelacionPromocionEspecialSucursal
}