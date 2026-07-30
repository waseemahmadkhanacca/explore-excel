import type { Metadata } from 'next';
import UnsubscribeForm from '@/components/UnsubscribeForm';

export const metadata: Metadata = {
  title: 'Unsubscribe',
  description: 'Stop receiving emails from Explore Excel.',
  robots: { index: false, follow: false },
};

export default function UnsubscribePage() {
  return (
    <div className="prose-wrap" style={{ maxWidth: 560 }}>
      <span className="sec-lab">Email</span>
      <h1>Unsubscribe</h1>
      <UnsubscribeForm />
    </div>
  );
}
