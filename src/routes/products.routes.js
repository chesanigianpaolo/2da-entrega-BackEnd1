const { Router } = require("express");
const ProductsManager = require("../managers/products.manager");
const router = Router();

const productsManager = new ProductsManager();

// GET: listar todos los productos
router.get("/", async (req, res) => {
  const { limit } = req.query;
  const products = await productsManager.getProducts(limit);
  res.json(products);
});

// GET: para obtener producto por ID
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productsManager.getProductById(pid);
  if (!product)
    return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

// POST: es para agregar un nuevo producto
router.post("/", async (req, res) => {
  const newProduct = req.body;
  const product = await productsManager.addProduct(newProduct);
  res.status(201).json(product);
});

// PUT: actualizando un producto
router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const updatedProduct = req.body;
  const product = await productsManager.updateProduct(pid, updatedProduct);
  if (!product)
    return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

// DELETE: eliminar un producto
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  const success = await productsManager.deleteProduct(pid);
  if (!success)
    return res.status(404).json({ error: "Producto no encontrado" });
  res.sendStatus(204);
});

module.exports = router;
