import { Suspense } from 'react';
import ClientWrapper from './ClientWrapper';

export const dynamic = 'force-dynamic';

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="h-full w-full max-w-[1100px] mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 w-1/4 rounded"></div>
            <div className="h-[600px] bg-gray-200 rounded-3xl"></div>
          </div>
        </div>
      </div>
    }>
      <ClientWrapper />
    </Suspense>
  );
}
