const testEnv = process.env.TEST_ENV || 'int';

export const env = {
  testEnv,
  baseUrl: process.env.BASE_URL || 'https://evolvetest.elsevier.com/',
  apiBaseUrl: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  loginUsername: process.env.LOGIN_USERNAME || '',
  loginPassword: process.env.LOGIN_PASSWORD || '',
};
