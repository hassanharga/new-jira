import { Issue } from './issue';
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
  release: Pick<Issue, 'name' | 'version'>;
  testCases: TestCase[];
}
