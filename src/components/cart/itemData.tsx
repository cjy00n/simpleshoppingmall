import { Cart } from "../../graphql/cart";

const ItemData = ({
  imageUrl,
  title,
  price,
}: Pick<Cart, "imageUrl" | "title" | "price">) => {
  return (
    <div className="cart-itemData">
      <img className="cart-item_img" src={imageUrl} />
      <span className="cart-item_title">{title}</span>
      <span className="cart-item_price">{price}원</span>
    </div>
  );
};

export default ItemData;
