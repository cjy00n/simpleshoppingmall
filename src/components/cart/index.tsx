import { SyntheticEvent, useRef, createRef, forwardRef } from "react";
import { Cart } from "../../graphql/cart";
import CartItem from "./item";

const CartList = ({ items }: { items: Cart[] }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = items.map(() => createRef<HTMLInputElement>());

  const handleCheckboxChanged = (e: SyntheticEvent) => {
    if (!formRef.current) return;
    const targetInput = e.target as HTMLInputElement;
    const data = new FormData(formRef.current);
    const selectedCount = data.getAll("select-item").length;
    if (targetInput.classList.contains("cart_select-all")) {
      const allchecked = targetInput.checked;
      checkboxRefs.forEach((inputElem) => {
        inputElem.current!.checked = allchecked;
      });
    } else {
      const allchecked = selectedCount === items.length;
      formRef.current.querySelector<HTMLInputElement>(
        ".cart_select-all"
      )!.checked = allchecked;
    }
  };

  return (
    <form ref={formRef} onChange={handleCheckboxChanged}>
      <label>
        <input className="cart_select-all" name="select-all" type="checkbox" />
        전체선택
      </label>
      <ul className="cart">
        {items.map((item, i) => (
          <CartItem {...item} key={item.id} ref={checkboxRefs[i]} />
        ))}
      </ul>
    </form>
  );
};

export default CartList;
