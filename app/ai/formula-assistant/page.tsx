import type { Metadata } from 'next';
import AssistantForm from '@/components/AssistantForm';

export const metadata: Metadata = {
  title: 'AI formula assistant',
  description:
    'Describe what you need in plain English and get a working Excel formula back, explained, with the failure modes to watch for.',
  alternates: { canonical: '/ai/formula-assistant/' },
};

export default function AssistantPage() {
  return (
    <div className="ai-wrap">
      <span className="sec-lab">AI formula assistant</span>
      <h1 style={{ fontSize: 40, letterSpacing: '-0.03em', margin: '0 0 14px' }}>
        Describe it. Get the formula.
      </h1>
      <p style={{ fontSize: 18, color: 'var(--ink-600)', marginBottom: 30 }}>
        Say what you are trying to do in plain English. You get a working formula, a short
        explanation, and the one thing most likely to break it.
      </p>
      <AssistantForm />
    </div>
  );
}
