import LandingPageClient from './page.client';
import { headers } from 'next/headers';

export default async function LandingPage() {
  const headersList = await headers();
  const userHeader = headersList.get('x-user-payload');

  let user = null;
  if (userHeader) {
    // Décodage du Base64 injecté par le middleware
    user = JSON.parse(Buffer.from(userHeader, 'base64').toString('utf-8'));
  }

  return (
    <LandingPageClient />
  );
}
