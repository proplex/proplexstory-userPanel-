import { Suspense } from 'react';
import HomePageContent from './HomePageContent';
import ProjectsSkeleton from '@/assets/skeleton/Projects';

export default function HomePage() {
  return (
    <Suspense fallback={<ProjectsSkeleton />}>
      <HomePageContent />
    </Suspense>
  );
}
