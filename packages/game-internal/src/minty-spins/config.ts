import { readFileSync } from 'fs';
import path from 'path';

import type { SlotGameConfig } from './types';

const CONFIG_PATH = path.resolve(
  __dirname,
  '../../../../games/slots/minty-spins/config.json',
);

const configBuffer = readFileSync(CONFIG_PATH, 'utf-8');

export const MintySpinsConfig = JSON.parse(configBuffer) as SlotGameConfig;
