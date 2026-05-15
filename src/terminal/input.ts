export type KeyAction =
  | 'quit'
  | 'toggleLabels'
  | 'toggleMode'
  | 'rotateLeft'
  | 'rotateRight'
  | 'zoomIn'
  | 'zoomOut'
  | 'reset'
  | 'stepForward'
  | 'stepBack'
  | null;

export type InkKey = {
  leftArrow?: boolean;
  rightArrow?: boolean;
};

export function mapKey(input: string, key: InkKey): KeyAction {
  if (input === 'q') return 'quit';
  if (input === 'l') return 'toggleLabels';
  if (input === ' ') return 'toggleMode';
  if (input === '+' || input === '=') return 'zoomIn';
  if (input === '_') return 'zoomOut';
  if (input === '-') return 'zoomOut';
  if (input === 'r') return 'reset';
  if (input === ']') return 'stepForward';
  if (input === '[') return 'stepBack';
  if (key.leftArrow) return 'rotateLeft';
  if (key.rightArrow) return 'rotateRight';
  return null;
}
