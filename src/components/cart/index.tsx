import { Cart } from "../../graphql/cart";
import CartItem from "./item";

const CartList = ({ items }: { items: Cart[] }) => {
  return (
    <div>
      <ul>
        {items.map((item) => (
          <CartItem {...item} key={item.id} />
        ))}
      </ul>
    </div>
  );
};

export default CartList;
