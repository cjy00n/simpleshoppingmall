import { gql } from "graphql-tag";

export const EXECUTE_PAY = gql`
  mutation EXCUTE_PAY($ids: [ID!]) {
    executePay(ids: $ids)
  }
`;
