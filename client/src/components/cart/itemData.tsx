import React from "react";
import { Cart } from "../../graphql/cart";
import { Product } from "../../graphql/products";

const ItemData = ({
  imageUrl,
  title,
  price,
}: Pick<Product, "imageUrl" | "title" | "price">) => {
  return (
    <div className="cart-itemData">
      <img className="cart-itemData_image" src={imageUrl} />
      <span className="cart-itemData_title">{title}</span>
      <span className="cart-itemData_price">{price}원</span>
    </div>
  );
};

export default ItemData;
