const {
  getAuthenticatedRemote,
  configureGitIdentity,
} = require('../src/utils');
const cp = require('child_process');

jest.mock('child_process');

describe('utils.js', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('getAuthenticatedRemote', () => {
    it('should return origin if no credentials are provided', async () => {
      delete process.env.GITHUB_TOKEN;
      delete process.env.GITHUB_USERNAME;

      const remote = await getAuthenticatedRemote();
      expect(remote).toBe('origin');
    });

    it('should construct authenticated URL if credentials present', async () => {
      process.env.GITHUB_TOKEN = 'test_token';
      process.env.GITHUB_USERNAME = 'test_user';

      // Mock exec for 'git remote get-url origin'
      cp.exec.mockImplementation((cmd, cb) => {
        if (cmd.includes('get-url')) {
          cb(null, 'https://github.com/owner/repo.git\n', '');
        } else {
          cb(null, '', '');
        }
      });

      const remote = await getAuthenticatedRemote();
      expect(remote).toBe(
        'https://test_user:test_token@github.com/owner/repo.git',
      );
    });

    it('should handle non-https remotes (fallback to origin)', async () => {
      process.env.GITHUB_TOKEN = 'test_token';
      process.env.GITHUB_USERNAME = 'test_user';

      // Mock exec for 'git remote get-url origin'
      cp.exec.mockImplementation((cmd, cb) => {
        cb(null, 'git@github.com:owner/repo.git\n', '');
      });

      const remote = await getAuthenticatedRemote();
      expect(remote).toBe('origin');
    });
  });

  describe('configureGitIdentity', () => {
    it('should execute git config if env vars present', async () => {
      process.env.GIT_COMMITTER_NAME = 'Test User';
      process.env.GIT_COMMITTER_EMAIL = 'test@example.com';

      cp.exec.mockImplementation((cmd, cb) => cb(null, '', ''));

      await configureGitIdentity();

      expect(cp.exec).toHaveBeenCalledWith(
        expect.stringContaining('git config user.name "Test User"'),
        expect.anything(),
      );
      expect(cp.exec).toHaveBeenCalledWith(
        expect.stringContaining('git config user.email "test@example.com"'),
        expect.anything(),
      );
    });

    it('should NOT execute git config if env vars missing', async () => {
      delete process.env.GIT_COMMITTER_NAME;
      delete process.env.GIT_COMMITTER_EMAIL;

      await configureGitIdentity();

      expect(cp.exec).not.toHaveBeenCalled();
    });
  });
});
