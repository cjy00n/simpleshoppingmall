import { useRecoilValue } from "recoil";
import { checkedCartState } from "../../recoils/cart";
import ItemData from "./itemData";
import { useNavigate } from "react-router-dom";

const WillPay = () => {
  const navigate = useNavigate();
  const checkedItems = useRecoilValue(checkedCartState);
  const totalPrice = checkedItems.reduce((res, { price, amount }) => {
    res += price * amount;
    return res;
  }, 0);

  const handleSubmit = () => {
    if (checkedItems.length) {
      navigate("/payment");
    } else {
      alert("결제 할 상품이 없어요.");
    }
  };
  return (
    <div className="cart-willpay">
      <ul>
        {checkedItems.map(({ imageUrl, price, title, amount, id }) => (
          <li key={id}>
            <ItemData
              imageUrl={imageUrl}
              price={price}
              title={title}
              key={id}
            />
            <p>수량 :{amount}</p>
            <p>금액 :{price * amount} </p>
          </li>
        ))}
      </ul>
      <span>총 예상결제액 : {totalPrice}원 </span>
      <button onClick={handleSubmit}>결제하기</button>
    </div>
  );
};

export default WillPay;
