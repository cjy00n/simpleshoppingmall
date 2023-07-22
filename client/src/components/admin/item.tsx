import {
  DELETE_PRODUCT,
  MutableProduct,
  Product,
  UPDATE_PRODUCT,
} from "../../graphql/products";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import { QueryKeys, getClient, graphqlFetcher } from "../../queryClient";
import React, { SyntheticEvent } from "react";
import arrToObj from "../../../util/arrToObj";
const AdminItem = ({
  description,
  id,
  imageUrl,
  price,
  title,
  createdAt,
  isEditing,
  startEdit,
  doneEdit,
}: Product & {
  isEditing: boolean;
  startEdit: () => void;
  doneEdit: () => void;
}) => {
  const queryClient = getClient();
  const { mutate: updateProduct } = useMutation(
    ({ title, imageUrl, price, description }: MutableProduct) =>
      graphqlFetcher<{ addProduct: Product }>(UPDATE_PRODUCT, {
        id,
        title,
        imageUrl,
        price,
        description,
      }),
    {
      onSuccess: () => {
        // 데이터를 stale처리해서 재요청하게끔 => 코드간단, 서버요청해야함
        queryClient.invalidateQueries(QueryKeys.PRODUCTS, {
          exact: false,
          refetchInactive: true,
        });
        doneEdit();
      },
    }
  );

  const { mutate: deleteProduct } = useMutation(
    ({ id }: { id: string }) =>
      graphqlFetcher(DELETE_PRODUCT, {
        id,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.PRODUCTS, {
          exact: false,
          refetchInactive: true,
        });
      },
    }
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = arrToObj([...new FormData(e.target as HTMLFormElement)]);
    formData.price = Number(formData.price);
    updateProduct(formData as MutableProduct);
  };

  const deleteItem = () => {
    deleteProduct({ id });
  };

  if (isEditing) {
    return (
      <li className="product-item">
        <form className="admin_form" onSubmit={handleSubmit}>
          <h3>상품수정</h3>
          <label>
            상품명 :
            <input name="title" type="text" defaultValue={title} required />
          </label>
          <label>
            상품이미지URL :
            <input
              name="imageUrl"
              type="text"
              defaultValue={imageUrl}
              required
            />
          </label>
          <label>
            상품가격 :
            <input
              name="price"
              type="number"
              defaultValue={price}
              required
              min={1}
            />
            원
          </label>
          <label>
            상품설명 :
            <textarea name="description" defaultValue={description} />
          </label>
          <button type="submit">
            {createdAt != null ? "상품수정" : "상품복구"}
          </button>
          <button onClick={doneEdit}>취소</button>
        </form>
      </li>
    );
  } else {
    return (
      <li className="product-item">
        <Link to={`/products/${id}`}>
          <p className="product-item_title">{title}</p>
          <p className="product-item_description">{description}</p>
          <img className="product-item_image" src={imageUrl} />
        </Link>
        <span className="product-item_price">₩{price}</span>
        {!createdAt && <span>삭제된 상품</span>}
        <button className="admin-item_update-product" onClick={startEdit}>
          {createdAt ? "수정" : "수정 및 복구"}
        </button>
        {createdAt && (
          <button className="admin-item_delete-product" onClick={deleteItem}>
            삭제
          </button>
        )}
      </li>
    );
  }
};

export default AdminItem;
