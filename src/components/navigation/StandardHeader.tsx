import { Suspense } from "react";
import ConnectedGlobalHeader from "./ConnectedGlobalHeader";

export default function StandardHeader() {
  return <Suspense fallback={<div aria-hidden="true" className="h-[110px] shrink-0 bg-[#fffdf8] sm:h-[122px]" />}>
    <ConnectedGlobalHeader />
  </Suspense>;
}
