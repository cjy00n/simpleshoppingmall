import { gql } from "graphql-tag";

export type Product = {
  id: string;
  imageUrl: string;
  price: number;
  title: string;
  description: string;
  createdAt: number;
};
export type MutableProduct = Pick<
  Product,
  "title" | "imageUrl" | "price" | "description"
>;

export type Products = {
  products: Product[];
};

export const GET_PRODUCTS = gql`
  query GET_PRODUCTS($cursor: ID, $showDeleted: Boolean) {
    products(cursor: $cursor, showDeleted: $showDeleted) {
      id
      imageUrl
      price
      title
      description
      createdAt
    }
  }
`;

export const GET_PRODUCT = gql`
  query GET_PRODUCT($id: ID!) {
    product(id: $id) {
      id
      imageUrl
      price
      title
      description
      createdAt
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation ADD_PRODUCT(
    $title: String!
    $imageUrl: String!
    $price: Int!
    $description: String!
  ) {
    addProduct(
      title: $title
      imageUrl: $imageUrl
      price: $price
      description: $description
    ) {
      id
      imageUrl
      price
      title
      description
      createdAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UPDATE_PRODUCT(
    $id: ID!
    $title: String
    $imageUrl: String
    $price: Int
    $description: String
  ) {
    updateProduct(
      id: $id
      title: $title
      imageUrl: $imageUrl
      price: $price
      description: $description
    ) {
      id
      imageUrl
      price
      title
      description
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DELETE_PRODUCT($id: ID!) {
    deleteProduct(id: $id)
  }
`;
