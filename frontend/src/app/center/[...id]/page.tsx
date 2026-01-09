import { Center, User, Review } from '@/types';
import { getCenter, getCurrentUser } from '@/lib/mockData';
import CenterDetailsClient from './page.client';

interface CenterDetailsProps {
  params: Promise<{ id: string }>
}

export default async function CenterDetails({ params }: CenterDetailsProps) {

  const { id } = await params

  return (
    <CenterDetailsClient idCenter={id[0]} />
  );
}
