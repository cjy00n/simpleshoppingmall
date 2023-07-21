import { DBfield, writeDB } from "../dbController";
import { Products, Resolver } from "./type";
import { v4 as uuid } from "uuid";
import { db } from "../../firebase";
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
const PAGE_SIZE = 15;

const setJSON = (data: Products) => writeDB(DBfield.PRODUCTS, data);

const productResolver: Resolver = {
  Query: {
    products: async (
      parent,
      { cursor = "", showDeleted = false } /*{ db }*/
    ) => {
      const products = collection(db, "products");
      const queryOptions: any[] = [orderBy("createdAt", "desc")];
      const cursors: (string | undefined)[] = [];
      const snapshots = [];
      if (cursors) {
        queryOptions.push(startAfter(cursors));
      }
      if (!showDeleted) {
        queryOptions.unshift(where("createdAt", "!=", null));
      }

      const q = query(products, ...queryOptions, limit(PAGE_SIZE));

      const snapshot = await getDocs(q);
      const data: DocumentData[] = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      console.log(data);
      return data;
      /*
      const [hasCreatedAt, noCreatedAt] = [
        db.products
          .filter((product) => !!product.createdAt)
          .sort((a, b) => b.createdAt! - a.createdAt!),
        db.products.filter((product) => !product.createdAt),
      ];
      const filteredDB = showDeleted
        ? [...hasCreatedAt, ...noCreatedAt]
        : hasCreatedAt;
      const fromIndex =
        filteredDB.findIndex((product) => product.id === cursor) + 1;
      return filteredDB.slice(fromIndex, fromIndex + 15) || [];*/
    },
    product: async (parent, { id }) => {
      const snapshot = await getDoc(doc(db, "products", id));
      return {
        ...snapshot.data(),
        id: snapshot.id,
      };
      // const found = db.products.find((item) => item.id === id);
      // if (found) return found;
      // return null;
    },
  },
  Mutation: {
    addProduct: async (parent, { imageUrl, price, title, description }) => {
      const newProduct = {
        price,
        imageUrl,
        title,
        description,
        createdAt: serverTimestamp(),
      };
      const result = await addDoc(collection(db, "products"), newProduct);
      const snapshot = await getDoc(result);
      return {
        ...snapshot.data(),
        id: snapshot.id,
      };

      // db.products.push(newProduct);
      // setJSON(db.products);
      // return newProduct;
    },
    updateProduct: async (parent, { id, ...data }) => {
      const productRef = doc(db, "products", id);
      if (!productRef) throw new Error("존재하지 않는 상품입니다.");
      await updateDoc(productRef, data);
      const snap = await getDoc(productRef);
      return {
        ...snap.data(),
        id: snap.id,
      };
      // const existProductIndex = db.products.findIndex((item) => item.id === id);
      // if (existProductIndex < 0) {
      //   throw new Error("존재하지 않는 상품입니다.");
      // }
      // const updateItem = {
      //   ...db.products[existProductIndex],
      //   ...data,
      // };
      // db.products.splice(existProductIndex, 1, updateItem);
      // setJSON(db.products);
      // return updateItem;
    },
    deleteProduct: async (parent, { id }) => {
      const productRef = doc(db, "products", id);
      if (!productRef) throw new Error("존재하지 않는 상풉입니다.");
      await updateDoc(productRef, { createdAt: null });
      return id;
      // const existProductIndex = db.products.findIndex((item) => item.id === id);
      // if (existProductIndex < 0) {
      //   throw new Error("존재하지 않는 상풉입니다.");
      // }
      // const deleteItem = {
      //   ...db.products[existProductIndex],
      // };
      // delete deleteItem.createdAt;
      // db.products.splice(existProductIndex, 1, deleteItem);
      // setJSON(db.products);
      // return id;
    },
  },
};

export default productResolver;
