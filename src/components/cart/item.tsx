import { useMutation, useQueryClient } from "react-query";
import { Cart, DELETE_CART, UPDATE_CART } from "../../graphql/cart";
import { QueryKeys, graphqlFetcher } from "../../queryClient";
import { ForwardedRef, SyntheticEvent, forwardRef } from "react";

const CartItem = (
  { id, title, imageUrl, price, amount }: Cart,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const queryClient = useQueryClient();
  const { mutate: updateCart } = useMutation(
    ({ id, amount }: { id: string; amount: number }) =>
      graphqlFetcher(UPDATE_CART, { id, amount }),
    {
      onMutate: async ({ id, amount }) => {
        await queryClient.cancelQueries(QueryKeys.CART);
        const prevCart = queryClient.getQueryData<{ [key: string]: Cart }>(
          QueryKeys.CART
        );
        if (!prevCart?.[id]) return prevCart;

        const newCart = {
          ...(prevCart || {}),
          [id]: { ...prevCart[id], amount },
        };

        queryClient.setQueryData(QueryKeys.CART, newCart);
        return newCart;
      },
      onSuccess: (newValue) => {
        const prevCart = queryClient.getQueryData<{
          [key: string]: Cart;
        }>(QueryKeys.CART);

        const newCart = {
          ...(prevCart || {}),
          [id]: newValue,
        };

        queryClient.setQueryData(QueryKeys.CART, newCart);
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
    deleteCart({ id });
  };

  return (
    <li className="cart-item">
      <input
        className="cart-item_checkbox"
        type="checkbox"
        name={`select-item`}
        ref={ref}
      />
      <img className="cart-item_img" src={imageUrl} />
      <p className="cart-item_title">{title}</p>
      <p className="cart-item_price">{price}원</p>
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
