import { Product } from "../../graphql/products";
import { Link } from "react-router-dom";
import { cartItemSelector } from "../../recoils/cart";
import { useRecoilState, useRecoilValue } from "recoil";
const ProductItem = ({
  description,
  id,
  imageUrl,
  price,
  createdAt,
  title,
}: Product) => {
  const [cartAmount, setCartAmount] = useRecoilState(cartItemSelector(id));
  const addToCart = () => setCartAmount((prev) => (prev || 0) + 1);
  return (
    <li className="product-item">
      <Link to={`/products/${id}`}>
        <p className="product-item_title">{title}</p>
        <p className="product-item_description">{description}</p>
        <img className="product-item_image" src={imageUrl} />
        <span className="product-item_price">${price}</span>
        <span className="product-item_createdAt">{createdAt}</span>
      </Link>
      <button className="product-item_add-cart" onClick={addToCart}>
        담기
      </button>
      <span>{cartAmount || 0}</span>
    </li>
  );
};

export default ProductItem;
