import { DBfield, writeDB } from "../dbController";
import { Cart, Product, Resolver } from "./type";
import { db } from "../../firebase";
import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const cartResolver: Resolver = {
  Query: {
    cart: async (parent, args) => {
      const cart = collection(db, "cart");
      const cartsnap = await getDocs(cart);
      const data: DocumentData[] = [];
      cartsnap.forEach((doc) => {
        const d = doc.data();
        data.push({ id: doc.id, ...d });
      });
      return data;
    },
  },
  Mutation: {
    addCart: async (parent, { productId }) => {
      if (!productId) throw Error("상품 productId가 없습니다.");
      const productRef = doc(db, "products", productId);
      const cartCollection = collection(db, "cart");
      const exist = (
        await getDocs(
          query(collection(db, "cart"), where("product", "==", productRef))
        )
      ).docs[0];

      let cartRef;
      if (exist) {
        cartRef = doc(db, "cart", exist.id);
        await updateDoc(cartRef, { amount: increment(1) });
      } else {
        cartRef = await addDoc(cartCollection, {
          amount: 1,
          product: productRef,
        });
      }
      const cartSnapshot = await getDoc(cartRef);

      return {
        ...cartSnapshot.data(),
        product: productRef,
        id: cartSnapshot.id,
      };
    },
    updateCart: async (parent, { cartId, amount }) => {
      if (amount < 1) throw new Error("수량은 1이상이어야 합니다.");
      const cartRef = doc(db, "cart", cartId);
      if (!cartRef) throw new Error("장바구니 정보가 없습니다");
      await updateDoc(cartRef, { amount });
      const cartSnapshot = await getDoc(cartRef);

      return {
        ...cartSnapshot.data(),
        id: cartSnapshot.id,
      };
    },
    deleteCart: async (parent, { cartId }) => {
      const cartRef = doc(db, "cart", cartId);
      if (!cartRef) throw new Error("장바구니 정보가 없습니다");
      await deleteDoc(cartRef);
      return cartId;
    },
    executePay: async (parent, { ids }) => {
      const deleted = [];
      for await (const id of ids) {
        const cartRef = doc(db, "cart", id);
        const cartSnapshop = await getDoc(cartRef);
        const cartData = cartSnapshop.data();
        const productRef = cartData?.product;
        if (!productRef) throw new Error("상품 정보가 없습니다.");
        const product = (await getDoc(productRef)).data() as Product;
        if (product.createdAt) {
          await deleteDoc(cartRef);
          deleted.push(id);
        }
      }
      return deleted;
    },
  },
  CartItem: {
    product: async (cartItem, args) => {
      const product = await getDoc(cartItem.product);
      const data = product.data() as any;
      return {
        ...data,
        id: product.id,
      };
    },
  },
};

export default cartResolver;
