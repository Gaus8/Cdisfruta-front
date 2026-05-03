import { FaShoppingCart, FaSearch, FaUserCircle } from "react-icons/fa";
import '../../assets/styles/dashboardUsuario/dashboardUsuario.css'

export default function DashboardUsuario() {
  return (
    <div className="userpage-container">
      <HeaderDashboard />
      <div className="content-wrapper">
        <aside className="filters-sidebar">
          <h4>Categorías</h4>
          <ul>
            <li>Frutas Deshidratadas</li>
            <li>Mix Energético</li>
            <li>Promociones</li>
          </ul>
        </aside>
        <ProductList />
      </div>
    </div>
  );
}

function HeaderDashboard() {
  return (
    <header className="user-header">
      <div className="header-content">
        <h1 className="logo">CDISFRUTA<span>.shop</span></h1>
        
        <div className="search-bar">
          <input type="text" placeholder="Buscar snacks saludables..." />
          <button className="search-btn"><FaSearch /></button>
        </div>

        <div className="header-icons">
          <div className="icon-badge">
            <FaShoppingCart className="icon" />
            <span className="badge">0</span>
          </div>
          <FaUserCircle className="icon user-profile-icon" />
        </div>
      </div>
    </header>
  );
}

function ProductList() {
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