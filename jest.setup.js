import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock words.json
jest.mock('./words.json', () => [
  'javascript',
  'typescript',
  'nextjs',
  'react',
  'testing'
])