const fs = require("fs").promises;
const path = require("path");

class ProductsManager {
  constructor() {
    this.filePath = path.join(__dirname, "../data/products.json");
  }

  async getProducts(limit) {
    const data = await fs.readFile(this.filePath, "utf-8");
    const products = JSON.parse(data);
    return limit ? products.slice(0, limit) : products;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((product) => product.id === id);
  }

  async addProduct(productData) {
    const products = await this.getProducts();
    const newProduct = {
      id: this._generateId(products),
      ...productData,
      status: true,
    };
    products.push(newProduct);
    await this._saveToFile(products);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates, id };
    await this._saveToFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const newProducts = products.filter((product) => product.id !== id);
    if (products.length === newProducts.length) return false;
    await this._saveToFile(newProducts);
    return true;
  }

  async _saveToFile(products) {
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
  }

  _generateId(products) {
    return products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  }
}

module.exports = ProductsManager;
