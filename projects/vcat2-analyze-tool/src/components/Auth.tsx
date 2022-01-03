import { Button, TextField } from '@mui/material';
import { useState } from 'react';

type Props = { children: JSX.Element };
const Auth = (props: Props) => {
  const { children } = props;
  const [pass, setPass] = useState('');
  const [authed, setAuthed] = useState(false);
  const correctPassword = process.env['REACT_APP_TOOL_PASSWORD'];
  const simpleAuth = () => {
    if (correctPassword && pass === correctPassword) setAuthed(true);
    else setAuthed(false);
  };
  return (
    <>
      {authed ? (
        children
      ) : (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
          <TextField
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
          <Button onClick={simpleAuth}>簡易認証</Button>
        </div>
      )}
    </>
  );
};

export default Auth;
