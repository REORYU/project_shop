import React from "react";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.img} alt={product.name} className="product-img" />
      <div className="product-info">
        <h4 className="product-name">{product.name}</h4>
        <p className="product-date">{product.date}</p>
      </div>
    </div>
  );
}

export default ProductCard;
