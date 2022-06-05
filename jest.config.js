module.exports = {
  preset: 'jest-preset-angular',
  globalSetup: 'jest-preset-angular/global-setup',
  roots: ['<rootDir>/projects/ngrx-store-storagesync'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  setupFilesAfterEnv: ['<rootDir>/projects/ngrx-store-storagesync/src/test.ts'],
  coveragePathIgnorePatterns: ['models', 'public_api', 'test']
};
