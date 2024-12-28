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
        'SELECT id, descripcion, id_tamanio as "idTamanio" FROM preesppropro.orilla WHERE id=$1',
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
    const { id, descripcion,idTamanio } = req.body;
    pool.query(
        'INSERT INTO preesppropro.orilla(id, descripcion,id_tamanio) '
        +'VALUES ($1, $2, $3) RETURNING *',
        [id,descripcion,idTamanio],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó nuevo ingrediente: ' + results.rows[0].id+ '"}';
            res.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const actualizaOrilla= (req, res) => {
    const id = req.params.id;
    const { descripcion,idTamanio } = req.body;
    pool.query(
        'UPDATE preesppropro.orilla SET descripcion=$2,id_tamanio=$3 WHERE id=$1 RETURNING *',
        [id,descripcion,idTamanio],
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
        'DELETE FROM preesppropro.orilla WHERE id=$1',
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