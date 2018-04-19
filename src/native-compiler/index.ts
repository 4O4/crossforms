export * from './local';
export * from './remote';
export * from './util';

export const enum WindowState {
  Normal = 'Normal',
  Minimize = 'Minimize',
  Maximize = 'Maximize',
}

export const enum ModuleType {
  Form = 'form',
  Menu = 'menu',
  Library = 'library',
}

export interface IParams extends IOptionalParams {
  // Connection data
  userid: string;

  // Input file name
  module: string;
}

export interface IOptionalParams {
  // Module type
  moduleType?: ModuleType;

  // Write output to file
  outputFile?: string;

  // Don't display messages on the screen
  batch?: boolean;

  // Parse script file
  parse?: boolean;

  // Write script file
  script?: boolean;

  // Root window state
  windowState?: WindowState;

  // Show statistics
  statistics?: boolean;

  // Logon to database
  logon?: boolean;

  // Upgrade module to current version
  upgrade?: boolean;

  // Upgrade SQL*Menu 5.0 role information.
  upgradeRoles?: boolean;

  // Version to upgrade (23; 30; 40; 45; or menu 50).
  version?: number;

  // CRT file for version 2.x form upgrade.
  crtFile?: string;

  // Build a runform/runmenu file when upgrading.
  build?: boolean;

  // Add KEY-UP/DOWN triggers during upgrade.
  addTriggers?: boolean;

  // Add NOFAIL keyword to trigger steps.
  nofail?: boolean;

  // Build/Run with debug information.
  debug?: boolean;

  // Compile all PL/SQL code.
  compileAll?: boolean;

  // Strip pl/sql source code from library.
  stripSource?: boolean;

  // Show this help information.
  help?: boolean;

  // Display Options window (on bitmap only).
  optionsScreen?: boolean;

  // Add one character to display width.
  widenFields?: boolean;

  // Print version used to save module.
  printVersion?: boolean;

  // Print Forms Doc report.
  formsDoc?: boolean;
}

export interface INativeCompilerResult {
  outputFile: Buffer;
  // stdout: string;
  // stderr: string;
  // status: number;
}

export interface INativeCompiler {
  spawn(
    file: Buffer | string,
    userid: string,
    params: IOptionalParams
  ): Promise<INativeCompilerResult>;
}
