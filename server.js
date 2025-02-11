import express from "express";
import { engine } from "express-handlebars";
import http from "http";
import { Server as socketIo } from "socket.io";
import path from "path";

// Lista de productos simulada
let products = [
  { name: "Producto 1", price: 175000 },
  { name: "Producto 2", price: 189000 },
  { name: "Producto 3", price: 300000 },
];

// Inicializar express y crear servidor
const app = express();
const server = http.createServer(app);
const io = new socketIo(server);

// Configuración de Handlebars como motor de plantillas
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(process.cwd(), "views"));

// Servir archivos estáticos
app.use(express.static(path.join(process.cwd(), "public")));

// Middleware (para manejar datos del form)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get("/", (req, res) => {
  res.render("home", { title: "Mi Tienda Online", products });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { title: "Productos en Tiempo Real" });
});

// Conexión WebSocket
io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  // Escuchar eventos de productos
  socket.on("newProduct", (product) => {
    // Emitir el evento a todos los usuarios conectados
    io.emit("updateProducts", product);
  });

  socket.on("deleteProduct", (productId) => {
    io.emit("removeProduct", productId);
  });

  // Desconectar usuario
  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

//http://localhost:3000 para la vista de la lista de productos (home.handlebars).
//http://localhost:3000/realtimeproducts para la vista en tiempo real con WebSocket (realTimeProducts.handlebars).
