// ----------------------
// Helper: Get image path
// ----------------------
function getImagePath(filename) {
  if (!filename) return '';
  return filename.startsWith('images/') ? filename : `images/${filename}`;
}

// ----------------------
// Utility: Format price as USD
// ----------------------
function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// ----------------------
// UIManager: Handles all DOM rendering
// ----------------------
class UIManager {
  // Render header with cart count
  static renderHeader(cartCount = 0) {
    const navbar = document.getElementById("navbar-container");
    if (!navbar) return;

    navbar.innerHTML = `
      <div class="cart-status">
        Cart <span id="cart-count">${cartCount}</span>
        <img src="images/cart.svg" alt="Cart Icon" class="cart-icon">
      </div>
    `;
  }

  // Render product gallery: main image + thumbnails
  static renderProductGallery(images) {
    const galleryContainer = document.getElementById("product-gallery-container");
    if (!galleryContainer || !images?.length) return;

    // Main image
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("main-image-container");
    const mainImg = document.createElement("img");
    mainImg.id = "main-view";
    mainImg.src = getImagePath(images[0].src);
    mainImg.alt = images[0].alt;
    mainDiv.appendChild(mainImg);

    // Thumbnail images
    const thumbContainer = document.createElement("div");
    thumbContainer.classList.add("thumbnail-grid");

    images.slice(1).forEach((image, index) => {
      const thumb = document.createElement("img");
      thumb.src = getImagePath(image.src);
      thumb.alt = image.alt;
      thumb.className = "thumb";
      if (index === 0) thumb.classList.add("active");

      thumb.addEventListener("click", () => {
        mainImg.src = getImagePath(image.src);
        mainImg.alt = image.alt;

        // highlight selected thumbnail
        thumbContainer.querySelectorAll(".thumb").forEach((t, i) => {
          t.classList.toggle("active", i === index);
        });
      });

      thumbContainer.appendChild(thumb);
    });

    galleryContainer.innerHTML = "";
    galleryContainer.appendChild(mainDiv);
    galleryContainer.appendChild(thumbContainer);
  }

  // Render product details
  static renderProduct(product) {
    const container = document.getElementById("product-details");
    if (!container) return;

    container.innerHTML = `
      <h1>${product.name}</h1>
      <p class="price">${formatPrice(product.price)}</p>
      <p class="description-box">${product.description}</p>

      <div class="specs-section">
        <h3>Piece Specifications</h3>
        <p class="description-box">${product.PieceSpecifications}</p>
        <div class="specs-grid">
          ${Object.entries(product.specs).map(([key, value]) => `
            <div class="spec-item">
              <span class="spec-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span class="spec-value">${value}</span>
              <span class="spec-description">${product.specsDescription}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="color-section">
        <h3>Color</h3>
        <div class="variants">
          ${product.variants.map(v => `
            <button class="variant-btn" data-id="${v.id}" title="${v.color}" aria-pressed="false">
              <img src="${getImagePath(v.image)}" alt="${v.color}" class="color-swatch">
            </button>
          `).join("")}
        </div>
      </div>

      <div class="size-section">
        <h3>Size</h3>
        <div class="sizes">
          ${product.sizes.map(s => `<button class="size-btn" aria-pressed="false">${s}</button>`).join("")}
        </div>
      </div>

      <div class="button-wrapper">
        <button id="add-to-cart" class="add-to-cart-btn">Add To Cart</button>
        <button class="box-btn">+</button>
      </div>
    `;
  }

  // Render related rings collection
  static renderRingCollection(products) {
    const container = document.getElementById("rings-collection-container");
    if (!container) return;

    container.innerHTML = `
      <h2 class="collection-title">Ring Collection</h2>
      <div class="collection-grid">
        ${products.map(p => `
          <div class="product-card">
            <img src="${getImagePath(p.img)}" alt="${p.name}" class="product-image">
            <h3 class="product-name">${p.name}</h3>
            <p class="product-price">${formatPrice(p.price)}</p>
          </div>
        `).join("")}
      </div>
      <div class="collection-footer">
        <button class="shop-button">Shop Rings</button>
      </div>
    `;
  }

  // toggle selection for color/size buttons
  static setupToggleSelection(buttons, className = "selected", onSelect) {
    buttons.forEach(btn =>
      btn.addEventListener("click", function () {
        buttons.forEach(b => {
          if (b !== this) {
            b.classList.remove(className);
            b.setAttribute("aria-pressed", "false");
          }
        });

        this.classList.add(className);
        this.setAttribute("aria-pressed", "true");

        if (typeof onSelect === "function") onSelect(this);
      })
    );
  }
}

// ----------------------
// ProductPage: Handles state & user interaction
// ----------------------
class ProductPage {
  constructor(productData) {
    this.product = productData;
    this.cart = new Cart();
    this.selectedColor = null;
    this.selectedSize = null;
  }

  init() {
    UIManager.renderHeader(this.cart.getItems().length);
    UIManager.renderProductGallery(this.product.galleryImages);
    UIManager.renderProduct(this.product);
    UIManager.renderRingCollection(this.product.relatedProducts);
    this.setupOptionSelection();
    this.setupAddToCart();
    this.cart.updateCartCount();
  }

  // Setup color & size selections
  setupOptionSelection() {
    const colorBtns = document.querySelectorAll(".variant-btn");
    UIManager.setupToggleSelection(colorBtns, "selected", btn => {
      const variantId = btn.dataset.id;
      const variant = this.product.variants.find(v => v.id === variantId);
      this.selectedColor = variant ? variant.color : null;
    });
    if (colorBtns.length) colorBtns[0].click(); // default selection

    const sizeBtns = document.querySelectorAll(".size-btn");
    UIManager.setupToggleSelection(sizeBtns, "selected", btn => {
      this.selectedSize = btn.textContent;
    });
    if (sizeBtns.length) sizeBtns[0].click(); // default selection
  }

  // Add to cart button behavior
  setupAddToCart() {
    const addBtn = document.getElementById("add-to-cart");
    if (!addBtn) return;

    addBtn.addEventListener("click", () => {
      if (!this.selectedColor || !this.selectedSize) {
        alert("Oops! Please pick a color and size before adding this to your cart.");
        return;
      }

      this.cart.add(this.product, {
        color: this.selectedColor,
        size: this.selectedSize,
      });

      // tiny feedback on cart count
      this.highlightCartCount();
    });
  }

  // Highlight cart count briefly
  highlightCartCount() {
    const cartEl = document.getElementById("cart-count");
    if (!cartEl) return;
    cartEl.classList.add("highlight");
    setTimeout(() => cartEl.classList.remove("highlight"), 300);
  }
}

// ----------------------
// Initialize Product Page
// ----------------------
import PRODUCT_DATA from "./data.js";
import { Cart } from "./cart.js";

const productPage = new ProductPage(PRODUCT_DATA);
productPage.init();
