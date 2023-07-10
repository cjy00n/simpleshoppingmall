import { useMutation, useQueryClient } from "react-query";
import { Cart, UPDATE_CART } from "../../graphql/cart";
import { QueryKeys, graphqlFetcher } from "../../queryClient";
import { SyntheticEvent } from "react";

const CartItem = ({ id, title, imageUrl, price, amount }: Cart) => {
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

  const handleUpdateAmount = (e: SyntheticEvent) => {
    const amount = Number((e.target as HTMLInputElement).value);
    updateCart({ id, amount });
  };
  return (
    <li className="cart-item">
      <img className="cart-item_img" src={imageUrl} />
      <p className="cart-item_title">{title}</p>
      <p className="cart-item_price">{price}</p>
      <input
        className="cart-item_amount"
        type="number"
        value={amount}
        onChange={handleUpdateAmount}
      ></input>
    </li>
  );
};

export default CartItem;
