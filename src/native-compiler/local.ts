import { spawnSync } from 'child_process';
import { chmodSync, createWriteStream, readFileSync } from 'fs-extra';
import { resolve } from 'path';
import { fileSync as tmpFile } from 'tmp';
import { sync as which } from 'which';

import {
  convertParams,
  INativeCompiler,
  INativeCompilerResult,
  IOptionalParams,
  IParams,
} from '../native-compiler';

export class LocalNativeCompiler implements INativeCompiler {
  private executablePath: string;

  constructor(platform: NodeJS.Platform) {
    const executableName =
      platform === 'win32' ? 'frmcmp.exe' : 'frmcmp_batch.sh';
    this.executablePath = which(executableName);
  }

  public async spawn(
    file: Buffer | string,
    userid: string,
    params: IOptionalParams
  ): Promise<INativeCompilerResult> {
    const intermediateFile = tmpFile({
      postfix: '.pld',
      prefix: 'crossforms-generated-lib-',
    });
    const outputFile = tmpFile({
      discardDescriptor: true,
      postfix: '.pll',
      prefix: 'crossforms-generated-lib-',
    });

    const stream = createWriteStream(intermediateFile.name, {
      fd: intermediateFile.fd,
    });
    stream.write(file);
    stream.close();

    const finalParams: IParams = {
      module: intermediateFile.name,
      outputFile: outputFile.name,
      userid,
      ...params,
    };

    const process = spawnSync(this.executablePath, convertParams(finalParams));
    // console.log(process);

    if (process.status !== 0) {
      throw new Error(
        `Unable to build PLL. Forms Compiler exited with status ${
          process.status
        }`
      );
    }

    chmodSync(finalParams.outputFile as string, 444);

    return {
      outputFile: readFileSync(finalParams.outputFile as string),
      // status: process.status,
      // stderr: process.stderr,
      // stdout: process.stdout,
    };
  }
}
