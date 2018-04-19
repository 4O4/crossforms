export * from './library-converter';

export interface IConverter {
  textToBinary(file: Buffer | string): Promise<Buffer>;
}
