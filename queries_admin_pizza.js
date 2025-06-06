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

/*
const getListaPizzas = (request, response) => {
    pool.query(
        'SELECT p.id as "idPizza", p.id_especialidad as "idEspecialidad", ep.nombre as "nombre",ep.ingredientes as "ingredientes",'
        +'ep.img_url as "imgURL", ep.orden as "orden", p.id_tamanio as "idTamanio", tp.nombre as "tamanioPizza",'
        +'p.aplica_2x1 as "aplica2x1", p.categoria1, p.categoria2, p.categoria3 FROM preesppropro.pizza as p '
        +'INNER JOIN preesppropro.especialidad_pizza as ep ON p.id_especialidad=ep.id '
        +'INNER JOIN preesppropro.tamanio_pizza as tp ON p.id_tamanio=tp.id '
        +'ORDER BY nombre,"tamanioPizza"',
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}
*/


const getListaPizzas = (request, response) => {
  pool.query(
    'SELECT p.id as "idPizza", p.id_especialidad as "idEspecialidad", ep.nombre as "nombreEspecialidad",' +
      'p.id_tamanio as "idTamanioPizza", tp.nombre as "tamanioPizza",' +
      'p.aplica_2x1 as "aplica2x1", p.categoria1, p.categoria2, p.categoria3 FROM preesppropro.pizza as p ' +
      "INNER JOIN preesppropro.especialidad_pizza as ep ON p.id_especialidad=ep.id " +
      "INNER JOIN preesppropro.tamanio_pizza as tp ON p.id_tamanio=tp.id " +
      'ORDER BY "nombreEspecialidad","tamanioPizza"',
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
const getPizza = (request, response) => {
  const idPizza = request.params.idPizza;
  console.log("idPizza=", idPizza);
  pool.query(
    'SELECT p.id as "idPizza", p.id_especialidad as "idEspecialidad", ep.nombre as "nombreEspecialidad",' +
      'p.id_tamanio as "idTamanioPizza", tp.nombre as "tamanioPizza",' +
      'p.aplica_2x1 as "aplica2x1", p.categoria1, p.categoria2, p.categoria3 FROM preesppropro.pizza as p ' +
      "INNER JOIN preesppropro.especialidad_pizza as ep ON p.id_especialidad=ep.id " +
      "INNER JOIN preesppropro.tamanio_pizza as tp ON p.id_tamanio=tp.id " +
      "WHERE p.id=$1 " +
      'ORDER BY "nombreEspecialidad","tamanioPizza" ',
    [idPizza],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows[0]);
    }
  );
};
const insertaPizza = (req, res) => {
  const {
    idPizza,
    idEspecialidad,
    idTamanioPizza,
    aplica2x1,
    categoria1,
    categoria2,
    categoria3,
  } = req.body;
  pool.query(
    "INSERT INTO preesppropro.pizza(id, id_especialidad, id_tamanio," +
      "aplica_2x1, categoria1, categoria2, categoria3) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
    [
      idPizza,
      idEspecialidad,
      idTamanioPizza,
      aplica2x1,
      categoria1,
      categoria2,
      categoria3,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      textoRespuesta =
        '{"respuesta": "Se insertó nueva pizza: ' + results.rows[0].id + '"}';
      res.status(201).json(JSON.parse(textoRespuesta));
    }
  );
};

const actualizaPizza = (req, res) => {
  const idPizza = req.params.idPizza;
  const {
    idEspecialidad,
    idTamanioPizza,
    aplica2x1,
    categoria1,
    categoria2,
    categoria3,
  } = req.body;
  pool.query(
    "UPDATE preesppropro.pizza SET id_especialidad=$2, id_tamanio=$3, aplica_2x1=$4, categoria1=$5, " +
      "categoria2=$6, categoria3=$7 WHERE id=$1 RETURNING *",
    [
      idPizza,
      idEspecialidad,
      idTamanioPizza,
      aplica2x1,
      categoria1,
      categoria2,
      categoria3,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      textoRespuesta =
        '{"respuesta": "Se actualizó la pizza: ' + results.rows[0].id + '"}';
      res.status(201).json(JSON.parse(textoRespuesta));
    }
  );
};

const eliminaPizza = (req, res) => {
  const idPizza = req.params.idPizza;
  console.log("idPizza=", idPizza);
  pool.query(
    "DELETE FROM preesppropro.pizza WHERE id=$1;",
    [idPizza],
    (error, results) => {
      if (error) {
        console.error("Error al eliminar la pizza:", error);
        return res.status(500).json({ error: "Error al eliminar la pizza" });
      }
      if (results.rowCount > 0) {
        const textoRespuesta = `{"respuesta": "Se eliminó una pizza con id: ${idPizza}"}`;
        res.status(200).json(JSON.parse(textoRespuesta));
      } else {
        res
          .status(404)
          .json({
            respuesta: "No se encontró una pizza con el ID proporcionado",
          });
      }
    }
  );
};

module.exports = {
  getListaPizzas,
  getPizza,
  insertaPizza,
  actualizaPizza,
  eliminaPizza,
};
