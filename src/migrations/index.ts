import * as migration_20260411_213809 from './20260411_213809';
import * as migration_20260503_035218 from './20260503_035218';
import * as migration_20260503_132625 from './20260503_132625';
import * as migration_20260505_204635_add_seo_and_backup_config from './20260505_204635_add_seo_and_backup_config';
import * as migration_20260615_180039_add_pages_and_navigation from './20260615_180039_add_pages_and_navigation';
import * as migration_20260615_195217_add_new_page_blocks from './20260615_195217_add_new_page_blocks';

export const migrations = [
  {
    up: migration_20260411_213809.up,
    down: migration_20260411_213809.down,
    name: '20260411_213809',
  },
  {
    up: migration_20260503_035218.up,
    down: migration_20260503_035218.down,
    name: '20260503_035218',
  },
  {
    up: migration_20260503_132625.up,
    down: migration_20260503_132625.down,
    name: '20260503_132625',
  },
  {
    up: migration_20260505_204635_add_seo_and_backup_config.up,
    down: migration_20260505_204635_add_seo_and_backup_config.down,
    name: '20260505_204635_add_seo_and_backup_config',
  },
  {
    up: migration_20260615_180039_add_pages_and_navigation.up,
    down: migration_20260615_180039_add_pages_and_navigation.down,
    name: '20260615_180039_add_pages_and_navigation',
  },
  {
    up: migration_20260615_195217_add_new_page_blocks.up,
    down: migration_20260615_195217_add_new_page_blocks.down,
    name: '20260615_195217_add_new_page_blocks'
  },
];
