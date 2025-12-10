import { Suspense } from "react";
import Custom404 from "@/pages/404";

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Custom404 />
    </Suspense>
  );
}
