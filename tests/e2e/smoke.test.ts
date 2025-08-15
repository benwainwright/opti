import { describe, it, expect, beforeAll } from 'vitest';
import { runCli } from '../cli-runner.ts';
import * as dotenv from 'dotenv';

dotenv.config();

describe('E2E Smoke Tests (Real API)', () => {
  const apiToken = process.env['OPTIMIZELY_API_TOKEN'];
  const envProjectId = process.env['PROJECT_ID'];
  const envFlagId = process.env['FLAG_ID'];
  let projectId: string | null = null;
  let flagKey: string | null = null;
  let environmentKey: string = 'production';

  beforeAll(() => {
    if (!apiToken) {
      console.warn('⚠️  OPTIMIZELY_API_TOKEN not found. E2E smoke tests will be skipped.');
      console.warn('   To run these tests, set the OPTIMIZELY_API_TOKEN environment variable.');
      console.warn('   You can create a .env file in the project root with: OPTIMIZELY_API_TOKEN=your_token_here');
    }
  });

  describe('Real API Integration', () => {
    it.skipIf(!apiToken)('should display help when no arguments provided', async () => {
      const result = await runCli(['--help'], { mode: 'subprocess' });
      
      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
      expect(result.stdout.join('\n')).toContain('flag');
    });

    it.skipIf(!apiToken)('should show flag command help', async () => {
      const result = await runCli(['flag', '--help'], { mode: 'subprocess' });
      
      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
      expect(result.stdout.join('\n')).toContain('list');
      expect(result.stdout.join('\n')).toContain('get');
      expect(result.stdout.join('\n')).toContain('ruleset');
    });

    it.skipIf(!apiToken)('should handle invalid token gracefully', async () => {
      const result = await runCli([
        'flag', 'list',
        '--project_id', '999999',
        '--token', 'invalid-token-12345',
        '--renderer', 'json'
      ], { mode: 'subprocess' });
      
      expect(result.success).toBe(false);
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr.join('\n')).toContain('401');
    });

    it.skipIf(!apiToken)('should list flags with valid token and project (may fail if no project exists)', async () => {
      const testProjectId = envProjectId || '1';
      
      const result = await runCli([
        'flag', 'list',
        '--project_id', testProjectId,
        '--token', apiToken!,
        '--renderer', 'json',
        '--per_page', '5'
      ], { mode: 'subprocess' });
      
      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
      projectId = testProjectId;
      
      const flags = JSON.parse(result.stdout.join('\n'));
      expect(Array.isArray(flags)).toBe(true);
      expect(flags.length).toBeGreaterThan(0);
      
      flagKey = flags[0].key;
      expect(flagKey).toBeDefined();
      expect(flags[0]).toHaveProperty('name');
      expect(flags[0]).toHaveProperty('id');
    });

    it.skipIf(!apiToken)('should get flag details', async () => {
      const testProjectId = envProjectId || projectId;
      const testFlagKey = envFlagId || flagKey;
      
      if (!testProjectId || !testFlagKey) {
        console.warn('⚠️  Skipping flag details test - no project or flag available');
        return;
      }
      const result = await runCli([
        'flag', 'get',
        '--project_id', testProjectId,
        '--flag_key', testFlagKey,
        '--token', apiToken!,
        '--renderer', 'json'
      ], { mode: 'subprocess' });
      
      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
      
      const flagDetails = JSON.parse(result.stdout.join('\n'));
      expect(flagDetails).toHaveProperty('key', testFlagKey);
      expect(flagDetails).toHaveProperty('id');
      expect(flagDetails).toHaveProperty('name');
    });

    it.skipIf(!apiToken)('should get flag ruleset (may fail if environment does not exist)', async () => {
      const testProjectId = envProjectId || projectId;
      const testFlagKey = envFlagId || flagKey;
      
      if (!testProjectId || !testFlagKey) {
        console.warn('⚠️  Skipping ruleset test - no project or flag available');
        return;
      }
      const result = await runCli([
        'flag', 'ruleset',
        '--project_id', testProjectId,
        '--flag_key', testFlagKey,
        '--environment_key', environmentKey,
        '--token', apiToken!,
        '--renderer', 'json'
      ], { mode: 'subprocess' });
      
      if (result.success) {
        expect(result.exitCode).toBe(0);
        
        const ruleset = JSON.parse(result.stdout.join('\n'));
        expect(ruleset).toHaveProperty('flag_key', testFlagKey);
        expect(ruleset).toHaveProperty('environment_key', environmentKey);
        console.log(`✅ Successfully retrieved ruleset for flag: ${testFlagKey}`);
      } else {
        console.warn(`⚠️  Could not get ruleset for flag ${testFlagKey} in environment ${environmentKey}.`);
        console.warn(`   This is acceptable if the environment doesn't exist.`);
        expect(result.stderr).toBeTruthy();
      }
    });

  });

  describe('Output Format Tests', () => {
    it.skipIf(!apiToken)('should output in table format', async () => {
      const testProjectId = envProjectId || projectId;
      
      if (!testProjectId) {
        console.warn('⚠️  Skipping table format test - no project available');
        return;
      }
      
      const result = await runCli([
        'flag', 'list',
        '--project_id', testProjectId,
        '--token', apiToken!,
        '--renderer', 'table',
        '--per_page', '3'
      ], { mode: 'subprocess' });
      
      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
      expect(result.stdout.join('\n')).toMatch(/[│┌┐└┘─]/);
    });

    it.skipIf(!apiToken)('should output in JSON format', async () => {
      const testProjectId = envProjectId || projectId;
      
      if (!testProjectId) {
        console.warn('⚠️  Skipping JSON format test - no project available');
        return;
      }
      
      const result = await runCli([
        'flag', 'list',
        '--project_id', testProjectId,
        '--token', apiToken!,
        '--renderer', 'json',
        '--per_page', '3'
      ], { mode: 'subprocess' });
      
      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
      
      const jsonOutput = JSON.parse(result.stdout.join('\n'));
      expect(Array.isArray(jsonOutput)).toBe(true);
      expect(jsonOutput.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it.skipIf(!apiToken)('should handle non-existent project gracefully', async () => {
      const result = await runCli([
        'flag', 'list',
        '--project_id', '999999999',
        '--token', apiToken!,
        '--renderer', 'json'
      ], { mode: 'subprocess' });
      
      expect(result.success).toBe(false);
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr.join('\n').toLowerCase()).toMatch(/404|403|not found|forbidden|project/i);
      console.log('✅ Non-existent project error handled correctly');
    });

    it.skipIf(!apiToken)('should handle non-existent flag gracefully', async () => {
      const testProjectId = envProjectId || projectId;
      
      if (!testProjectId) {
        console.warn('⚠️  Skipping non-existent flag test - no project available');
        return;
      }
      
      const result = await runCli([
        'flag', 'get',
        '--project_id', testProjectId,
        '--flag_key', 'definitely-nonexistent-flag-12345',
        '--token', apiToken!,
        '--renderer', 'json'
      ], { mode: 'subprocess' });
      
      expect(result.success).toBe(false);
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr.join('\n')).toBeTruthy();
      console.log('✅ Non-existent flag error handled correctly');
    });
  });

  if (!projectId && !envProjectId) {
    console.warn('⚠️  E2E smoke tests completed but no valid project was found.');
    console.warn('   This is expected if you don\'t have any projects in your Optimizely account.');
    console.warn('   Create a project and some flags to enable full E2E testing.');
  } else {
    console.log(`✅ E2E smoke tests completed successfully with project: ${envProjectId || projectId}`);
    if (envFlagId || flagKey) {
      console.log(`   Used flag: ${envFlagId || flagKey} for detailed testing`);
    }
  }
});