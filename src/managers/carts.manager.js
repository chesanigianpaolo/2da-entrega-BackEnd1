const fs = require("fs").promises;
const path = require("path");

class CartsManager {
  constructor() {
    this.filePath = path.join(__dirname, "../data/carts.json");
  }

  async getCarts() {
    const data = await fs.readFile(this.filePath, "utf-8");
    return JSON.parse(data);
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find((cart) => cart.id === id);
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = { id: this._generateId(carts), products: [] };
    carts.push(newCart);
    await this._saveToFile(carts);
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex((cart) => cart.id === cartId);
    if (cartIndex === -1) return null;

    const existingProduct = carts[cartIndex].products.find(
      (p) => p.product === productId
    );
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      carts[cartIndex].products.push({ product: productId, quantity: 1 });
    }

    await this._saveToFile(carts);
    return carts[cartIndex];
  }

  async _saveToFile(carts) {
    await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
  }

  _generateId(carts) {
    return carts.length ? Math.max(...carts.map((c) => c.id)) + 1 : 1;
  }
}

module.exports = CartsManager;
