import type { BotCommand } from '../types';
import pingCommand from './ping';
import updateCommand from './update';

const commands = [
  pingCommand,
  updateCommand
] as BotCommand[];

export default commands;
