module.exports = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^.+\\.(css|scss)$': '<rootDir>/jest/__mocks__/styleMock.js',
    },
  };