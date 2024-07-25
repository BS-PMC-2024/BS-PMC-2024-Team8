module.exports = {
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|svg)$": "<rootDir>/fileMock.js",
    '\\.(mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/fileMock.js'
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.mjs$": "babel-jest", // Add this line to handle .mjs files
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  globals: {
    "babel-jest": {
      diagnostics: false,
    },
  },
  transformIgnorePatterns: [
    "node_modules/(?!(axios)/)", // Add this line to ensure axios is transformed
  ],
};
