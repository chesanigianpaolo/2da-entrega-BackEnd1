const { Router } = require("express");
const CartsManager = require("../managers/carts.manager");
const router = Router();

const cartsManager = new CartsManager();

// POST: este permite crear un nuevo carrito
router.post("/", async (req, res) => {
  const cart = await cartsManager.createCart();
  res.status(201).json(cart);
});

// GET: es para listar productos del carrito
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartsManager.getCartById(cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart);
});

// POST: para agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const updatedCart = await cartsManager.addProductToCart(cid, pid);
  if (!updatedCart)
    return res.status(404).json({ error: "Carrito o producto no encontrado" });
  res.json(updatedCart);
});

module.exports = router;
