import { createEffect, type JSXElement } from 'solid-js';
import { useUser } from '../../contexts/UserContext';

export default function ProtectedLayout(props: { children?: JSXElement; }) {
  const user = useUser();

  createEffect(() => {
    if (user.loading) return;
    if (!user()) return location.assign('/?error=notsignedin');
  }, []);

  return (
    <>
      {props.children}
    </>
  );
}