export interface ICompiler {
  compile(file: Buffer): Promise<Buffer>;
}
