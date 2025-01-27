import { useParams } from '@solidjs/router';
import { createResource } from 'solid-js';

export default function GameplayConfig() {
  const params = useParams();
  const [gameplayConfig] = createResource(params['address'], async (address: string) => await (await fetch(`http://${address}/server/configs/gameplay`, { credentials: 'include' })).text());

  return (
    <div>{gameplayConfig()}</div>
  );
}