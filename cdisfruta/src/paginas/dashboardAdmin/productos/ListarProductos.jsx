import { FaPlus, FaEdit, FaTrash, FaCloudUploadAlt } from 'react-icons/fa';
import '../../../assets/styles/dashboardAdmin/listar_productos.css'


export default function ListarProductos({
  products, handleDeleteProduct,handleEditProduct
})
 {
  return (
    <div className="products-grid">
      {products.length === 0 ? (
        <div className="no-products">No hay productos registrados</div>
      ) : (
        products.map(product => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              {product.imagen ? (
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: '#f3f4f6',
                  borderRadius: '6px'
                }} />
              )}
            </div>
            <div className="product-info">
              <h3>{product.nombre}</h3>
              <div className="product-price">${product.precio}</div>
              <div className="product-stock">{product.stock} unidades en stock</div>
              <div className="product-category">Categoría: {product.categoria}</div>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>
                {product.descripcion}
              </p>
              <div className="product-actions">
                <button className="btn btn-edit" onClick={() => handleEditProduct(product)}>
                  <FaEdit style={{ marginRight: '6px' }} /> Editar
                </button>
                <button className="btn btn-delete" onClick={() => handleDeleteProduct(product._id)}>
                  <FaTrash style={{ marginRight: '6px' }} /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}