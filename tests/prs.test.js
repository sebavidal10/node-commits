const { automateGit } = require('../src/prs');
const utils = require('../src/utils');

// Mock entire utils module
jest.mock('../src/utils');

describe('prs.js automation', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    jest.clearAllMocks();

    // Setup default mocks for the TOP LEVEL utils (used by first test)
    // We need to re-require utils to make sure we are configuring the mock that 'prs.js' (loaded at top level) is using.
    // Actually, since 'jest.mock' is hoisted, 'require' returns the mocked module.
    const currentUtils = require('../src/utils');
    currentUtils.runCommand.mockResolvedValue('success');
    currentUtils.updateFile.mockImplementation(() => {});
    currentUtils.getAuthenticatedRemote.mockResolvedValue('origin');
    currentUtils.configureGitIdentity.mockResolvedValue();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should create a commit in every cycle', async () => {
    // This test uses the 'automateGit' loaded at top-level
    await automateGit();

    expect(utils.updateFile).toHaveBeenCalled();
    expect(utils.runCommand).toHaveBeenCalledWith(
      'git add .',
      expect.any(String),
    );
    expect(utils.runCommand).toHaveBeenCalledWith(
      expect.stringContaining('git commit'),
      expect.any(String),
    );
    expect(utils.runCommand).toHaveBeenCalledWith(
      expect.stringContaining('git push'),
      expect.any(String),
    );
  });

  it('should create a branch after BATCH_SIZE commits', async () => {
    // Set small batch size
    process.env.GIT_PRS_BATCH = '2';
    process.env.GIT_BASE_BRANCH = 'main';

    // We need to reload the module to pick up the new env var for BATCH_SIZE const
    jest.resetModules();

    // We MUST re-mock utils because resetModules clears the module registry
    jest.mock('../src/utils');

    // Get the NEW mock instance for this context
    const newUtils = require('../src/utils');
    newUtils.path = require('path');
    newUtils.runCommand.mockResolvedValue('success'); // Important: return Promise for .catch()
    newUtils.getAuthenticatedRemote.mockResolvedValue('origin');
    newUtils.configureGitIdentity.mockResolvedValue();
    newUtils.updateFile.mockImplementation(() => {});

    // Load fresh prs module
    const { automateGit: automateGitReloaded } = require('../src/prs');

    // Call 1: Normal commit
    await automateGitReloaded();
    expect(newUtils.runCommand).not.toHaveBeenCalledWith(
      expect.stringContaining('git checkout -b'),
      expect.any(String),
    );

    // Call 2: Should trigger branch creation (counter=2, mod 2 == 0)
    await automateGitReloaded();
    expect(newUtils.runCommand).toHaveBeenCalledWith(
      expect.stringContaining('git checkout -b feature/auto-'),
      expect.any(String),
    );
  });
});
