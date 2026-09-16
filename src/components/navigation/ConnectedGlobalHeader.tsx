"use client";

import { usePathname, useSearchParams } from "next/navigation";
import GlobalHeader from "./GlobalHeader";
import { parseLang, queryFromParams } from "@/lib/language";

export default function ConnectedGlobalHeader() {
  const path = usePathname();
  const params = useSearchParams();
  const query = queryFromParams(params);
  // Reset only the menu when the URL changes, never the diagnosis or page.
  return <GlobalHeader key={path + "?" + params.toString()} path={path} query={query} lang={parseLang(query.lang)} />;
}
