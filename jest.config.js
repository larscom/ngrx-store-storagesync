module.exports = {
  reporters: ['default'],
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/projects/ngrx-store-storagesync/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },
  setupFilesAfterEnv: ['<rootDir>/projects/ngrx-store-storagesync/test.ts'],
};
