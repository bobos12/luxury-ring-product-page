
export class Cart {
  constructor() {
    this.items = [];
  }

  add(product, options) {
    if (!product || !options.color || !options.size) return;

    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      color: options.color,
      size: options.size,
      quantity: 1
    };

    // see if this item with the same options is already in the cart
    const existing = this.items.find(
      i => i.id === item.id && i.color === item.color && i.size === item.size
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push(item);
    }

    this.updateCartCount();
  }

  remove(productId, color, size) {
    this.items = this.items.filter(
      i => !(i.id === productId && i.color === color && i.size === size)
    );
    this.updateCartCount();
  }

  updateCartCount() {
    const cartCountEl = document.getElementById("cart-count");
    const count = this.items.reduce((sum, i) => sum + i.quantity, 0);
    if (cartCountEl) cartCountEl.textContent = count;
  }

  getItems() {
    return [...this.items];
  }

  clear() {
    this.items = [];
    this.updateCartCount();
  }
}
