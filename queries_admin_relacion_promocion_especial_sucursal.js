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
    const claveSucursal = request.params.claveSucursal;
  pool.query(
    'SELECT r.id_promocion as "idPromocion" ,pe.nombre as "nombre",pe.descripcion as "descripcion",r.id_sucursal as "idSucursal",s.clave as "claveSucursal",' +
      's.nombre_sucursal as "nombreSucursal",r.activa as "activa" FROM preesppropro.relacion_promocion_especial_sucursal as r,preesppropro.sucursal as s,' +
      'preesppropro.promocion_especial as pe WHERE s.id=r.id_sucursal AND pe.id_promocion=r.id_promocion AND s.clave=$1 ' +
      'ORDER BY nombre ASC, id_sucursal ASC ',
      [claveSucursal],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
const getRelacionPromocionEspecialSucursal = (request, response) => {
  const id = request.params.id;
  pool.query(
    "SELECT id, descripcion FROM preesppropro.salsa WHERE id=$1 ORDER BY descripcion",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows[0]);
    }
  );
};
const insertaRelacionPromocionEspecialSucursal = (req, res) => {
  const { id, descripcion } = req.body;
  pool.query(
    "INSERT INTO preesppropro.salsa(id, descripcion) " +
      "VALUES ($1, $2) RETURNING *",
    [id, descripcion],
    (error, results) => {
      if (error) {
        throw error;
      }
      textoRespuesta =
        '{"respuesta": "Se insertó nueva salsa: ' + results.rows[0].id + '"}';
      res.status(201).json(JSON.parse(textoRespuesta));
    }
  );
};

const actualizaRelacionPromocionEspecialSucursal = (req, res) => {
  const id = req.params.id;
  const { descripcion } = req.body;
  pool.query(
    "UPDATE preesppropro.salsa SET descripcion=$1 WHERE id=$2 RETURNING *",
    [descripcion, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      textoRespuesta =
        '{"respuesta": "Se actualizó salsa: ' + results.rows[0].id + '"}';
      res.status(201).json(JSON.parse(textoRespuesta));
    }
  );
};

const eliminaRelacionPromocionEspecialSucursal = (req, res) => {
  const id = req.params.id;
  pool.query(
    "DELETE FROM preesppropro.salsa WHERE id=$1 ",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      textoRespuesta =
        '{"respuesta": "Se eliminó ' +
        results.rowCount +
        " salsa: " +
        id +
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
