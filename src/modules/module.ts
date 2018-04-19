import { IDevEnv } from '../dev-env';
import { ProgramUnitType } from './program-unit';

export interface IModule {
  addDependency(pathOrName: string): void;
  // addProgramUnit(data: Buffer | string, type: ProgramUnitType): void;
  // importProgramUnit(path: string | string[]): void;
  saveAsBinary(
    destDir: string,
    devEnv: IDevEnv,
    filename?: string
  ): Promise<void>;
  saveAsText(destDir: string, filename?: string): Promise<void>;
  getTextRepresentation(): string;
  getROSRepresentation(devEnv: IDevEnv): Promise<Buffer>;
}
