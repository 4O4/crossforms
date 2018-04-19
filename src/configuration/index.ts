import { IDatabaseConnectionData } from '..';

export * from './storage';

export const enum DevEnvironmentType {
  Local = 'local',
  Remote = 'remote',
}

export const enum ApplicationServerConnectionType {
  SSH = 'ssh',
}

export interface IApplicationServerConnectionData {
  type: ApplicationServerConnectionType;
  platform: NodeJS.Platform;
  host: string;
  port: number;
  user: string;
  password?: string;
  passphrase?: string;
  privateKey?: string;
  agent?: string;
}

export interface IDevEnvironmentConfig {
  type: DevEnvironmentType;
  applicationServerConnection?: string;
  databaseConnection: string;
}

export interface IConfig {
  devEnvironments: {
    [key: string]: IDevEnvironmentConfig;
  };
  databaseConnections: {
    [key: string]: IDatabaseConnectionData;
  };
  applicationServerConnections: {
    [key: string]: IApplicationServerConnectionData;
  };
  defaultDevEnvironment?: string;
}
