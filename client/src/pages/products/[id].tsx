import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { QueryKeys, graphqlFetcher } from "../../queryClient";
import ProductDetail from "../../components/product/detail";
import { GET_PRODUCT, Product } from "../../graphql/products";
import React from "react";
const ProductDetailPage = () => {
  const { id } = useParams<"id">();

  const { data } = useQuery<{ product: Product }>(
    [QueryKeys.PRODUCTS, id],
    () => graphqlFetcher<{ product: Product }>(GET_PRODUCT, { id })
  );
  console.log(data);

  if (!data) return null;

  return (
    <div>
      <h2>상품상세</h2>
      <ProductDetail item={data.product} />
    </div>
  );
};

export default ProductDetailPage;
