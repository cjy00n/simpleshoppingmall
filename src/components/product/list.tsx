import ProductItem from "../../components/product/item";
import { Product } from "../../graphql/products";

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
