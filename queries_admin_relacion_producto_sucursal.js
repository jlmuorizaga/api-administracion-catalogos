const Pool = require("pg").Pool;
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  URL_SERVER,
  ENABLE_SSL,
} = require("./conexion_data_db.js");

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

const getListaRelacionProductoSucursal = (request, response) => {
  const idSucursal = request.params.idSucursal;
  console.log("idSucursal=", idSucursal);
  pool.query(
    'SELECT rps.id_producto as "idProducto", p.descripcion, p.tamanio,tp.nombre as "tipoProductoNombre",' +
      'id_sucursal as "idSucursal", s.clave as "claveSucursal", rps.precio ' +
      "FROM preesppropro.relacion_producto_sucursal as rps" +
      " INNER JOIN preesppropro.producto AS p ON p.id=rps.id_producto" +
      " INNER JOIN preesppropro.producto_tipo AS tp ON tp.id=p.id_tipo_producto" +
      " INNER JOIN preesppropro.sucursal AS s ON s.id=rps.id_sucursal " +
      //--AND s.id='0192a635-0b52-70f9-add2-75b610e99021'
      //+' AND s.id='0192a635-2d12-7821-90d3-1f4ccff4c8d8'
      " AND s.id=$1 " +
      " ORDER BY  p.descripcion,p.tamanio",
    [idSucursal],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

const getRegistroRelacionProductoSucursal = (request, response) => {
  const idProducto = request.params.idProducto;
  const idSucursal = request.params.idSucursal;

  pool.query(
    'SELECT p.id as "idProducto", p.descripcion as "descripcionProducto", '
      + 'p.tamanio as "tamanioProducto", p.usa_salsa as "usaSalsa", '
      + 'p.id_tipo_producto as "idTipoProducto", p.ruta_imagen as "rutaImagen", '
      + 'p.categoria1 as "categoria1", p.categoria2 as "categoria2", p.categoria3 as "categoria3", '
      + 'p.aplica_bebida_gratis as "aplicaBebidaGratis", '
      + 'rps.id_sucursal as "idSucursal", s.clave as "claveSucursal", '
      + 'rps.precio as "precio" '
      + 'FROM preesppropro.relacion_producto_sucursal as rps '
      + 'INNER JOIN preesppropro.producto as p ON p.id = rps.id_producto '
      + 'INNER JOIN preesppropro.sucursal as s ON s.id = rps.id_sucursal '
      + 'WHERE rps.id_producto=$1 AND rps.id_sucursal=$2',
    [idProducto, idSucursal],
    (error, results) => {
      if (error) {
        throw error;
      }

      // Si no existe la relación, responde 404 en vez de undefined
      if (!results.rows.length) {
        return response.status(404).json({
          respuesta: "No existe la relación producto-sucursal con esos ids"
        });
      }

      response.status(200).json(results.rows[0]);
    }
  );
};
const getListadoProductosNoEstanEnRPS = (request, response) => {
  const idSucursal = request.params.idSucursal;
  console.log("idSucursal=", idSucursal);
  pool.query(
    'SELECT p.id AS "idProducto",' +
      'p.descripcion AS "descripcion",' +
      'p.tamanio AS "tamanio",' +
      'tp.descripcion AS "descripcionTamanio" ' +
      "FROM preesppropro.producto AS p " +
      "INNER JOIN preesppropro.producto_tipo AS tp ON tp.id = p.id_tipo_producto " +
      "LEFT JOIN preesppropro.relacion_producto_sucursal AS rps " +
      "ON rps.id_producto = p.id AND rps.id_sucursal =$1 " +
      "WHERE rps.id_producto IS NULL " +
      "ORDER BY p.descripcion, p.tamanio;",
    [idSucursal],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

const insertaRegistroRelacionProductoSucursal = (req, res) => {
  const { idProducto, idSucursal, precio } = req.body;
  pool.query(
    "INSERT INTO preesppropro.relacion_producto_sucursal(id_producto, id_sucursal, precio) VALUES ($1, $2, $3) RETURNING *",
    [idProducto, idSucursal, precio],
    (error, results) => {
      if (error) {
        throw error;
      }
      textoRespuesta =
        '{"respuesta": "Se insertó nuevo registro relacion producto sucursal: ' +
        results.rows[0].id_producto +
        '"}';
      res.status(201).json(JSON.parse(textoRespuesta));
    },
  );
};

const actualizaRegistroRelacionProductoSucursal = (req, res) => {
  const idProducto = req.params.idProducto;
  const idSucursal = req.params.idSucursal;
  const { precio } = req.body;
  pool.query(
    "UPDATE preesppropro.relacion_producto_sucursal SET precio=$3 WHERE id_producto=$1 and id_sucursal=$2 RETURNING *",
    [idProducto, idSucursal, precio],
    (error, results) => {
      if (error) {
        throw error;
      }
      textoRespuesta =
        '{"respuesta": "Se actualizó relacion producto sucursal: ' +
        results.rows[0].id_producto +
        '"}';
      res.status(201).json(JSON.parse(textoRespuesta));
    },
  );
};

const eliminaRegistroRelacionProductoSucursal = (req, res) => {
  const idProducto = req.params.idProducto;
  const idSucursal = req.params.idSucursal;
  console.log("Entré a eliminaRegistroRelacionProductoSucursal");
  console.log("idProducto=" + idProducto);
  console.log("idSucursal=" + idSucursal);
  pool.query(
    "DELETE FROM preesppropro.relacion_producto_sucursal WHERE id_producto=$1 and id_sucursal=$2",
    [idProducto, idSucursal],
    (error, results) => {
      if (error) {
        throw error;
      }
      textoRespuesta = '{"respuesta": "Se eliminó ' + results.rows[0] + '"}';
      res.status(201).json(JSON.parse(textoRespuesta));
    },
  );
};

module.exports = {
  getListaRelacionProductoSucursal,
  getRegistroRelacionProductoSucursal,
  getListadoProductosNoEstanEnRPS,
  insertaRegistroRelacionProductoSucursal,
  actualizaRegistroRelacionProductoSucursal,
  eliminaRegistroRelacionProductoSucursal,
};
