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


const getListaOrillas = (request, response) => {
    pool.query(
        'SELECT o.id as "id", o.descripcion as "descripcion", o.id_tamanio as "idTamanio", '
	    +'tp.nombre as "nombre",tp.orden as "orden" FROM preesppropro.orilla as o INNER JOIN preesppropro.tamanio_pizza as tp '
	    +'ON tp.id=o.id_tamanio',
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}
const getOrilla= (request, response) => {
    const id = request.params.id;
    pool.query(
        'SELECT id, nombre FROM preesppropro.ingrediente WHERE id=$1 ORDER BY nombre',
        [id],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows[0]);
        }
    );
}
const insertaOrilla = (req, res) => {
    const { id, nombre } = req.body;
    pool.query(
        'INSERT INTO preesppropro.ingrediente(id, nombre) '
        +'VALUES ($1, $2) RETURNING *',
        [id,nombre],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó nuevo ingrediente: ' + results.rows[0].id+ '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const actualizaIngrediente= (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;
    console.log('nombre===>',nombre)
    pool.query(
        'UPDATE preesppropro.ingrediente SET nombre=$2 WHERE id=$1 RETURNING *',
        [id,nombre],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se actualizó ingrediente: ' + results.rows[0].id + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const eliminaOrilla = (req, res) => {
    const id = req.params.id;
    pool.query(
        'DELETE FROM preesppropro.ingrediente WHERE id=$1',
        [id],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se eliminó ' + results.rowCount + ' ingrediente: ' + id + '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

module.exports = {
    getListaOrillas,
    getOrilla,
    insertaOrilla,
    actualizaOrilla,
    eliminaOrilla
}