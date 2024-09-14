import React, { useState, useEffect } from "react";
import "./productModal.css";

const ProductModal = ({ show, handleClose, handleSave, product }) => {
  const [productName, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    if (product) {
      setProduct(product.productName);
      setQuantity(product.quantity);
      setStartDate(product.startDate);
      setDescription(product.description);
    } else {
      setProduct("");
      setQuantity("");
      setDescription("");
    }
  }, [product]);

  const onSave = () => {
    handleSave({ productName, quantity, description });
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0) {
      setQuantity(value);
    } else {
      setQuantity(0);
    }
  };

  return (
    <div className={`product-container ${show ? "d-flex" : "d-none"}`}>
      <div className="custom-modal-content">
        <div className="custom-modal-header">
          <h4>{product ? "Edit Product" : "Add Product"}</h4>
          <span className="custom-modal-close" onClick={handleClose}>
            &times;
          </span>
        </div>
        <div className="custom-modal-body">
          <form>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Enter the Product Name"
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                placeholder="Enter Quantity"
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="mm/dd/yyyy"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                rows="3"
                columns="5"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description"
                className="w-100 rounded-3 px-2"
              />
            </div>
          </form>
        </div>
        <div className="d-flex justify-content-end gap-3">
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn btn-success" onClick={onSave}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
