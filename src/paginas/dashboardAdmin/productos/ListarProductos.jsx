import { tw } from '../../../funciones/tw.js';
import { FaPlus, FaEdit, FaTrash, FaCloudUploadAlt } from 'react-icons/fa';


export default function ListarProductos({
  products, handleDeleteProduct,handleEditProduct
})
 {
  return (
    <div className={tw("products-grid")}>
      {products.length === 0 ? (
        <div className={tw("no-products")}>No hay productos registrados</div>
      ) : (
        products.map(product => (
          <div key={product._id} className={tw("product-card")}>
            <div className={tw("product-image")}>
              {product.imagen ? (
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className={tw("![width:100%]", "![height:100%]", "![object-fit:cover]")}
                />
              ) : (
                <div className={tw("![width:100%]", "![height:100%]", "![background:#f3f4f6]", "![border-radius:6px]")} />
              )}
            </div>
            <div className={tw("product-info")}>
              <h3>{product.nombre}</h3>
              <div className={tw("product-price")}>${product.precio}</div>
              <div className={tw("product-stock")}>{product.stock} unidades en stock</div>
              <div className={tw("product-category")}>Categoría: {product.categoria}</div>
              <p className={tw("![color:#6b7280]", "![font-size:14px]", "![margin-bottom:12px]")}>
                {product.descripcion}
              </p>
              <div className={tw("product-actions")}>
                <button className={tw("btn btn-edit")} onClick={() => handleEditProduct(product)}>
                  <FaEdit className={tw("![margin-right:6px]")} /> Editar
                </button>
                <button className={tw("btn btn-delete")} onClick={() => handleDeleteProduct(product._id)}>
                  <FaTrash className={tw("![margin-right:6px]")} /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}