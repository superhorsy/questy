import { Suspense } from "react";
import { Loader } from "@components/Loader/loader";
export default function SignInLayout({ children }) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
}