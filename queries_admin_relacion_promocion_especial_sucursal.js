const Pool = require("pg").Pool;

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
} = require("./conexion_data_db.js");

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

const getListaRelacionPromocionesEspecialesSucursal = (request, response) => {
  const idSucursal = request.params.idSucursal;
  pool.query(
    'SELECT r.id_promocion as "idPromocion" ,pe.nombre as "nombre",pe.descripcion as "descripcion",r.id_sucursal as "idSucursal",s.clave as "claveSucursal",' +
      's.nombre_sucursal as "nombreSucursal",r.activa as "activa" FROM preesppropro.relacion_promocion_especial_sucursal as r,preesppropro.sucursal as s,' +
      "preesppropro.promocion_especial as pe WHERE s.id=r.id_sucursal AND pe.id_promocion=r.id_promocion AND s.id=$1 " +
      "ORDER BY nombre ASC, id_sucursal ASC ",
    [idSucursal],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
const getRelacionPromocionEspecialSucursal = (request, response) => {
  const idPromocion = request.params.idPromocion;
  const idSucursal = request.params.idSucursal;
  pool.query(
    'SELECT r.id_promocion as "idPromocion" ,pe.nombre as "nombre",pe.descripcion as "descripcion",r.id_sucursal as "idSucursal",s.clave as "claveSucursal",' +
      's.nombre_sucursal as "nombreSucursal",r.activa as "activa" FROM preesppropro.relacion_promocion_especial_sucursal as r,preesppropro.sucursal as s,' +
      "preesppropro.promocion_especial as pe WHERE s.id=r.id_sucursal AND pe.id_promocion=r.id_promocion AND s.id=$2 " +
      "AND r.id_promocion=$1 " +c
      [idPromocion, idSucursal],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows[0]);
    }
  );
};
const insertaRelacionPromocionEspecialSucursal = (req, res) => {
  const { idPromocion, idSucursal, activa } = req.body;
  console.log("idPromocion=", idPromocion);
  console.log("idSucursal=", idSucursal);
  console.log("activa=", activa);
  pool.query(
    "INSERT INTO preesppropro.relacion_promocion_especial_sucursal (id_promocion, id_sucursal, activa) VALUES ($1, $2, $3) RETURNING *;",
    [idPromocion, idSucursal, activa],
    (error, results) => {
      if (error) {
        throw error;
      }
      textoRespuesta =
        '{"respuesta": "Se insertó nueva promoción especial en sucursal: ' +
        results.rows[0].id_promocion +
        '"}';
      res.status(201).json(JSON.parse(textoRespuesta));
    }
  );
};

const actualizaRelacionPromocionEspecialSucursal = (req, res) => {
  const idPromocion = request.params.idPromocion;
  const idSucursal = request.params.idSucursal;
  const { activa } = req.body;
  pool.query(
    "UPDATE preesppropro.relacion_promocion_especial_sucursal SET  activa=$3 WHERE id_promocion=$1 and id_sucursal=$2 RETURNING *;"[
      (idPromocion, idSucursal, activa)
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      textoRespuesta =
        '{"respuesta": "Se actualizó promoción especial en sucursal: ' +
        results.rows[0].id_promocion +
        '"}';
      res.status(201).json(JSON.parse(textoRespuesta));
    }
  );
};

const eliminaRelacionPromocionEspecialSucursal = (req, res) => {
  const idPromocion = req.params.idPromocion;
  const idSucursal = req.params.idSucursal;
  console.log("idPromocion=", idPromocion);
  console.log("idSucursal=", idSucursal);
  pool.query(
    "DELETE FROM preesppropro.relacion_promocion_especial_sucursal WHERE id_promocion=$1 and id_sucursal=$2",
    [idPromocion, idSucursal],
    (error, results) => {
      if (error) {
        throw error;
      }
      textoRespuesta =
        '{"respuesta": "Se eliminó ' +
        results.rowCount +
        " relacion_promocion_especial_sucursal: " +
        idPromocion +
        '"}';
      res.status(201).json(JSON.parse(textoRespuesta));
    }
  );
};

module.exports = {
  getListaRelacionPromocionesEspecialesSucursal,
  getRelacionPromocionEspecialSucursal,
  insertaRelacionPromocionEspecialSucursal,
  actualizaRelacionPromocionEspecialSucursal,
  eliminaRelacionPromocionEspecialSucursal,
};
