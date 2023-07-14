import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { getClient } from "../queryClient";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "../scss/index.scss";
import Gnb from "../components/gnb";
import { worker } from "../mocks/browser";
import { RecoilRoot } from "recoil";
const Layout: React.FC = () => {
  const queryClient = getClient();
  if (import.meta.env.DEV) {
    worker.start();
  }
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={"loading..."}>
        <RecoilRoot>
          <Gnb />
          <Outlet />
        </RecoilRoot>
      </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Layout;
