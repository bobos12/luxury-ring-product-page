import PRODUCT_DATA from "./data.js";
import { Cart } from "./cart.js";

// ----------------------
// Utility: Format price
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
  // Render header/cart status
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

  // Render product image gallery
  static renderProductGallery(images) {
    const galleryContainer = document.getElementById("product-gallery-container");
    if (!galleryContainer || !images?.length) return;

    // Main image
    const mainImageDiv = document.createElement("div");
    mainImageDiv.className = "main-image-container";
    const mainImg = document.createElement("img");
    mainImg.id = "main-view";
    mainImg.src = `images/${images[0].src}`;
    mainImg.alt = images[0].alt;
    mainImageDiv.appendChild(mainImg);

    // Thumbnails
    const thumbContainer = document.createElement("div");
    thumbContainer.className = "thumbnail-grid";

    images.slice(1).forEach((img, idx) => {
      const thumb = document.createElement("img");
      thumb.src = `images/${img.src}`;
      thumb.alt = img.alt;
      thumb.className = "thumb";
      if (idx === 0) thumb.classList.add("active");

      // Click: update main image
      thumb.addEventListener("click", () => {
        mainImg.src = `images/${img.src}`;
        mainImg.alt = img.alt;

        Array.from(thumbContainer.children).forEach((t, i) =>
          t.classList.toggle("active", i === idx)
        );
      });

      thumbContainer.appendChild(thumb);
    });

    galleryContainer.innerHTML = "";
    galleryContainer.appendChild(mainImageDiv);
    galleryContainer.appendChild(thumbContainer);
  }

  // Render product details
  static renderProduct(product) {
    const productContainer = document.getElementById("product-details");
    if (!productContainer) return;

    productContainer.innerHTML = `
      <h1>${product.name}</h1>
      <p class="price">${formatPrice(product.price)}</p>
      <p class="description-box">${product.description}</p>

      <div class="specs-section">
        <h3>Piece Specifications</h3>
        <p class="description-box">${product.PieceSpecifications}</p>
        <div class="specs-grid">
          ${Object.entries(product.specs)
            .map(
              ([key, value]) => `
            <div class="spec-item">
              <span class="spec-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span class="spec-value">${value}</span>
              <span class="spec-description">${product.specsDescription}</span>
            </div>`
            )
            .join("")}
        </div>
      </div>

      <div class="color-section">
        <h3>Color</h3>
        <div class="variants">
          ${product.variants
            .map(
              (v) => `
            <button class="variant-btn" data-id="${v.id}" title="${v.color}" aria-pressed="false">
              <img src="${v.image}" alt="${v.color}" class="color-swatch">
            </button>`
            )
            .join("")}
        </div>
      </div>

      <div class="size-section">
        <h3>Size</h3>
        <div class="sizes">
          ${product.sizes.map((s) => `<button class="size-btn" aria-pressed="false">${s}</button>`).join("")}
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
    const ringsContainer = document.getElementById("rings-collection-container");
    if (!ringsContainer) return;

    ringsContainer.innerHTML = `
      <h2 class="collection-title">Ring Collection</h2>
      <div class="collection-grid">
        ${products
          .map(
            (p) => `
          <div class="product-card">
            <img src="images/${p.img}" alt="${p.name}" class="product-image">
            <h3 class="product-name">${p.name}</h3>
            <p class="product-price">${formatPrice(p.price)}</p>
          </div>`
          )
          .join("")}
      </div>
      <div class="collection-footer">
        <button class="shop-button">Shop Rings</button>
      </div>
    `;
  }

  // Helper: setup toggle selection with visual & accessibility feedback
  static setupToggleSelection(buttons, className = "selected", onSelect) {
    buttons.forEach((btn) =>
      btn.addEventListener("click", function () {
        buttons.forEach((b) => {
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

  // Handle color & size selection
  setupOptionSelection() {
    const colorBtns = document.querySelectorAll(".variant-btn");
    UIManager.setupToggleSelection(colorBtns, "selected", (btn) => {
      const variantId = btn.dataset.id;
      const variant = this.product.variants.find((v) => v.id === variantId);
      this.selectedColor = variant ? variant.color : null;
    });
    // Default selection
    if (colorBtns.length > 0) {
      colorBtns[0].click();
    }

    const sizeBtns = document.querySelectorAll(".size-btn");
    UIManager.setupToggleSelection(sizeBtns, "selected", (btn) => {
      this.selectedSize = btn.textContent;
    });
    // Default selection
    if (sizeBtns.length > 0) {
      sizeBtns[0].click();
    }
  }

  // Add to cart button behavior
  setupAddToCart() {
    const addToCartBtn = document.getElementById("add-to-cart");
    if (!addToCartBtn) return;

    addToCartBtn.addEventListener("click", () => {
      if (!this.selectedColor || !this.selectedSize) {
        alert("Please select a color and size before adding to cart");
        return;
      }

      this.cart.add(this.product, {
        color: this.selectedColor,
        size: this.selectedSize,
      });

      // Optional: tiny feedback
      const cartCountEl = document.getElementById("cart-count");
      if (cartCountEl) {
        cartCountEl.classList.add("highlight");
        setTimeout(() => cartCountEl.classList.remove("highlight"), 300);
      }
    });
  }
}

// ----------------------
// Initialize
// ----------------------
const productPage = new ProductPage(PRODUCT_DATA);
productPage.init();
