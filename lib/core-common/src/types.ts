import { Configuration, Stats } from 'webpack';
import { TransformOptions } from '@babel/core';
import { Router } from 'express';

/**
 * ⚠️ This file contains internal WIP types they MUST NOT be exported outside this package for now!
 */
export interface ManagerWebpackOptions {
  configDir: any;
  configType?: string;
  docsMode?: boolean;
  entries: string[];
  refs: Record<string, Ref>;
  uiDll: boolean;
  dll: boolean;
  outputDir?: string;
  cache: boolean;
  previewUrl?: string;
  versionCheck: VersionCheck;
  releaseNotesData: ReleaseNotesData;
  presets: any;
}

interface TypescriptConfig {
  check: boolean;
  reactDocgen: string;
  reactDocgenTypescriptOptions: {
    shouldExtractLiteralValuesFromEnum: boolean;
    shouldRemoveUndefinedFromOptional: boolean;
    propFilter: (prop: any) => boolean;
  };
}

interface CoreConfig {
  builder: 'webpack4' | 'webpack5';
}

export interface Presets {
  apply(
    extension: 'typescript',
    config: TypescriptConfig,
    args: StorybookConfigOptions & { presets: Presets }
  ): Promise<TransformOptions>;
  apply(extension: 'babel', config: {}, args: any): Promise<TransformOptions>;
  apply(extension: 'entries', config: [], args: any): Promise<unknown>;
  apply(extension: 'stories', config: [], args: any): Promise<unknown>;
  apply(
    extension: 'webpack',
    config: {},
    args: { babelOptions?: TransformOptions } & any
  ): Promise<Configuration>;
  apply(extension: 'managerEntries', config: [], args: any): Promise<string[]>;
  apply(extension: 'refs', config: [], args: any): Promise<unknown>;
  apply(extension: 'core', config: {}, args: any): Promise<CoreConfig>;
  apply(
    extension: 'managerWebpack',
    config: {},
    args: { babelOptions?: TransformOptions } & ManagerWebpackOptions
  ): Promise<Configuration>;
  apply(extension: string, config: unknown, args: unknown): Promise<unknown>;
}

export interface LoadedPreset {
  name: string;
  preset: any;
  options: any;
}

export interface StorybookConfigOptions {
  configType: 'DEVELOPMENT' | 'PRODUCTION';
  outputDir?: string;
  configDir: string;
  cache?: any;
  framework: string;
  presets?: Presets;
}

export interface PresetsOptions {
  corePresets: string[];
  overridePresets: string[];
  frameworkPresets: string[];
}

export type PresetConfig =
  | string
  | {
      name: string;
      options?: unknown;
    };

export interface Ref {
  id: string;
  url: string;
  title: string;
  version: string;
  type?: string;
}

export interface VersionCheck {
  success: boolean;
  data?: any;
  error?: any;
  time: number;
}

export interface ReleaseNotesData {
  success: boolean;
  currentVersion: string;
  showOnFirstLaunch: boolean;
}

export interface BuilderResult {
  stats?: Stats;
  totalTime?: ReturnType<typeof process.hrtime>;
}

// TODO: this is a generic interface that we can share across multiple SB packages (like @storybook/cli)
export interface PackageJson {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

// TODO: This could be exported to the outside world and used in `options.ts` file of each `@storybook/APP`
// like it's described in docs/api/new-frameworks.md
export interface LoadOptions {
  packageJson: PackageJson;
  framework: string;
  frameworkPresets: string[];
}

export interface Builder<Config> {
  getConfig: (options: StorybookConfigOptions) => Promise<Config>;
  start: (args: {
    options: StorybookConfigOptions;
    startTime: ReturnType<typeof process.hrtime>;
    useProgressReporting: any;
    router: Router;
  }) => Promise<{
    stats: Stats;
    totalTime: ReturnType<typeof process.hrtime>;
    bail: (e?: Error) => Promise<void>;
  }>;
  build: (arg: {
    options: StorybookConfigOptions;
    startTime: ReturnType<typeof process.hrtime>;
    useProgressReporting: any;
  }) => Promise<void>;
  bail: (e?: Error) => Promise<void>;
}