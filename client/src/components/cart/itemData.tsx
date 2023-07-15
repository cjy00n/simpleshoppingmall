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
      <img className="cart-item_img" src={imageUrl} />
      <span className="cart-item_title">{title}</span>
      <span className="cart-item_price">{price}원</span>
    </div>
  );
};

export default ItemData;
