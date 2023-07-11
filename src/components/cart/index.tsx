import { SyntheticEvent, useRef, createRef, useEffect, useState } from "react";
import { Cart } from "../../graphql/cart";
import CartItem from "./item";
import { useRecoilState } from "recoil";
import { checkedCartState } from "../../recoils/cart";
import WillPay from "./willPay";

const CartList = ({ items }: { items: Cart[] }) => {
  const [checkedCartData, setCheckedCartData] =
    useRecoilState(checkedCartState);
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = items.map(() => createRef<HTMLInputElement>());
  const [formData, setFormData] = useState<FormData>();

  const setAllcheckedFromItems = () => {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const selectedCount = data.getAll("select-item").length;
    const allchecked = selectedCount === items.length;
    formRef.current.querySelector<HTMLInputElement>(
      ".cart_select-all"
    )!.checked = allchecked;
  };

  const setItemsCheckedFromAll = (targetInput: HTMLInputElement) => {
    const allchecked = targetInput.checked;
    checkboxRefs.forEach((inputElem) => {
      inputElem.current!.checked = allchecked;
    });
  };

  const handleCheckboxChanged = (e?: SyntheticEvent) => {
    if (!formRef.current) return;
    const targetInput = e?.target as HTMLInputElement;
    if (targetInput && targetInput.classList.contains("cart_select-all")) {
      setItemsCheckedFromAll(targetInput);
    } else {
      setAllcheckedFromItems();
    }
    const data = new FormData(formRef.current);
    setFormData(data);
  };

  useEffect(() => {
    checkedCartData.forEach((item) => {
      const itemRef = checkboxRefs.find(
        (ref) => ref.current!.dataset.id === item.id
      );
      if (itemRef) itemRef.current!.checked = true;
    });
    setAllcheckedFromItems();
  }, []);

  useEffect(() => {
    const checkedItems = checkboxRefs.reduce<Cart[]>((res, ref, i) => {
      if (ref.current!.checked) res.push(items[i]);
      return res;
    }, []);
    setCheckedCartData(checkedItems);
  }, [items, formData]);

  return (
    <div>
      <form ref={formRef} onChange={handleCheckboxChanged}>
        <label>
          <input
            className="cart_select-all"
            name="select-all"
            type="checkbox"
          />
          전체선택
        </label>
        <ul className="cart">
          {items.map((item, i) => (
            <CartItem {...item} key={item.id} ref={checkboxRefs[i]} />
          ))}
        </ul>
      </form>
      <WillPay />
    </div>
  );
};

export default CartList;
