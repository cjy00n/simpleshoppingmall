import { Product } from "../../graphql/products";
import React from "react";
import ProductItem from "./item";

const ProductList = ({ list }: { list: { products: Product[] }[] }) => {
  return (
    <ul className="products">
      {list.map((page) =>
        page.products.map((product) => (
          <ProductItem {...product} key={product.id} />
        ))
      )}
    </ul>
  );
};

export default ProductList;
