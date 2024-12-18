// eslint-ignore all
import neostandard from 'neostandard';

export default [
  ...neostandard({ ts: true, semi: true, ignores: ['.yarn/*', '.pnp.*'] }),
  { rules: { '@stylistic/space-before-function-paren': 'off' } }
];
