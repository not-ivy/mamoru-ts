import type { BotCommand } from '../types';
import jokeCommand from './joke';
import updateCommand from './update';

const commands = [
  jokeCommand,
  updateCommand,
] as BotCommand[];

export default commands;
