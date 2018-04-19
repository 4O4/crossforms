import { IConverter } from '.';
import { IDatabaseConnectionData } from '../dev-env';
import { INativeCompiler, ModuleType, WindowState } from '../native-compiler';

export class LibraryConverter implements IConverter {
  constructor(
    private nativeCompiler: INativeCompiler,
    private connectionData: IDatabaseConnectionData
  ) {}

  public async textToBinary(file: Buffer | string): Promise<Buffer> {
    const result = await this.nativeCompiler.spawn(file, this.getUserid(), {
      batch: true,
      moduleType: ModuleType.Library,
      parse: true,
      windowState: WindowState.Minimize,
    });

    return result.outputFile;
  }

  private getUserid() {
    return `${this.connectionData.user}/${this.connectionData.password}@${
      this.connectionData.database
    }`;
  }
}
