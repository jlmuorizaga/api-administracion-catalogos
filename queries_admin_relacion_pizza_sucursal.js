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

const getListaRelacionPizzaSucursal = (request, response) => {
  const idSucursal = request.params.idSucursal;
  console.log("idSucursal=", idSucursal);
  pool.query(
    'SELECT rps.id_pizza as "idPizza", ep.nombre as "nombreEspecialidad", tp.nombre as "tamanioPizza",rps.id_sucursal as "idSucursal", ' +
      's.clave as "claveSucursal",rps.precio_x2 as "precioX2", rps.precio_x1 as "precioX1" ' +
      "FROM preesppropro.relacion_pizza_sucursal AS rps " +
      "INNER JOIN preesppropro.pizza as p ON rps.id_pizza=p.id " +
      "INNER JOIN preesppropro.especialidad_pizza AS ep ON ep.id=p.id_especialidad " +
      "INNER JOIN preesppropro.tamanio_pizza AS tp ON tp.id=p.id_tamanio " +
      "INNER JOIN preesppropro.sucursal AS s ON s.id=rps.id_sucursal " +
      "AND s.id=$1 " +
      //+'AND s.id='0192a635-2d12-7821-90d3-1f4ccff4c8d8'
      "ORDER BY ep.nombre,tp.nombre",
    [idSucursal],
    (error, results) => {
      if (error) {
        throw error;
      }
      results.rows.forEach((element) => {
        element.precioX2 = Number(element.precioX2);
      });
      results.rows.forEach((element) => {
        element.precioX1 = Number(element.precioX1);
      });
      response.status(200).json(results.rows);
    }
    
  );
};

const getListadoPizzasNoEstanEnRPS = (request, response) => {
  const idSucursal = request.params.idSucursal;
  console.log("idSucursal=", idSucursal);
  pool.query(
    'SELECT p.id AS "idPizza",' +
      'p.id_especialidad AS "idEspecialidad",' +
      'ep.nombre AS "nombreEspecialidad",' +
      'p.id_tamanio AS "idTamanio",' +
      'tp.nombre AS "nombreTamanio" ' +
      "FROM preesppropro.pizza AS p " +
      "INNER JOIN preesppropro.especialidad_pizza AS ep ON ep.id = p.id_especialidad " +
      "INNER JOIN preesppropro.tamanio_pizza AS tp ON tp.id = p.id_tamanio " +
      "LEFT JOIN preesppropro.relacion_pizza_sucursal AS rps " +
      "ON rps.id_pizza = p.id AND rps.id_sucursal = $1 " +
      "WHERE rps.id_pizza IS NULL " +
      "ORDER BY ep.nombre, tp.nombre;",
    [idSucursal],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getRegistroRelacionOrillaSucursal = (request, response) => {
  const idPromocion = request.params.idPromocion;
  pool.query(
    'SELECT id_promocion as "idPromocion", nombre, descripcion, tipo, definicion, precio, activa, img_url as "imgURL" ' +
      "FROM preesppropro.promocion_especial WHERE id_promocion=$1 ORDER BY nombre",
    [idPromocion],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows[0]);
    }
  );
};

const insertaRegistroRelacionPizzaSucursal = (req, res) => {
  const { idPizza, idSucursal, precioX2, precioX1 } = req.body;
  pool.query(
    "INSERT INTO preesppropro.relacion_pizza_sucursal(" +
      "id_pizza, id_sucursal, precio_x2, precio_x1) " +
      "VALUES ($1, $2, $3, $4) RETURNING *",
    [idPizza, idSucursal, precioX2, precioX1],
    (error, results) => {
      if (error) {
        throw error;
      }
      textoRespuesta =
        '{"respuesta": "Se insertó nuevo registro relacion orilla sucursal: ' +
        results.rows[0].id_orilla +
        '"}';
      res.status(201).json(JSON.parse(textoRespuesta));
    }
  );
};

const actualizaRegistroRelacionOrillaSucursal = (req, res) => {
  const idOrilla = req.params.idOrilla;
  const idSucursal = req.params.idSucursal;
  const { precio } = req.body;
  pool.query(
    "UPDATE preesppropro.relacion_orilla_sucursal SET precio=$3 WHERE id_orilla=$1 and id_sucursal=$2 RETURNING *",
    [idOrilla, idSucursal, precio],
    (error, results) => {
      if (error) {
        throw error;
      }
      textoRespuesta =
        '{"respuesta": "Se actualizó relacion orilla sucursal: ' +
        results.rows[0].id_orilla +
        '"}';
      res.status(201).json(JSON.parse(textoRespuesta));
    }
  );
};

const eliminaRegistroRelacionPizzaSucursal = (req, res) => {
  const idPizza = req.params.idPizza;
  const idSucursal = req.params.idSucursal;
  console.log("Entré a eliminaRegistroRelacionPizzaSucursal");
  console.log("idPizza=" + idPizza);
  console.log("idSucursal=" + idSucursal);
  pool.query(
    "DELETE FROM preesppropro.relacion_pizza_sucursal WHERE id_pizza=$1 and id_sucursal=$2",
    [idPizza, idSucursal],
    (error, results) => {
      if (error) {
        throw error;
      }
      textoRespuesta =
        '{"respuesta": "Se eliminó ' + results.rows[0] + '"}';
      res.status(201).json(JSON.parse(textoRespuesta));
    }
  );
};

module.exports = {
  getListaRelacionPizzaSucursal,
  getListadoPizzasNoEstanEnRPS,
  getRegistroRelacionOrillaSucursal,
  insertaRegistroRelacionPizzaSucursal,
  actualizaRegistroRelacionOrillaSucursal,
  eliminaRegistroRelacionPizzaSucursal,
};
