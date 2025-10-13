'use client';

import ReactJson from 'react-json-view';
import { useSession } from '@/modules/account/session-store';


export default function SessionInfo() {
  const { loading, error, session } = useSession();

  if (loading) return <p>Loading session...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!session) return <p>NO SESSION</p>;

  return (
    <div style={{ whiteSpace: 'pre-wrap', margin: '0 auto' }}>
      <ReactJson
      style={{borderRadius: "24px"}}
        src={session}
        theme="codeschool"
        collapsed={false}
        enableClipboard={true}
      />
    </div>
  );
}
