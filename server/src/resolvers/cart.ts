import { DBfield, writeDB } from "../dbController";
import { Cart, Resolver } from "./type";

const setJSON = (data: Cart) => writeDB(DBfield.CART, data);

const cartResolver: Resolver = {
  Query: {
    cart: (parent, args, { db }) => {
      return db.cart;
    },
  },
  Mutation: {
    addCart: (parent, { id }, { db }) => {
      if (!id) throw Error("상품 id가 없습니다.");
      const targetProduct = db.products.find((item) => item.id === id);

      if (!targetProduct) {
        throw new Error("상품이 없습니다.");
      }

      const existCartItemIndex = db.cart.findIndex((item) => item.id === id);
      if (existCartItemIndex > -1) {
        // 카트에 이미 있으면
        const newCartItem = {
          id,
          amount: db.cart[existCartItemIndex].amount + 1,
        };
        db.cart.splice(existCartItemIndex, 1, newCartItem);
        setJSON(db.cart);
        return newCartItem;
      }

      const newItem = {
        id,
        amount: 1,
      };
      db.cart.push(newItem);
      setJSON(db.cart);
      return newItem;
    },
    updateCart: (parent, { id, amount }, { db }) => {
      const existCartItemIndex = db.cart.findIndex((item) => item.id === id);
      if (existCartItemIndex < 0) {
        throw new Error("없는 데이터입니다.");
      }

      const newCartItem = {
        id,
        amount: amount,
      };

      db.cart.splice(existCartItemIndex, 1, newCartItem);
      setJSON(db.cart);
      return newCartItem;
    },
    deleteCart: (parent, { id }, { db }) => {
      const existCartItemIndex = db.cart.findIndex((item) => item.id === id);
      if (existCartItemIndex < 0) {
        throw new Error("없는 데이터입니다.");
      }
      db.cart.splice(existCartItemIndex, 1);
      setJSON(db.cart);
      return id;
    },
    executePay: (parent, { ids }, { db }) => {
      const newCartData = db.cart.filter(
        (cartItem) => !ids.includes(cartItem.id)
      );
      db.cart = newCartData;
      setJSON(db.cart);
      return ids;
    },
  },
  CartItem: {
    product: (cartItem, args, { db }) => {
      return db.products.find((product) => product.id === cartItem.id);
    },
  },
};

export default cartResolver;
