import { useRecoilValue } from "recoil";
import { checkedCartState } from "../../recoils/cart";
import ItemData from "../cart/itemData";
import { SyntheticEvent } from "react";
import React from "react";

const WillPay = ({
  handleSubmit,
  submitTitle,
}: {
  handleSubmit: (e: SyntheticEvent) => void;
  submitTitle: string;
}) => {
  const checkedItems = useRecoilValue(checkedCartState);
  const totalPrice = checkedItems.reduce(
    (res, { product: { price, createdAt }, amount }) => {
      if (createdAt) res += price * amount;
      return res;
    },
    0
  );

  return (
    <div className="cart-willpay">
      <ul>
        {checkedItems.map(
          ({ product: { imageUrl, price, title, createdAt }, amount, id }) => (
            <li key={id}>
              <ItemData
                imageUrl={imageUrl}
                price={price}
                title={title}
                key={id}
              />
              <p>수량 :{amount}</p>
              <p>금액 :{price * amount} </p>
              {!createdAt && <p>품절된 상품입니다.</p>}
            </li>
          )
        )}
      </ul>
      <span>총 예상결제액 : {totalPrice}원 </span>
      <button onClick={handleSubmit}>{submitTitle}</button>
    </div>
  );
};

export default WillPay;
