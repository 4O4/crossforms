import { sync as glob } from 'glob';
import { join } from 'path';
import { isArray } from 'util';

import { IModule, IModuleMetadata, Library } from '.';
import { ModuleType } from '../native-compiler';

export function createModule(metadata: IModuleMetadata, cwd?: string): IModule {
  if (metadata.type === ModuleType.Library) {
    return createLibrary(metadata, cwd);
  }

  throw new Error('Unsupported module type');
}

function createLibrary(metadata: IModuleMetadata, cwd?: string): Library {
  const lib = new Library(metadata.name);

  if (metadata.dependencies && isArray(metadata.dependencies.libraries)) {
    for (const dependency of metadata.dependencies.libraries) {
      lib.addDependency(dependency);
    }
  }

  let sourcePaths: string[] = [];
  const baseDir = join(cwd || process.cwd(), metadata.rootDir);

  if (isArray(metadata.include)) {
    for (const pattern of metadata.include) {
      const files = glob(pattern, {
        absolute: true,
        cwd: baseDir,
        ignore: metadata.exclude,
      });

      sourcePaths = sourcePaths.concat(files);
    }
  }

  lib.importProgramUnits(sourcePaths);

  return lib;
}
