import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Product } from "../../types";
import { QueryKeys, fetcher } from "../../queryClient";
import ProductDetail from "../../components/product/detail";
const ProductDetailPage = () => {
  const { id } = useParams<"id">();

  const { data } = useQuery<Product>([QueryKeys.PRODUCTS, id], () =>
    fetcher({ method: "GET", path: `/products/${id}` })
  );
  if (!data) return null;

  return (
    <div>
      <h2>상품상세</h2>
      <ProductDetail item={data} />
    </div>
  );
};

export default ProductDetailPage;