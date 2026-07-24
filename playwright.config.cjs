// office-crew tester: generated Playwright config
module.exports = {
  testDir: './e2e',
  timeout: 12000,
  expect: { timeout: 6000 },
  retries: 0,
  fullyParallel: false,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:64790', headless: true, screenshot: 'only-on-failure' },
  webServer: {
    command: 'node _tester_serve.cjs',
    env: { PORT: '64790', SERVE_DIR: 'dist' },
    url: 'http://127.0.0.1:64790',
    reuseExistingServer: false,
    stdout: 'pipe', stderr: 'pipe',
    timeout: 60000,
  },
};
