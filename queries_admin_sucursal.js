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


const getListaSucursales = (request, response) => {
    pool.query(
        'SELECT s.id as "idSucursal", clave as "claveSucursal", nombre_sucursal as "nombreSucursal", rfc, domicilio, telefono, hora_inicio as "horaInicio",' 
        +'hora_fin as "horaFin", s.latitud, s.longitud, id_region as "idRegion", r.nombre as "nombreRegion",venta_activa as "ventaActiva", pk, sk,' 
        +'monto_minimo_entrega_sucursal as "montoMinimoEntregaSucursal", monto_minimo_entrega_domicilio as "montoMinimoEntregaDomicilio" '
        +'FROM preesppropro.sucursal as s '
        +'INNER JOIN preesppropro.region as r ON r.id=s.id_region '
        +'ORDER BY clave',

            (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}
const getSucursal= (request, response) => {
    const idSucursal = request.params.idSucursal;
    pool.query(        
        'SELECT s.id as "idSucursal", clave as "claveSucursal", nombre_sucursal as "nombreSucursal", rfc, domicilio, telefono, hora_inicio as "horaInicio",'
        +'hora_fin as "horaFin", s.latitud, s.longitud, id_region as "idRegion", r.nombre as "nombreRegion",venta_activa as "ventaActiva", pk, sk,'
        +'monto_minimo_entrega_sucursal as "montoMinimoEntregaSucursal", monto_minimo_entrega_domicilio as "montoMinimoEntregaDomicilio" ' 
        +'FROM preesppropro.sucursal as s '
        +'INNER JOIN preesppropro.region as r ON r.id=s.id_region '
        +'WHERE s.id=$1;',
        [idSucursal],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows[0]);
        }
    );
}
const insertaSucursal = (req, res) => {
    const { idSucursal, claveSucursal,nombreSucursal,rfc,domicilio,telefono,horaInicio,horaFin,latitud,longitud,idRegion,ventaActiva,pk,sk,
        montoMinimoEntregaSucursal,montoMinimoEntregaDomicilio} = req.body;
    pool.query(
        'INSERT INTO preesppropro.sucursal(id, clave, nombre_sucursal, rfc, domicilio, telefono, hora_inicio, hora_fin, '
        +'latitud, longitud, id_region, venta_activa, pk, sk, monto_minimo_entrega_sucursal, monto_minimo_entrega_domicilio) '
        +'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *',
        
        [idSucursal, claveSucursal,nombreSucursal,rfc,domicilio,telefono,horaInicio,horaFin,latitud,longitud,idRegion,ventaActiva,pk,sk,
            montoMinimoEntregaSucursal,montoMinimoEntregaDomicilio],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó nueva sucursal: ' + results.rows[0].clave + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const actualizaSucursal= (req, res) => {
    const idSucursal = req.params.idSucursal;
    const {claveSucursal,nombreSucursal,rfc,domicilio,telefono,horaInicio,horaFin,latitud,longitud,idRegion,ventaActiva,pk,sk,
        montoMinimoEntregaSucursal,montoMinimoEntregaDomicilio} = req.body;
        console.log('idSucursal='+idSucursal);
        console.log('nombreSucursal='+nombreSucursal);
        console.log('rfc='+rfc);
        console.log('domicilio='+domicilio);
        console.log('telefono='+telefono);
        console.log('claveSucursal=',claveSucursal);

        console.log('mmed='+montoMinimoEntregaDomicilio);
    pool.query(
        'UPDATE preesppropro.sucursal SET clave=$2, nombre_sucursal=$3, rfc=$4, domicilio=$5, telefono=$6, hora_inicio=$7, hora_fin=$8, '
        +'latitud=$9, longitud=$10, id_region=$11, venta_activa=$12, pk=$13, sk=$14, monto_minimo_entrega_sucursal=$15, monto_minimo_entrega_domicilio=$16 '
        +'WHERE id=$1 RETURNING *',
        [idSucursal,claveSucursal,nombreSucursal,rfc,domicilio,telefono,horaInicio,horaFin,latitud,longitud,idRegion,ventaActiva,pk,sk,
            montoMinimoEntregaSucursal,montoMinimoEntregaDomicilio],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se actualizó sucursal: ' + results.rows[0]+ '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const eliminaSucursal = (req, res) => {
    const idSucursal = req.params.idSucursal;
    pool.query(
        'DELETE FROM preesppropro.sucursal WHERE id=$1 ',
        [idSucursal],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se eliminó ' + results.rowCount + ' sucursal: ' + idSucursal + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

module.exports = {
    getListaSucursales,
    getSucursal,
    insertaSucursal,
    actualizaSucursal,
    eliminaSucursal
}