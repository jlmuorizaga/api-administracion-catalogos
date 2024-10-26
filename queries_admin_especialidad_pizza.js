const Pool = require('pg').Pool;

const {DB_HOST,DB_USER,DB_PASSWORD,DB_NAME,DB_PORT,URL_SERVER} = require('./conexion_data_db.js')


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


const getListaEspecialidades = (request, response) => {
    pool.query(
        'SELECT id, nombre, ingredientes, img_url, orden '
        +'FROM preesppropro.especialidad_pizza ORDER BY nombre',
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}
const getEspecialidad= (request, response) => {
    const idEspecialidad = request.params.idEspecialidad;
    console.log('idEspecialidad='+idEspecialidad);
    pool.query(
        //'SELECT id as idEspecialidad, nombre as nombreEspecialidad, ingredientes as ingredientesEspecialidad,aplica_2x1 as aplica2x1Especialidad, aplica_p1 as aplicaP1Especialidad FROM preesppropro.especialidad_pizza WHERE id=$1 ORDER by nombre',
        'SELECT id, nombre, ingredientes, img_url, orden FROM preesppropro.especialidad_pizza as ep WHERE id=$1 ORDER by nombre',
         //where id=$1 ORDER by nombre'        
        [idEspecialidad],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows[0]);
        }
    );
}
const insertaEspecialidad = (req, res) => {
    const { id, nombre, ingredientes, img_url } = req.body;
    pool.query(
        'INSERT INTO preesppropro.especialidad_pizza(id, nombre, ingredientes,img_url,orden) '
        +'VALUES ($1, $2, $3, $4) RETURNING *',
        [id,nombre,ingredientes,img_url],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó nueva especialidad: ' + results.rows[0].id + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const actualizaEspecialidad= (req, res) => {
    const idEspecialidad = req.params.idEspecialidad;
    const { nombre,ingredientes,img_url,orden } = req.body;
    pool.query(
        'UPDATE preesppropro.especialidad_pizza SET nombre=$2, ingredientes=$3, img_url=$4, orden=$5 WHERE id=$1 RETURNING *',
        [idEspecialidad,nombre,ingredientes,img_url,orden],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se actualizó especialidad: ' + results.rows[0].id + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const eliminaEspecialidad = (req, res) => {
    const idEspecialidad = req.params.idEspecialidad;
    pool.query(
        'DELETE FROM preesppropro.especialidad_pizza WHERE id=$1 ',
        [idEspecialidad],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se eliminó ' + results.rowCount + ' especialidad: ' + idEspecialidad + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

module.exports = {
    getListaEspecialidades,
    getEspecialidad,
    insertaEspecialidad,
    actualizaEspecialidad,
    eliminaEspecialidad
}