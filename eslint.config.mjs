import globals from 'globals';
import neostandard from 'neostandard';
import solid from 'eslint-plugin-solid';

export default [
  ...neostandard({ ts: true, semi: true, globals: globals.browser, ignores: ['.yarn/*', '.pnp.*'] }),
  solid.configs['flat/recommended'],
];
