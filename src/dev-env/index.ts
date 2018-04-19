import { ICompiler } from '../compilers';
import { IConverter } from '../converters';
import { ModuleType } from '../native-compiler';

export * from './local';
export * from './remote';

export interface IDatabaseConnectionData {
  database: string;
  user: string;
  password: string;
}

export interface IDevEnv {
  getConverter(type: ModuleType): IConverter;
  getCompiler(type: ModuleType): ICompiler;
}
