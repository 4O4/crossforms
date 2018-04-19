import { existsSync, readFileSync, readJSONSync } from 'fs-extra';
import { userInfo } from 'os';
import { join } from 'path';
import { IConfig } from '.';

export function getConfigFromLocalFiles(cwd?: string): IConfig {
  const cwdLevelConfigPath = join(cwd || process.cwd(), 'crossforms.json');
  const userLevelConfigPath = join(userInfo().homedir, '.crossformsrc');
  const config: IConfig = {
    applicationServerConnections: {},
    databaseConnections: {},
    devEnvironments: {},
  };

  if (existsSync(userLevelConfigPath)) {
    Object.assign(config, readJSONSync(userLevelConfigPath));
  }

  if (existsSync(cwdLevelConfigPath)) {
    Object.assign(config, readJSONSync(cwdLevelConfigPath));
  }

  return config;
}
