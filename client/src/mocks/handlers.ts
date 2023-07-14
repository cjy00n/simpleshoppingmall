import { graphql } from "msw";
import { GET_PRODUCTS, GET_PRODUCT } from "../graphql/products";
import {
  ADD_CART,
  Cart,
  DELETE_CART,
  GET_CART,
  UPDATE_CART,
} from "../graphql/cart";
import { EXECUTE_PAY } from "../graphql/payment";

const mockProducts = Array.from({ length: 20 }).map((_, i) => ({
  id: `${i + 1}`,
  imageUrl: `https://picsum.photos/id/${i * 20}/200/150`,
  price: 50000,
  title: `임시상품${i + 1}`,
  description: `임시상세내용${i + 1}`,
  createdAt: new Date(1654567890123 + i * 1000 * 60 * 60 * 24).toString(),
}));

let cartData: { [key: string]: Cart } = {};

export const handlers = [
  graphql.query(GET_PRODUCTS, (req, res, ctx) => {
    return res(
      ctx.data({
        products: mockProducts,
      })
    );
  }),

  graphql.query(GET_PRODUCT, (req, res, ctx) => {
    const targetProduct = mockProducts.find(
      (item) => item.id === req?.variables.id
    );
    if (targetProduct) return res(ctx.data(targetProduct));
    return res(ctx.data(mockProducts[0]));
  }),

  graphql.query(GET_CART, (req, res, ctx) => {
    return res(ctx.data(cartData));
  }),

  graphql.mutation(ADD_CART, (req, res, ctx) => {
    const newCartData = { ...cartData };
    const id = req.variables.id;
    const targetProduct = mockProducts.find(
      (item) => item.id === req?.variables.id
    );

    if (!targetProduct) {
      throw new Error("상품이 없습니다.");
    }

    const newItem = {
      ...targetProduct,
      amount: (newCartData[id]?.amount || 0) + 1,
    };
    newCartData[id] = newItem;
    cartData = newCartData;

    return res(ctx.data(newItem));
  }),

  graphql.mutation(UPDATE_CART, (req, res, ctx) => {
    const newCartData = { ...cartData };
    const { id, amount } = req.variables;
    if (!newCartData[id]) {
      throw new Error("없는 데이터입니다.");
    }
    const newItem = {
      ...newCartData[id],
      amount,
    };
    newCartData[id] = newItem;
    cartData = newCartData;
    return res(ctx.data(newItem));
  }),

  graphql.mutation(DELETE_CART, (req, res, ctx) => {
    const id = req.variables.id;
    const newCartData = { ...cartData };
    delete newCartData[id];
    cartData = newCartData;
    return res(ctx.data(id));
  }),

  graphql.mutation(EXECUTE_PAY, ({ variables: ids }, res, ctx) => {
    ids.forEach((id: string) => {
      delete cartData[id];
    });
    return res(ctx.data(ids));
  }),
];
