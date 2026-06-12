import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20260610_142039 from './20260610_142039';
import * as migration_20260610_193652_full_schema from './20260610_193652_full_schema';
import * as migration_20260611_133123_seo_fields from './20260611_133123_seo_fields';
import * as migration_20260612_132441_instructors_cpt from './20260612_132441_instructors_cpt';

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20260610_142039.up,
    down: migration_20260610_142039.down,
    name: '20260610_142039',
  },
  {
    up: migration_20260610_193652_full_schema.up,
    down: migration_20260610_193652_full_schema.down,
    name: '20260610_193652_full_schema',
  },
  {
    up: migration_20260611_133123_seo_fields.up,
    down: migration_20260611_133123_seo_fields.down,
    name: '20260611_133123_seo_fields',
  },
  {
    up: migration_20260612_132441_instructors_cpt.up,
    down: migration_20260612_132441_instructors_cpt.down,
    name: '20260612_132441_instructors_cpt'
  },
];
