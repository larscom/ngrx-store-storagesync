module.exports = {
  globalSetup: 'jest-preset-angular/global-setup',
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/projects/ngrx-store-storagesync'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': 'jest-preset-angular'
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  setupFilesAfterEnv: ['<rootDir>/projects/ngrx-store-storagesync/src/test.ts'],
  coveragePathIgnorePatterns: ['models', 'public_api', 'test']
};
