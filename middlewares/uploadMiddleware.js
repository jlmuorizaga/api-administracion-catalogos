const multer = require('multer');
const path = require('path');
const fs = require('fs');

function crearUploadHandler(subcarpeta = 'default') {
  return (req, res, next) => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const rutaDestino = path.join('/var/www/html/img', subcarpeta);
        fs.mkdir(rutaDestino, { recursive: true }, (err) => {
          if (err) {
            console.error('❌ Error creando carpeta:', err);
          }
          cb(err, rutaDestino);
        });
      },
      filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const nombreBase = path.basename(file.originalname, ext).replace(/\s+/g, '_');
        cb(null, `${nombreBase}_${timestamp}${ext}`);
      }
    });

    const fileFilter = (req, file, cb) => {
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('❌ Solo se permiten imágenes JPEG, PNG o WEBP.'));
      }
    };

    const upload = multer({ storage, fileFilter }).single('image');

    upload(req, res, (err) => {
      if (err) {
        console.error('❌ Error al subir imagen:', err.message);
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        console.error('⚠️ No se recibió ningún archivo');
        return res.status(400).json({ error: 'No se recibió ningún archivo' });
      }

      req.uploadInfo = {
        url: `http://ec2-54-144-58-67.compute-1.amazonaws.com/img/${subcarpeta}/${req.file.filename}`
      };

      next(); // continúa al manejador final
    });
  };
}

module.exports = crearUploadHandler;
