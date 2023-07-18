import React, { SyntheticEvent } from "react";
import { ADD_PRODUCT, MutableProduct, Product } from "../../graphql/products";
import { QueryKeys, getClient, graphqlFetcher } from "../../queryClient";
import { useMutation } from "react-query";
import arrToObj from "../../../util/arrToObj";

const AddForm = () => {
  const queryClient = getClient();

  const { mutate: addProduct } = useMutation(
    ({ title, imageUrl, price, description }: MutableProduct) =>
      graphqlFetcher<{ addProduct: Product }>(ADD_PRODUCT, {
        title,
        imageUrl,
        price,
        description,
      }),
    {
      onSuccess: ({ addProduct }) => {
        // 데이터를 stale처리해서 재요청하게끔 => 코드간단, 서버요청해야함
        queryClient.invalidateQueries(QueryKeys.PRODUCTS, {
          exact: false,
          refetchInactive: true,
        });
        // 응답 결과만으로 캐시 업데이트 => 코드 복잡, 서버요청필요x
        // const adminData = queryClient.getQueriesData<{
        //   pageParams: (number | undefined)[];
        //   pages: Products[];
        // }>([QueryKeys.PRODUCTS, true]);

        // const [adminKey, { pageParams: adminParams, pages: AdminPages }] =
        //   adminData[0];
        // const newAdminPages = [...AdminPages];
        // newAdminPages[0].products = [addProduct, ...newAdminPages[0].products];
        // queryClient.setQueryData(adminKey, {
        //   pageParams: adminParams,
        //   page: newAdminPages,
        // });
      },
    }
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = arrToObj([...new FormData(e.target as HTMLFormElement)]);
    formData.price = Number(formData.price);
    addProduct(formData as MutableProduct);
  };
  return (
    <form className="admin_form" onSubmit={handleSubmit}>
      <h3>상품등록</h3>
      <label>
        상품명 : <input name="title" type="text" required />
      </label>
      <label>
        상품이미지URL : <input name="imageUrl" type="text" required />
      </label>
      <label>
        상품가격 : <input name="price" type="number" required min={1} />
      </label>
      <label>
        상품설명 : <textarea name="description" />
      </label>
      <button type="submit">상품등록</button>
    </form>
  );
};

export default AddForm;
