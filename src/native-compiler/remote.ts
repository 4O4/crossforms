import { createWriteStream, readFileSync } from 'fs-extra';
import * as SSH from 'node-ssh';
import { basename } from 'path';
import { fileSync as tmpFile } from 'tmp';

import { IApplicationServerConnectionData } from '../configuration';
import {
  convertParams,
  INativeCompiler,
  INativeCompilerResult,
  IOptionalParams,
  IParams,
} from '../native-compiler';

export class RemoteNativeCompiler implements INativeCompiler {
  private executableName: string;

  constructor(
    private appServerConnectionData: IApplicationServerConnectionData
  ) {
    this.executableName =
      appServerConnectionData.platform === 'win32'
        ? 'frmcmp.exe'
        : 'frmcmp_batch.sh';
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

    const intermediateFileBaseName = basename(intermediateFile.name);
    const intermediateFileRemotePath = `/tmp/${intermediateFileBaseName}`;

    const outputFileBaseName = basename(outputFile.name);
    const outputFileRemotePath = `/tmp/${outputFileBaseName}`;

    const finalParams: IParams = {
      module: intermediateFileRemotePath,
      outputFile: outputFileRemotePath,
      userid,
      ...params,
    };

    const remoteCompilerCommand = this.prepareCommand(
      `${this.executableName} ${convertParams(finalParams).join(' ')}`
    );

    const ssh = new SSH();

    await ssh.connect({
      agent: this.appServerConnectionData.agent,
      host: this.appServerConnectionData.host,
      passphrase: this.appServerConnectionData.passphrase,
      port: this.appServerConnectionData.port,
      privateKey: this.appServerConnectionData.privateKey,
      username: this.appServerConnectionData.user,
    });

    await ssh.putFile(intermediateFile.name, intermediateFileRemotePath);
    await ssh.execCommand(remoteCompilerCommand);
    await ssh.getFile(outputFile.name, outputFileRemotePath);

    ssh.dispose();

    return {
      outputFile: readFileSync(outputFile.name),
    };
  }

  private prepareCommand(command: string) {
    const manuallyInitSessionAndSwallowMOTD = `source $HOME/.bash_profile 2>&1 >/dev/null`;
    return `${manuallyInitSessionAndSwallowMOTD}; ${command};`;
  }
}
