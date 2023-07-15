import { useQuery } from "react-query";
import { QueryKeys, graphqlFetcher } from "../../queryClient";
import { Cart, GET_CART } from "../../graphql/cart";
import CartList from "../../components/cart";
import React from "react";

const Cart = () => {
  const { data } = useQuery<{ cart: Cart }>(
    QueryKeys.CART,
    () => graphqlFetcher<{ cart: Cart }>(GET_CART),
    {
      staleTime: 0,
      cacheTime: 0,
    }
  );
  const cartItems = (data?.cart || []) as Cart[];
  if (!cartItems.length) {
    return <div>장바구니가 비었어요.</div>;
  }
  return (
    <div>
      <h2>장바구니</h2>
      <CartList items={cartItems} />
    </div>
  );
};

export default Cart;
