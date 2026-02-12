const PRODUCT_DATA = {
  id: "lexic-cuf-ring",
  name: "The Lexic Cuf Ring",
  price: 6990,
  currency: "$",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  PieceSpecifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  specs: { gold: "18k", diamond: "2.4c", clarity: "92%" },
  specsDescription: "Lorem ipsum dolor sit amet, dolore magna aliqua.",
  variants: [
    { id: "v1", color: "Silver", image: "./images/color1.png" },
    { id: "v2", color: "Gold", image: "./images/color2.png" },
    { id: "v3", color: "Rose Gold", image: "./images/color3.png" }
  ],
  sizes: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5],
  relatedProducts: [
    { id: "r1", name: "First Product Name", price: 1500, img: "ring1.png" },
    { id: "r2", name: "Second Product Name", price: 1500, img: "ring2.png" },
    { id: "r3", name: "Third Product Name", price: 1500, img: "ring3.png" },
    { id: "r4", name: "Fourth Product Name", price: 1500, img: "ring4.png" }
  ],
  galleryImages: [
    { src: "hero.png", alt: "The Lexic Cuf Ring" },
    { src: "collection1.png", alt: "View 1" },
    { src: "collection2.png", alt: "View 2" },
    { src: "collection3.png", alt: "View 3" }
  ]
};

export default PRODUCT_DATA;
