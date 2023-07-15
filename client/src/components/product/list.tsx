import ProductItem from "./item";
import { Product } from "../../graphql/products";
import React from "react";

const ProductList = ({ list }: { list: Product[] }) => {
  return (
    <ul className="products">
      {list.map((product) => (
        <ProductItem {...product} key={product.id} />
      ))}
    </ul>
  );
};

export default ProductList;
