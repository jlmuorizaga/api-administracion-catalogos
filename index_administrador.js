const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const multer = require('multer');
const app = express();
const db_tp = require("./queries_admin_tamanio_pizza");
const db_s = require("./queries_admin_salsa");
const db_c = require("./queries_admin_categoria");
const db_e = require("./queries_admin_especialidad_pizza");
const db_tipos_producto = require("./queries_admin_tipos_producto");
const db_producto = require("./queries_admin_producto");
const db_retps = require("./queries_admin_relacion_especialidad_tamanio_precio_sucursal");
const db_rpps = require("./queries_admin_relacion_producto_precio_sucursal");
const db_rss = require("./queries_admin_relacion_salsa_sucursal");
const db_region = require("./queries_admin_region");
const db_sucursal = require("./queries_admin_sucursal");
const db_ingrediente = require("./queries_admin_ingrediente");
const db_orilla = require("./queries_admin_orilla");
const db_pizza = require("./queries_admin_pizza");
const db_promocion_especial = require("./queries_admin_promocion_especial");
const db_relacion_promocion_especial_sucursal = require("./queries_admin_relacion_promocion_especial_sucursal");
const db_ros = require("./queries_admin_relacion_orilla_sucursal");
const db_rps = require("./queries_admin_relacion_pizza_sucursal");
const db_rprods = require("./queries_admin_relacion_producto_sucursal");
const crearUploadHandler = require('./middlewares/uploadMiddleware');


app.use(cors({
  origin: '*',  // 👈 permite cualquier origen (ideal para pruebas)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Especialidades
app.post('/upload/especialidad', crearUploadHandler('especialidades'), (req, res) => {
  res.status(200).json({ message: 'Imagen subida exitosamente', url: req.uploadInfo.url });
});

// Productos
app.post('/upload/producto', crearUploadHandler('productos'), (req, res) => {
  res.status(200).json({ message: 'Imagen subida exitosamente', url: req.uploadInfo.url });
});

// Promociones
app.post('/upload/promocion', crearUploadHandler('promociones'), (req, res) => {
  res.status(200).json({ message: 'Imagen subida exitosamente', url: req.uploadInfo.url });
});

// Tipos de Producto
app.post('/upload/tipo-producto', crearUploadHandler('menu'), (req, res) => {
  res.status(200).json({ message: 'Imagen subida exitosamente', url: req.uploadInfo.url });
});

//const port = process.env.PORT || 3005;
const port = 3005;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


app.use("/img", express.static("/var/www/html/img"));

app.get("/", (request, response) => {
  response.json([
    {
      info: "API CHPSystem Captura PPP Móviles. Conectado desde servidor AWS CHP Móvil",
    },
    { dameListaPizzas: "/pizzas" },
    { dameListaTamaniosPizza: "/tamanios-pizza" },
    { dameListaCategorias: "/categorias" },
    { dameListaEspecialidades: "/especialidades" },

    { version: "Version 202406072024" },
  ]);
});

//Endpoints para pizzas
app.get("/pizzas", db_pizza.getListaPizzas);
app.get("/pizzas/:idPizza", db_pizza.getPizza);
app.post("/pizzas", db_pizza.insertaPizza);
app.put("/pizzas/:idPizza", db_pizza.actualizaPizza);
app.delete("/pizzas/:idPizza", db_pizza.eliminaPizza);

//Endpoints para orilla
app.get("/orillas", db_orilla.getListaOrillas);
app.get("/orillas/:id", db_orilla.getOrilla);
app.post("/orillas", db_orilla.insertaOrilla);
app.put("/orillas/:id", db_orilla.actualizaOrilla);
app.delete("/orillas/:id", db_orilla.eliminaOrilla);

//Endpoints para ingrediente
app.get("/ingredientes", db_ingrediente.getListaIngredientes);
app.get("/ingredientes/:id", db_ingrediente.getIngrediente);
app.post("/ingredientes", db_ingrediente.insertaIngrediente);
app.put("/ingredientes/:id", db_ingrediente.actualizaIngrediente);
app.delete("/ingredientes/:id", db_ingrediente.eliminaIngrediente);

//Endpoints para categoria
app.get("/categorias", db_c.getListaCategorias);
app.get("/categorias/:codigo", db_c.getCategoria);
app.post("/categorias", db_c.insertaCategoria);
app.put("/categorias/:codigo", db_c.actualizaCategoria);
app.delete("/categorias/:codigo", db_c.eliminaCategoria);

//Endpoints para tamanio_pizza
app.get("/tamanios-pizza", db_tp.getListaTamaniosPizza);
app.get("/tamanios-pizza/:idTamanioPizza", db_tp.getTamanioPizza);
app.post("/tamanios-pizza", db_tp.insertaTamanioPizza);
app.put("/tamanios-pizza/:idTamanioPizza", db_tp.actualizaTamanioPizza);
app.delete("/tamanios-pizza/:idTamanioPizza", db_tp.eliminaTamanioPizza);

//Endpoints para salsa
app.get("/salsas", db_s.getListaSalsas);
app.get("/salsas/:id", db_s.getSalsa);
app.post("/salsas", db_s.insertaSalsa);
app.put("/salsas/:id", db_s.actualizaSalsa);
app.delete("/salsas/:id", db_s.eliminaSalsa);

//Endpoints para especialidades
app.get("/especialidades", db_e.getListaEspecialidades);
app.get("/especialidades/:idEspecialidad", db_e.getEspecialidad);
app.post("/especialidades", db_e.insertaEspecialidad);
app.put("/especialidades/:idEspecialidad", db_e.actualizaEspecialidad);
app.delete("/especialidades/:idEspecialidad", db_e.eliminaEspecialidad);
// -- Especialidades cuyas combinaciones con tamaños no están completas (ordenadas alfabéticamente)
// -- (no tienen combinación con todos los tamaños)
app.get(
  "/especialidadesNoCombinanTodosTamanios",
  db_e.getListaEspecialidadesNoCombinanTodosTamanios
);

//Endpoints para tipos_producto
app.get("/tipos-producto", db_tipos_producto.getListaTiposProducto);
app.get("/tipos-producto/:idTipoProducto", db_tipos_producto.getTipoProducto);
app.post("/tipos-producto", db_tipos_producto.insertaTipoProducto);
app.put(
  "/tipos-producto/:idTipoProducto",
  db_tipos_producto.actualizaTipoProducto
);
app.delete(
  "/tipos-producto/:idTipoProducto",
  db_tipos_producto.eliminaTipoProducto
);

//Endpoints para productos
app.get("/productos", db_producto.getListaProducto);
app.get("/productos2", db_producto.getListaProducto2);
app.get("/productos/:idProducto", db_producto.getProducto);
app.post("/productos", db_producto.insertaProducto);
app.put("/productos/:idProducto", db_producto.actualizaProducto);
app.delete("/productos/:idProducto", db_producto.eliminaProducto);

// No existe esta relación. 28 Dic 2024
// Endpoints para relacion_especialidad_tamanio_precio_sucursal
/*app.get('/relacion_especialidad_tamanio_precio_sucursal/:idSucursal', db_retps.getListaRelacionEspecialidadTamanioPrecioSucursal);
app.get('/relacion_especialidad_tamanio_precio_sucursal/:idEspecialidad/:idTamanio/:idSucursal', db_retps.getRelacionEspecialidadTamanioPrecioSucursal);
app.post('/relacion_especialidad_tamanio_precio_sucursal', db_retps.insertaRelacionEspecialidadTamanioPrecioSucursal);
app.put('/relacion_especialidad_tamanio_precio_sucursal/:idEspecialidad/:idTamanio/:idSucursal', db_retps.actualizaRelacionEspecialidadTamanioPrecioSucursal);
app.delete('/relacion_especialidad_tamanio_precio_sucursal/:idEspecialidad/:idTamanio/:idSucursal', db_retps.eliminaRelacionEspecialidadTamanioPrecioSucursal);
*/

// Al parecer estos endpoints están obsoletos. 28 Dic 2024
//Endpoints para relacion_producto_precio_sucursal
/*app.get('/relacion_producto_precio_sucursal/:idSucursal', db_rpps.getListaRelacionProductoPrecioSucursal);
app.get('/relacion_producto_precio_sucursal/:idSucursal/:idProducto', db_rpps.getRelacionProductoPrecioSucursal);
app.post('/relacion_producto_precio_sucursal', db_rpps.insertaRelacionProductoPrecioSucursal);
app.put('/relacion_producto_precio_sucursal/:idSucursal/:idProducto', db_rpps.actualizaRelacionProductoPrecioSucursal);
app.delete('/relacion_producto_precio_sucursal/:idSucursal/:idProducto', db_rpps.eliminaRelacionProductoPrecioSucursal);
*/

//Endpoints para relacion_producto_sucursal
app.get(
  "/relacion_producto_sucursal/:idSucursal",
  db_rprods.getListaRelacionProductoSucursal
);
app.get(
  "/relacion_producto_sucursal/:idProducto/:idSucursal",
  db_rprods.getRegistroRelacionProductoSucursal
);
app.post(
  "/relacion_producto_sucursal",
  db_rprods.insertaRegistroRelacionProductoSucursal
);
app.put(
  "/relacion_producto_sucursal/:idProducto/:idSucursal",
  db_rprods.actualizaRegistroRelacionProductoSucursal
);
// Nuevo 2 Ene 2024
app.get(
  "/dameListadoProductosNoEstanEnRPS/:idSucursal",
  db_rprods.getListadoProductosNoEstanEnRPS
);
app.delete(
  "/relacion_producto_sucursal/:idProducto/:idSucursal",
  db_rprods.eliminaRegistroRelacionProductoSucursal
);

//Endpoints para relacion_orilla_sucursal
app.get(
  "/relacion_orilla_sucursal/:idSucursal",
  db_ros.getListaRelacionOrillaSucursal
);
app.get(
  "/relacion_orilla_sucursal/:idOrilla/:idSucursal",
  db_ros.getRegistroRelacionOrillaSucursal
);
app.get(
  "/dameListadoOrillasNoEstanEnROS/:idSucursal",
  db_ros.getListadoOrillasNoEstanEnROS
);
app.post(
  "/relacion_orilla_sucursal",
  db_ros.insertaRegistroRelacionOrillaSucursal
);
app.put(
  "/relacion_orilla_sucursal/:idOrilla",
  db_ros.actualizaRegistroRelacionOrillaSucursal
);
app.delete(
  "/relacion_orilla_sucursal/:idOrilla/:idSucursal",
  db_ros.eliminaRegistroRelacionOrillaSucursal
);

//Endpoints para relacion_pizza_sucursal
app.get(
  "/relacion_pizza_sucursal/:idSucursal",
  db_rps.getListaRelacionPizzaSucursal
);
app.get(
  "/relacion_pizza_sucursal/:idSucursal/:idPizza",
  db_rps.getRegistroRelacionPizzaSucursal
);
app.post(
  "/relacion_pizza_sucursal",
  db_rps.insertaRegistroRelacionPizzaSucursal
);
app.get(
  "/dameListadoPizzasNoEstanEnRPS/:idSucursal",
  db_rps.getListadoPizzasNoEstanEnRPS
);
app.post(
  "/relacion_pizza_sucursal",
  db_rps.insertaRegistroRelacionPizzaSucursal
);
app.delete(
  "/relacion_pizza_sucursal/:idPizza/:idSucursal",
  db_rps.eliminaRegistroRelacionPizzaSucursal
);
app.put(
  "/relacion_pizza_sucursal/:idPizza",
  db_rps.actualizaRegistroRelacionPizzaSucursal
);


//Endpoints para relacion_salsa_sucursal
app.get(
  "/relacion_salsa_sucursal/:idSucursal",
  db_rss.getListaRelacionSalsaSucursal
);
app.post(
  "/relacion_salsa_sucursal",
  db_rss.insertaRegistroRelacionSalsaSucursal
);
app.get(
  "/dameListadoSalsasNoEstanEnRSS/:idSucursal",
  db_rss.getListadoSalsasNoEstanEnRSS
);
app.post(
  "/relacion_salsa_sucursal",
  db_rss.insertaRegistroRelacionSalsaSucursal
);
app.delete(
  "/relacion_salsa_sucursal/:idSalsa/:idSucursal",
  db_rss.eliminaRegistroRelacionSalsaSucursal
);

/*
app.get('/relacion_pizza_sucursal/:idOrilla/:idSucursal', db_ros.getRegistroRelacionOrillaSucursal);
app.post('/relacion_pizza_sucursal', db_ros.insertaRegistroRelacionOrillaSucursal);
app.put('/relacion_orilla_sucursal/:idOrilla/:idSucursal', db_ros.actualizaRegistroRelacionOrillaSucursal);
app.delete('/relacion_orilla_sucursal/:idOrilla/:idSucursal', db_ros.eliminaRegistroRelacionOrillaSucursal);
*/

//Endpoints para region
app.get("/regiones", db_region.getListaRegiones);
app.get("/regiones/:idRegion", db_region.getRegion);
app.post("/regiones", db_region.insertaRegion);
app.put("/regiones/:idRegion", db_region.actualizaRegion);
app.delete("/regiones/:idRegion", db_region.eliminaRegion);

//Endpoints para sucursal
app.get("/sucursales", db_sucursal.getListaSucursales);
app.get("/sucursales/:idSucursal", db_sucursal.getSucursal);
app.post("/sucursales", db_sucursal.insertaSucursal);
app.put("/sucursales/:idSucursal", db_sucursal.actualizaSucursal);
app.delete("/sucursales/:idSucursal", db_sucursal.eliminaSucursal);

//Endpoints para promocion_especial
app.get(
  "/promociones_especiales",
  db_promocion_especial.getListaPromocionesEspeciales
);
app.get(
  "/promociones_especiales/:idPromocion",
  db_promocion_especial.getPromocionEspecial
);
app.post(
  "/promociones_especiales",
  db_promocion_especial.insertaPromocionEspecial
);
app.put(
  "/promociones_especiales/:idPromocion",
  db_promocion_especial.actualizaPromocionEspecial
);
app.delete(
  "/promociones_especiales/:idPromocion",
  db_promocion_especial.eliminaPromocionEspecial
);
// Dame lista de promociones especiales que no se encuentran en relacion_promocion_especial_sucursal
app.get(
  "/promociones_especiales_no/:idSucursal",
  db_promocion_especial.getListaPromocionesEspecialesQueNoEstanEnRelacionPromocionEspecialSucursal
);

//Endpoints para relacion_promocion_especial_sucursal
app.get(
  "/relacion_promociones_especiales_sucursal/:idSucursal",
  db_relacion_promocion_especial_sucursal.getListaRelacionPromocionesEspecialesSucursal
);
app.get(
  "/relacion_promociones_especiales_sucursal/:idPromocion/:idSucursal",
  db_relacion_promocion_especial_sucursal.getRelacionPromocionEspecialSucursal
);
app.post(
  "/relacion_promociones_especiales_sucursal",
  db_relacion_promocion_especial_sucursal.insertaRelacionPromocionEspecialSucursal
);
app.put(
  "/relacion_promociones_especiales_sucursal/:idPromocion/:idSucursal",
  db_relacion_promocion_especial_sucursal.actualizaRelacionPromocionEspecialSucursal
);
app.delete(
  "/relacion_promociones_especiales_sucursal/:idPromocion/:idSucursal",
  db_relacion_promocion_especial_sucursal.eliminaRelacionPromocionEspecialSucursal
);
app.get(
  "/dameListadoPromocionesEspecialesNoEstanEnRPE/:idSucursal",
  db_relacion_promocion_especial_sucursal.getPromocionesEspecialesNoEstanEnRPE
);

app.listen(port, () => {
  console.log(
    "API CHPSystem 20240826 Captura PPP Móviles Nube corriendo en puerto",
    port
  );
});
