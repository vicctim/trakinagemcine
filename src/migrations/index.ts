import * as migration_20260411_213809 from './20260411_213809';
import * as migration_20260503_035218 from './20260503_035218';

export const migrations = [
  {
    up: migration_20260411_213809.up,
    down: migration_20260411_213809.down,
    name: '20260411_213809',
  },
  {
    up: migration_20260503_035218.up,
    down: migration_20260503_035218.down,
    name: '20260503_035218'
  },
];
