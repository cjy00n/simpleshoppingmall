import { Product } from "../../graphql/products";
const ProductDetail = ({
  item: { description, imageUrl, price, createdAt, title },
}: {
  item: Product;
}) => (
  <div className="product-detail">
    <p className="product-detail_title">{title}</p>
    <p className="product-detail_description">{description}</p>
    <img className="product-detail_image" src={imageUrl} />
    <p className="product-detail_price">${price}</p>
    <p className="product-detail_createdAt">{createdAt}</p>
  </div>
);

export default ProductDetail;
