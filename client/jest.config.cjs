module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    // Mock static assets (images, fonts) so Jest doesn't try to resolve them.
    '\\.(png|jpg|jpeg|gif|svg|webp|avif|ico)$': '<rootDir>/src/tests/fileMock.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testMatch: ['<rootDir>/src/tests/**/*.test.jsx']
};