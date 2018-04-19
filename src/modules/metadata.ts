import { ModuleType } from '../native-compiler';

export interface IModuleDependencies {
  libraries: string[];
}

export interface IModuleMetadata {
  name: string;
  type: ModuleType;
  dependencies: IModuleDependencies;
  outDir: string;
  rootDir: string;
  include: string[];
  exclude: string[];
}
