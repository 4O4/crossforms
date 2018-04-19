import { readFileSync, writeFileSync } from 'fs';
import { ensureDirSync } from 'fs-extra';
import { join } from 'path';
import { isArray, isBuffer } from 'util';

import { IDevEnv } from '../dev-env';
import { ModuleType } from '../native-compiler';
import { IModule } from './module';
import {
  determineProgramUnitType,
  IProgramUnit,
  ProgramUnitType,
} from './program-unit';

export class Library implements IModule {
  private dependencies: string[] = [];
  private programUnits: IProgramUnit[] = [];

  constructor(public name: string) {}

  public addDependency(pathOrName: string) {
    this.dependencies.push(pathOrName);
  }

  public addProgramUnit(data: Buffer | string, type: ProgramUnitType) {
    let code = isBuffer(data) ? data.toString() : data;
    code = code.replace(/\r/gi, '');

    this.programUnits.push({
      code,
      type,
    });
  }

  public importProgramUnit(path: string) {
    const code = readFileSync(path);
    const type = determineProgramUnitType(path);
    this.addProgramUnit(code, type);
  }

  public importProgramUnits(paths: string[]) {
    for (const path of paths) {
      this.importProgramUnit(path);
    }
  }

  public async saveAsBinary(
    destDir: string,
    devEnv: IDevEnv,
    filename?: string
  ) {
    const name = filename || this.name + '.pll';
    ensureDirSync(destDir);
    writeFileSync(join(destDir, name), await this.getROSRepresentation(devEnv));
  }

  public async saveAsText(destDir: string, filename?: string) {
    const name = filename || this.name + '.pld';
    ensureDirSync(destDir);
    writeFileSync(join(destDir, name), this.getTextRepresentation());
  }

  public getTextRepresentation() {
    const chunks = [];

    for (const dependency of this.dependencies) {
      chunks.push(`.attach LIBRARY ${dependency} END NOCONFIRM`);
    }

    this.programUnits.sort((a, b) => {
      if (a.type === ProgramUnitType.PackageSpecification) {
        return -1;
      } else {
        return 1;
      }
    });

    for (const programUnit of this.programUnits) {
      let code = programUnit.code;
      code = code.replace(/xfrm[\.|_]/gim, '');
      code = code.replace(/create or replace (package)/gim, '$1');
      code = code.replace(/create or replace (procedure)/gim, '$1');

      chunks.push(code);
    }

    return chunks.join('\n');
  }

  public async getROSRepresentation(devEnv: IDevEnv) {
    const converter = devEnv.getConverter(ModuleType.Library);
    return converter.textToBinary(this.getTextRepresentation());
  }
}
