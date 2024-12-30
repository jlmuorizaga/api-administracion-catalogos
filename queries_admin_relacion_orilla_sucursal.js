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

const getListadoOrillasNoEstanEnROS = (request, response) => {
  const idSucursal = request.params.idSucursal;
  console.log("idSucursal=", idSucursal);
  pool.query(
    'SELECT o.id AS "idOrilla", o.descripcion AS "descripcionOrilla",'
	+'o.id_tamanio AS "idTamanio",tp.nombre AS "nombreTamanio" '
	+'FROM preesppropro.orilla AS o '
	+'INNER JOIN preesppropro.tamanio_pizza AS tp ON tp.id = o.id_tamanio '
	+'LEFT JOIN preesppropro.relacion_orilla_sucursal AS ros '
    +'ON ros.id_orilla = o.id AND ros.id_sucursal = $1 '
	+'WHERE ros.id_orilla IS NULL '
	+'ORDER BY o.descripcion,tp.nombre',
    [idSucursal],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};


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
    const { idOrilla, idSucursal,precio } = req.body;
    pool.query(
        'INSERT INTO preesppropro.relacion_orilla_sucursal(id_orilla, id_sucursal, precio)VALUES ($1, $2, $3) RETURNING *',
        [idOrilla, idSucursal,precio],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó nuevo registro relacion orilla sucursal: ' + results.rows[0].id_orilla + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const actualizaRegistroRelacionOrillaSucursal= (req, res) => {
    const idOrilla = req.params.idOrilla;
    const idSucursal = req.params.idSucursal;
    const {precio} = req.body;
    pool.query(
        'UPDATE preesppropro.relacion_orilla_sucursal SET precio=$3 WHERE id_orilla=$1 and id_sucursal=$2 RETURNING *',
        [idOrilla,idSucursal,precio],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se actualizó relacion orilla sucursal: ' + results.rows[0].id_orilla + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const eliminaRegistroRelacionOrillaSucursal = (req, res) => {
    const idOrilla = req.params.idOrilla;
    const idSucursal = req.params.idSucursal;
    console.log('Entré a eliminaRegistroRelacionOrillaSucursal');
    console.log('idOrilla='+idOrilla);
    console.log('idSucursal='+idSucursal);
    pool.query(
        'DELETE FROM preesppropro.relacion_orilla_sucursal WHERE id_orilla=$1 and id_sucursal=$2',
        [idOrilla,idSucursal],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se eliminó ' + results.rows[0].idOrilla + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

module.exports = {
    getListaRelacionOrillaSucursal,
    getRegistroRelacionOrillaSucursal,
    getListadoOrillasNoEstanEnROS,
    insertaRegistroRelacionOrillaSucursal,
    actualizaRegistroRelacionOrillaSucursal,
    eliminaRegistroRelacionOrillaSucursal,
}