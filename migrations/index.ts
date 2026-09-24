import * as migration_20260916_062222 from './20260916_062222';
import * as migration_20260916_084953 from './20260916_084953';
import * as migration_20260916_090228 from './20260916_090228';
import * as migration_20260916_091500 from './20260916_091500';
import * as migration_20260918_101800 from './20260918_101800';
import * as migration_20260918_193000 from './20260918_193000';
import * as migration_20260919_120900 from './20260919_120900';
import * as migration_20260919_140536_add_payload_jobs from './20260919_140536_add_payload_jobs';
import * as migration_20260919_151000 from './20260919_151000';
import * as migration_20260921_185354_add_reset_password_requested_at from './20260921_185354_add_reset_password_requested_at';
import * as migration_20260924_103933 from './20260924_103933';
import * as migration_20260924_104718 from './20260924_104718';
import * as migration_20260924_141917_property_taxonomy from './20260924_141917_property_taxonomy';
import * as migration_20260924_144035_public_url_id from './20260924_144035_public_url_id';
import * as migration_20260924_161945_add_site_settings_global from './20260924_161945_add_site_settings_global';

export const migrations = [
  {
    up: migration_20260916_062222.up,
    down: migration_20260916_062222.down,
    name: '20260916_062222',
  },
  {
    up: migration_20260916_084953.up,
    down: migration_20260916_084953.down,
    name: '20260916_084953',
  },
  {
    up: migration_20260916_090228.up,
    down: migration_20260916_090228.down,
    name: '20260916_090228',
  },
  {
    up: migration_20260916_091500.up,
    down: migration_20260916_091500.down,
    name: '20260916_091500',
  },
  {
    up: migration_20260918_101800.up,
    down: migration_20260918_101800.down,
    name: '20260918_101800',
  },
  {
    up: migration_20260918_193000.up,
    down: migration_20260918_193000.down,
    name: '20260918_193000',
  },
  {
    up: migration_20260919_120900.up,
    down: migration_20260919_120900.down,
    name: '20260919_120900',
  },
  {
    up: migration_20260919_140536_add_payload_jobs.up,
    down: migration_20260919_140536_add_payload_jobs.down,
    name: '20260919_140536_add_payload_jobs',
  },
  {
    up: migration_20260919_151000.up,
    down: migration_20260919_151000.down,
    name: '20260919_151000',
  },
  {
    up: migration_20260921_185354_add_reset_password_requested_at.up,
    down: migration_20260921_185354_add_reset_password_requested_at.down,
    name: '20260921_185354_add_reset_password_requested_at',
  },
  {
    up: migration_20260924_103933.up,
    down: migration_20260924_103933.down,
    name: '20260924_103933',
  },
  {
    up: migration_20260924_104718.up,
    down: migration_20260924_104718.down,
    name: '20260924_104718',
  },
  {
    up: migration_20260924_141917_property_taxonomy.up,
    down: migration_20260924_141917_property_taxonomy.down,
    name: '20260924_141917_property_taxonomy',
  },
  {
    up: migration_20260924_144035_public_url_id.up,
    down: migration_20260924_144035_public_url_id.down,
    name: '20260924_144035_public_url_id',
  },
  {
    up: migration_20260924_161945_add_site_settings_global.up,
    down: migration_20260924_161945_add_site_settings_global.down,
    name: '20260924_161945_add_site_settings_global'
  },
];
