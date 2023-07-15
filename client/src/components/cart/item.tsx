import { useMutation, useQueryClient } from "react-query";
import { Cart, DELETE_CART, UPDATE_CART } from "../../graphql/cart";
import { QueryKeys, graphqlFetcher } from "../../queryClient";
import { ForwardedRef, SyntheticEvent, forwardRef } from "react";
import ItemData from "./itemData";
import React from "react";

const CartItem = (
  { id, product: { imageUrl, title, price }, amount }: Cart,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const queryClient = useQueryClient();
  const { mutate: updateCart } = useMutation(
    ({ id, amount }: { id: string; amount: number }) =>
      graphqlFetcher<{ updateCart: Cart }>(UPDATE_CART, { id, amount }),
    {
      onMutate: async ({ id, amount }) => {
        await queryClient.cancelQueries(QueryKeys.CART);
        const { cart: prevCart } =
          queryClient.getQueryData<{ cart: Cart[] }>(QueryKeys.CART) || {};

        if (!prevCart) return null;

        const targetIndex = prevCart.findIndex(
          (cartItem) => cartItem.id === id
        );
        if (targetIndex === undefined || targetIndex < 0) return prevCart;
        console.log(prevCart[targetIndex]);
        const newCart = [...prevCart];
        newCart.splice(targetIndex, 1, { ...newCart[targetIndex], amount });
        queryClient.setQueryData(QueryKeys.CART, { cart: newCart });
        return prevCart;
      },
      onSuccess: ({ updateCart }) => {
        const { cart: prevCart } = queryClient.getQueryData<{
          cart: Cart[];
        }>(QueryKeys.CART) || { cart: [] };
        const targetIndex = prevCart?.findIndex(
          (cartItem) => cartItem.id === updateCart.id
        );
        const newCart = [...prevCart];
        newCart.splice(targetIndex, 1, updateCart);
        queryClient.setQueryData(QueryKeys.CART, { cart: newCart });
      },
    }
  );

  const { mutate: deleteCart } = useMutation(
    ({ id }: { id: string }) => graphqlFetcher(DELETE_CART, { id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.CART);
      },
    }
  );

  const handleUpdateAmount = (e: SyntheticEvent) => {
    const amount = Number((e.target as HTMLInputElement).value);
    if (amount < 1) return;
    updateCart({ id, amount });
  };

  const handleDeleteItem = () => {
    console.log(id);
    deleteCart({ id });
  };

  return (
    <li className="cart-item">
      <input
        className="cart-item_checkbox"
        type="checkbox"
        name={`select-item`}
        ref={ref}
        data-id={id}
      />
      <ItemData imageUrl={imageUrl} title={title} price={price} />
      <label>
        <input
          className="cart-item_amount"
          type="number"
          value={amount}
          min={1}
          onChange={handleUpdateAmount}
        />{" "}
        개
      </label>

      <button
        className="cart-item_removeButton"
        type="button"
        onClick={handleDeleteItem}
      >
        x
      </button>
    </li>
  );
};

export default forwardRef(CartItem);
