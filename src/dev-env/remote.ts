import { platform } from 'os';

import { IDatabaseConnectionData, IDevEnv } from '.';
import { ICompiler } from '../compilers';
import { IApplicationServerConnectionData } from '../configuration';
import { IConverter, LibraryConverter } from '../converters';
import {
  INativeCompiler,
  ModuleType,
  RemoteNativeCompiler,
} from '../native-compiler';

export class RemoteDevEnv implements IDevEnv {
  private nativeCompiler: INativeCompiler;
  private libraryConverter: IConverter;

  constructor(
    appServerConnectionData: IApplicationServerConnectionData,
    databaseConnectionData: IDatabaseConnectionData
  ) {
    if (!['linux', 'win32'].includes(appServerConnectionData.platform)) {
      throw new Error(
        `Unsupported platform: ${appServerConnectionData.platform}`
      );
    }

    this.nativeCompiler = new RemoteNativeCompiler(appServerConnectionData);
    this.libraryConverter = new LibraryConverter(
      this.nativeCompiler,
      databaseConnectionData
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
