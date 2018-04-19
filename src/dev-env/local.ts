import { platform } from 'os';

import { IDatabaseConnectionData, IDevEnv } from '.';
import { ICompiler } from '../compilers';
import { IConverter, LibraryConverter } from '../converters';
import {
  INativeCompiler,
  LocalNativeCompiler,
  ModuleType,
} from '../native-compiler';

export class LocalDevEnv implements IDevEnv {
  private nativeCompiler: INativeCompiler;
  private libraryConverter: IConverter;

  constructor(connectionData: IDatabaseConnectionData) {
    const currentPlatform = platform();

    if (!['linux', 'win32'].includes(currentPlatform)) {
      throw new Error(`Unsupported platform: ${currentPlatform}`);
    }

    this.nativeCompiler = new LocalNativeCompiler(currentPlatform);
    this.libraryConverter = new LibraryConverter(
      this.nativeCompiler,
      connectionData
    );
  }

  public getConverter(type: ModuleType): IConverter {
    switch (type) {
      case ModuleType.Library:
        return this.libraryConverter;
      default:
        throw new Error('Unsupported module type');
    }
  }

  public getCompiler(type: ModuleType): ICompiler {
    throw new Error('Method not implemented.');
  }
}
