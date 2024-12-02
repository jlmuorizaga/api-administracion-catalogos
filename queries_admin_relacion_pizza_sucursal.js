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


const getListaRelacionPizzaSucursal = (request, response) => {
    const idSucursal = request.params.idSucursal;
    console.log('idSucursal=',idSucursal)
    pool.query(
        'SELECT rps.id_pizza as "idPizza", ep.nombre as "nombreEspecialidad", tp.nombre as "tamanioPizza",rps.id_sucursal as "idSucursal", '
+'s.clave as "claveSucursal",rps.precio_x2 as "precioX2", rps.precio_x1 as "precioX1" '
+'FROM preesppropro.relacion_pizza_sucursal AS rps '
+'INNER JOIN preesppropro.pizza as p ON rps.id_pizza=p.id '
+'INNER JOIN preesppropro.especialidad_pizza AS ep ON ep.id=p.id_especialidad '
+'INNER JOIN preesppropro.tamanio_pizza AS tp ON tp.id=p.id_tamanio '
+'INNER JOIN preesppropro.sucursal AS s ON s.id=rps.id_sucursal '
+'AND s.id=$1 '
//+'AND s.id='0192a635-2d12-7821-90d3-1f4ccff4c8d8'
+'ORDER BY ep.nombre,tp.nombre',
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
    getListaRelacionPizzaSucursal,
    getRegistroRelacionOrillaSucursal,
    insertaRegistroRelacionOrillaSucursal,
    actualizaRegistroRelacionOrillaSucursal,
    eliminaRegistroRelacionOrillaSucursal,
}