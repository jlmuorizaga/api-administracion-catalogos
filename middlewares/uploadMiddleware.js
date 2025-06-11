const multer = require("multer");
const path = require("path");
const fs = require("fs");

function crearMiddlewareUpload(subcarpeta = "default") {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const rutaDestino = path.join("/var/www/html/img", subcarpeta);
      fs.mkdir(rutaDestino, { recursive: true }, (err) => {
        if (err) {
          console.error("❌ Error creando carpeta destino:", err);
        }
        cb(err, rutaDestino);
      });
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const nombreBase = path
        .basename(file.originalname, ext)
        .replace(/\s+/g, "_");
      cb(null, `${nombreBase}_${timestamp}${ext}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("❌ Solo se permiten imágenes JPEG, PNG o WEBP."));
    }
  };

  return multer({ storage, fileFilter }).single("image");
}

module.exports = crearMiddlewareUpload;
