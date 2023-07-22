import { Product } from "../../graphql/products";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import { graphqlFetcher } from "../../queryClient";
import { ADD_CART } from "../../graphql/cart";
import React from "react";
const ProductItem = ({ description, id, imageUrl, price, title }: Product) => {
  const { mutate: addCart } = useMutation((id: string) =>
    graphqlFetcher(ADD_CART, { id })
  );
  return (
    <li className="product-item">
      <Link to={`/products/${id}`}>
        <p className="product-item_title">{title}</p>
        <p className="product-item_description">{description}</p>
        <img className="product-item_image" src={imageUrl} />
      </Link>
      <p className="product-item_price">₩{price}</p>
      <button className="product-item_add-cart" onClick={() => addCart(id)}>
        담기
      </button>
    </li>
  );
};

export default ProductItem;
