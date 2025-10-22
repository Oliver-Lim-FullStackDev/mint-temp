import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CONFIG_PATH = resolve(process.cwd(), 'src/modules/games/minty-spins/config.json');
const MintySpinsConfig = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
export { MintySpinsConfig };
