// TODO move from tgma and webapp into @mint/ui and re-use from there
import JsonView from '@uiw/react-json-view';
import { githubDarkTheme } from '@uiw/react-json-view/githubDark';
// or: lightTheme/darkTheme/nordTheme/gruvboxTheme/monokaiTheme/vscodeTheme...

import { useSession } from 'src/modules/account/session-store';

export default function SessionInfo() {
  const { loading, error, session } = useSession();

  if (loading) return <p>Loading session...</p>;
  if (error) return <p>Error: {String(error)}</p>;
  if (!session) return <p>NO SESSION</p>;

  return (
    <div style={{ whiteSpace: 'pre-wrap', margin: '0 auto' }}>
      <JsonView
        value={session}
        collapsed={false}
        // enableClipboard (v1) isn't needed in v2 — copy support is built-in.
        style={{ borderRadius: 24, ...githubDarkTheme }}
      />
    </div>
  );
}
