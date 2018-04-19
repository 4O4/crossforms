export const enum ProgramUnitType {
  PackageSpecification,
  PackageBody,
  Procedure,
  Other,
}

export interface IProgramUnit {
  type: ProgramUnitType;
  code: string;
}

export function determineProgramUnitType(codeOrPath: string): ProgramUnitType {
  if (isPath(codeOrPath)) {
    return determineProgramUnitTypeByFileExtension(codeOrPath);
  } else {
    return determineProgramUnitTypeByFileContents(codeOrPath);
  }
}

function determineProgramUnitTypeByFileExtension(
  path: string
): ProgramUnitType {
  if (path.endsWith('.pks')) {
    return ProgramUnitType.PackageSpecification;
  } else if (path.endsWith('.pkb')) {
    return ProgramUnitType.PackageBody;
  } else if (path.endsWith('.pls')) {
    return ProgramUnitType.Procedure;
  }

  return ProgramUnitType.Other;
}

function determineProgramUnitTypeByFileContents(code: string): ProgramUnitType {
  if (/package\sbody\s[a-z_\$0-9]\s(i|a)s/gim.test(code)) {
    return ProgramUnitType.PackageBody;
  } else if (/package\s[a-z_\$0-9]\s(i|a)s/gim.test(code)) {
    return ProgramUnitType.PackageSpecification;
  } else if (/procedure\s[a-z_\$0-9]\s(i|a)s/gim.test(code)) {
    return ProgramUnitType.Procedure;
  }

  return ProgramUnitType.Other;
}

function isPath(str: string) {
  return str.split('\n').length === 1;
}
