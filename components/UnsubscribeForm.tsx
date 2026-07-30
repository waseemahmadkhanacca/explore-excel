'use client';

import { useEffect, useState } from 'react';

type State = 'idle' | 'working' | 'done' | 'error' | 'no-token';

export default function UnsubscribeForm() {
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token');
    if (!t) {
      setState('no-token');
      return;
    }
    setToken(t);
  }, []);

  async function confirm() {
    setState('working');
    try {
      const res = await fetch(`/api/unsubscribe/?token=${encodeURIComponent(token)}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setState('done');
      } else {
        setState('error');
        setMessage(data.error ?? 'Something went wrong.');
      }
    } catch {
      setState('error');
      setMessage('Could not reach the server. Please try again.');
    }
  }

  if (state === 'no-token') {
    return (
      <>
        <p className="lede">This link is missing its token.</p>
        <p>
          Use the unsubscribe link at the bottom of any email we have sent you. If you no
          longer have one, reply to any of our emails and we will remove you by hand.
        </p>
      </>
    );
  }

  if (state === 'done') {
    return (
      <>
        <p className="lede">Done. You will not hear from us again.</p>
        <p>
          Your address has been marked as unsubscribed. Nothing further will be sent. The
          formula library and templates remain free to use without an account.
        </p>
      </>
    );
  }

  return (
    <>
      <p className="lede">
        One click and you are off the list. No survey, no talking you out of it.
      </p>
      {state === 'error' && <div className="ai-err">{message}</div>}
      <button
        type="button"
        className="btn btn-p"
        style={{ marginTop: 18 }}
        onClick={confirm}
        disabled={state === 'working'}
      >
        {state === 'working' ? 'Working…' : 'Confirm unsubscribe'}
      </button>
    </>
  );
}
