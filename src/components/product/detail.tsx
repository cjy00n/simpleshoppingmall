import { Product } from "../../types";
const ProductDetail = ({
  item: { category, title, image, description, price, rating },
}: {
  item: Product;
}) => (
  <div className="product-detail">
    <p className="product-detail_category">{category}</p>
    <p className="product-detail_title">{title}</p>
    <p className="product-detail_description">{description}</p>
    <img className="product-detail_image" src={image} />
    <span className="product-detail_price">${price}</span>
    <span className="product-detail_rating_rate">{rating.rate}</span>
    <span className="product-detail_rating_count">{rating.count}</span>
  </div>
);

export default ProductDetail;
