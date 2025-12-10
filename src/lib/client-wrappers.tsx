"use client";

import { Suspense, ComponentType } from 'react';
import { Loader2 } from "lucide-react";

export function withClientNavigation<P extends object>(
  Component: ComponentType<P>, 
  LoadingComponent: ComponentType = () => (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
) {
  return function ClientNavigationWrapper(props: P) {
    return (
      <Suspense fallback={<LoadingComponent />}>
        <Component {...props} />
      </Suspense>
    );
  };
}
