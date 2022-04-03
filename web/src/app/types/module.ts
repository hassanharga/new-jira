import { TestCase } from './testCase';

export enum ModulePlatform {
  Android = 'Android',
  IOS = 'IOS',
}

export interface TestModule {
  _id: string;
  name: string;
  description: string;
  project: string;
  testCases: TestCase[];
}
