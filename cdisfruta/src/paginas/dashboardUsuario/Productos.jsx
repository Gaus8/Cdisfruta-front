import { FaShoppingCart, FaSearch, FaUserCircle } from "react-icons/fa";

export default function Productos() {
  const products = [
    { id: 1, name: "Mango Deshidratado", price: 12000, image: "https://via.placeholder.com/200", tag: "Popular" },
    { id: 2, name: "Piña en Rodajas", price: 10500, image: "https://via.placeholder.com/200", tag: "Nuevo" },
    { id: 3, name: "Mix de la Sabana", price: 15000, image: "https://via.placeholder.com/200", tag: null },
    { id: 4, name: "Arándanos Premium", price: 18900, image: "https://via.placeholder.com/200", tag: "Oferta" },
  ];

  return (
    <main className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} {...p} />
      ))}
    </main>
  );
}

function ProductCard({ name, price, image, tag }) {
  return (
    <div className="product-card">
      {tag && <span className="product-tag">{tag}</span>}
      <div className="product-img-container">
        <img src={image} alt={name} />
      </div>
      <div className="product-info">
        <h3>{name}</h3>
        <p className="price">${price.toLocaleString("es-CO")}</p>
        <button className="add-to-cart-btn">
          <FaShoppingCart /> Agregar
        </button>
      </div>
    </div>
  );
}