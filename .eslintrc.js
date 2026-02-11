module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-empty-function': ['error'],
    'no-warning-comments': ['warn', { 
      'terms': ['todo', 'fixme', 'xxx', 'hack'], 
      'location': 'anywhere' 
    }],
    'no-console': ['warn'],
    '@typescript-eslint/no-unused-vars': ['error']
  }
};
