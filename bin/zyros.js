#!/usr/bin/env node

/**
 * zyros CLI
 * 
 * Command-line interface for zyros static site generator
 */

const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const program = new Command();

// Import CLI modules
const init = require('../scripts/init');
const build = require('../scripts/build');
const cli = require('../scripts/cli');
const template = require('../scripts/template');
const validate = require('../scripts/validate');
const optimize = require('../scripts/optimize');
const deploy = require('../scripts/deploy');

// Package info
const packageJson = require('../package.json');

program
  .name('zyros')
  .description('A developer-friendly static site generator')
  .version(packageJson.version);

// Initialize new project
program
  .command('init [name]')
  .description('Initialize a new zyros project')
  .option('-t, --template <template>', 'Use a specific template', 'default')
  .option('-f, --force', 'Overwrite existing files')
  .action(async (name, options) => {
    try {
      await init.initProject(name || 'my-site', options);
    } catch (error) {
      console.error(chalk.red('Error initializing project:'), error.message);
      process.exit(1);
    }
  });

// Build site
program
  .command('build')
  .description('Build the static site')
  .option('-o, --output <dir>', 'Output directory', 'dist')
  .option('--base-url <url>', 'Base URL for the site')
  .action(async (options) => {
    try {
      process.env.SITE_URL = options.baseUrl;
      await build.generateSite();
    } catch (error) {
      console.error(chalk.red('Build failed:'), error.message);
      process.exit(1);
    }
  });

// Development server
program
  .command('dev')
  .description('Start development server')
  .option('-p, --port <port>', 'Port number', '3000')
  .action(async (options) => {
    try {
      const { spawn } = require('child_process');
      const isWindows = process.platform === 'win32';
      const npmCmd = isWindows ? 'npm.cmd' : 'npm';
      
      const child = spawn(npmCmd, ['run', 'dev'], {
        stdio: 'inherit',
        shell: true,
        env: { ...process.env, PORT: options.port }
      });
      
      child.on('error', (error) => {
        console.error(chalk.red('Failed to start dev server:'), error.message);
        console.error(chalk.yellow('Make sure you are in a zyros project directory and have run "npm install"'));
        process.exit(1);
      });
    } catch (error) {
      console.error(chalk.red('Error starting dev server:'), error.message);
      process.exit(1);
    }
  });

// Content management
const content = program
  .command('content')
  .description('Content management commands');

content
  .command('create')
  .description('Create a new post')
  .action(async () => {
    try {
      await cli.createPost();
    } catch (error) {
      console.error(chalk.red('Error creating post:'), error.message);
      process.exit(1);
    }
  });

content
  .command('list')
  .description('List all posts')
  .action(async () => {
    try {
      await cli.listPosts();
    } catch (error) {
      console.error(chalk.red('Error listing posts:'), error.message);
      process.exit(1);
    }
  });

content
  .command('delete')
  .description('Delete a post')
  .action(async () => {
    try {
      await cli.deletePost();
    } catch (error) {
      console.error(chalk.red('Error deleting post:'), error.message);
      process.exit(1);
    }
  });

content
  .command('stats')
  .description('Show content statistics')
  .action(async () => {
    try {
      await cli.showStats();
    } catch (error) {
      console.error(chalk.red('Error showing stats:'), error.message);
      process.exit(1);
    }
  });

// Template management
const templates = program
  .command('template')
  .description('Template management commands');

templates
  .command('list')
  .description('List available templates')
  .action(async () => {
    try {
      await template.listTemplates();
    } catch (error) {
      console.error(chalk.red('Error listing templates:'), error.message);
      process.exit(1);
    }
  });

templates
  .command('apply <template>')
  .description('Apply a template to current project')
  .option('-f, --force', 'Overwrite existing files')
  .action(async (templateName, options) => {
    try {
      await template.applyTemplate(templateName, options);
    } catch (error) {
      console.error(chalk.red('Error applying template:'), error.message);
      process.exit(1);
    }
  });

// Validation
program
  .command('validate')
  .description('Validate site configuration and content')
  .action(async () => {
    try {
      await validate.validateProject();
    } catch (error) {
      console.error(chalk.red('Validation failed:'), error.message);
      process.exit(1);
    }
  });

// Optimization
program
  .command('optimize')
  .description('Optimize images and assets')
  .option('--images', 'Optimize images only')
  .option('--assets', 'Optimize other assets only')
  .action(async (options) => {
    try {
      await optimize.optimizeProject(options);
    } catch (error) {
      console.error(chalk.red('Optimization failed:'), error.message);
      process.exit(1);
    }
  });

// Deployment
const deployment = program
  .command('deploy')
  .description('Deploy site to various platforms');

deployment
  .command('vercel')
  .description('Deploy to Vercel')
  .option('--prod', 'Deploy to production')
  .action(async (options) => {
    try {
      await deploy.deployToVercel(options);
    } catch (error) {
      console.error(chalk.red('Vercel deployment failed:'), error.message);
      process.exit(1);
    }
  });

deployment
  .command('netlify')
  .description('Deploy to Netlify')
  .option('--prod', 'Deploy to production')
  .action(async (options) => {
    try {
      await deploy.deployToNetlify(options);
    } catch (error) {
      console.error(chalk.red('Netlify deployment failed:'), error.message);
      process.exit(1);
    }
  });

deployment
  .command('github')
  .description('Deploy to GitHub Pages')
  .action(async (options) => {
    try {
      await deploy.deployToGitHubPages(options);
    } catch (error) {
      console.error(chalk.red('GitHub Pages deployment failed:'), error.message);
      process.exit(1);
    }
  });

deployment
  .command('s3 <bucket>')
  .description('Deploy to AWS S3')
  .option('--configure', 'Configure bucket for static hosting')
  .option('--cloudfront', 'Optimize for CloudFront')
  .action(async (bucketName, options) => {
    try {
      await deploy.deployToS3(bucketName, options);
    } catch (error) {
      console.error(chalk.red('AWS S3 deployment failed:'), error.message);
      process.exit(1);
    }
  });

// Config management
program
  .command('config')
  .description('Manage site configuration')
  .option('--set <key=value>', 'Set configuration value')
  .option('--get <key>', 'Get configuration value')
  .option('--list', 'List all configuration')
  .action(async (options) => {
    try {
      await cli.manageConfig(options);
    } catch (error) {
      console.error(chalk.red('Config management failed:'), error.message);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
} 