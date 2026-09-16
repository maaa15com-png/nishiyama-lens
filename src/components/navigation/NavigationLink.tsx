"use client";

import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { navigationHref, queryFromParams } from "@/lib/language";

type Props = { href: string; className?: string; children: ReactNode };
function QueryLink(props: Props) {
  const params = useSearchParams();
  return <Link {...props} href={navigationHref(props.href, queryFromParams(params))} />;
}

// not-found pages have no searchParams prop; keep their recovery links localized.
export default function NavigationLink(props: Props) {
  return <Suspense fallback={<Link {...props} />}><QueryLink {...props} /></Suspense>;
}
