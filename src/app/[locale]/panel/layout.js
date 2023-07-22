import { Suspense } from "react";
import { Loader } from "@components/Loader/loader";
import {Header} from "@components/Header/Header";
export default function Layout({ children }) {
  return <Suspense fallback={<Loader />}>
    <Header />
    {children}
  </Suspense>;
}
