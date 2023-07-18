import { DBfield, writeDB } from "../dbController";
import { Products, Resolver } from "./type";
import { v4 as uuid } from "uuid";

const setJSON = (data: Products) => writeDB(DBfield.PRODUCTS, data);

const productResolver: Resolver = {
  Query: {
    products: (parent, { cursor = "", showDeleted = false }, { db }) => {
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
      return filteredDB.slice(fromIndex, fromIndex + 15) || [];
    },
    product: (parent, { id }, { db }) => {
      const found = db.products.find((item) => item.id === id);
      if (found) return found;
      return null;
    },
  },
  Mutation: {
    addProduct: (parent, { imageUrl, price, title, description }, { db }) => {
      const newProduct = {
        id: uuid(),
        price,
        imageUrl,
        title,
        description,
        createdAt: Date.now(),
      };
      db.products.push(newProduct);
      setJSON(db.products);
      return newProduct;
    },
    updateProduct: (parent, { id, ...data }, { db }) => {
      const existProductIndex = db.products.findIndex((item) => item.id === id);
      if (existProductIndex < 0) {
        throw new Error("존재하지 않는 상품입니다.");
      }
      const updateItem = {
        ...db.products[existProductIndex],
        ...data,
      };
      db.products.splice(existProductIndex, 1, updateItem);
      setJSON(db.products);
      return updateItem;
    },
    deleteProduct: (parent, { id }, { db }) => {
      const existProductIndex = db.products.findIndex((item) => item.id === id);
      if (existProductIndex < 0) {
        throw new Error("존재하지 않는 상풉입니다.");
      }
      const deleteItem = {
        ...db.products[existProductIndex],
      };
      delete deleteItem.createdAt;
      db.products.splice(existProductIndex, 1, deleteItem);
      setJSON(db.products);
      return id;
    },
  },
};

export default productResolver;
