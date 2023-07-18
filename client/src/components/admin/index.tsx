import { useInfiniteQuery } from "react-query";
import { QueryKeys, graphqlFetcher } from "../../queryClient";
import { GET_PRODUCTS, Products } from "../../graphql/products";
import React, { useEffect, useRef, useState } from "react";
import useInfiniteScroll from "../../hooks/useIntersection";
import AdminItem from "../../components/admin/item";
import AddForm from "../../components/admin/addForm";
import AdminList from "./list";

const Admin = () => {
  const [editingIndex, setEdtingIndex] = useState<number | null>(null);
  const fetchMoreRef = useRef<HTMLDivElement>(null);
  const intersecting = useInfiniteScroll(fetchMoreRef);
  const { data, isSuccess, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<Products>(
      [QueryKeys.PRODUCTS, "admin"],
      ({ pageParam = "" }) =>
        graphqlFetcher<Products>(GET_PRODUCTS, {
          cursor: pageParam,
          showDeleted: true,
        }),
      {
        getNextPageParam: (lastpage, allpages) => {
          return lastpage.products.at(-1)?.id;
        },
      }
    );

  useEffect(() => {
    if (!intersecting || !isSuccess || !hasNextPage || isFetchingNextPage)
      return;
    fetchNextPage();
  }, [intersecting]);

  const startEdit = (index: number) => () => setEdtingIndex(index);
  const doneEdit = () => setEdtingIndex(null);

  return (
    <div>
      <AddForm />
      <AdminList
        list={data?.pages || []}
        editingIndex={editingIndex}
        startEdit={startEdit}
        doneEdit={doneEdit}
      />
      <div ref={fetchMoreRef} />
    </div>
  );
};

export default Admin;
