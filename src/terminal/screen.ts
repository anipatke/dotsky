import { stdout } from 'node:process';

export function enterScreen() {
  stdout.write('\u001B[?1049h');
}

export function exitScreen() {
  stdout.write('\u001B[?1049l');
}