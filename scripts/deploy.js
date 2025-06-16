const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { execSync, spawn } = require('child_process');

/**
 * Deploy to Vercel
 */
async function deployToVercel(options = {}) {
  const spinner = ora('Deploying to Vercel...').start();
  
  try {
    // Check if Vercel CLI is installed
    try {
      execSync('vercel --version', { stdio: 'ignore' });
    } catch (error) {
      spinner.fail(chalk.red('Vercel CLI not found'));
      console.log(chalk.yellow('\n💡 Install Vercel CLI:'));
      console.log(chalk.gray('  npm install -g vercel'));
      return;
    }
    
    // Check if project is built
    const distDir = path.join(process.cwd(), 'out');
    if (!fs.existsSync(distDir)) {
      spinner.text = 'Building project first...';
      execSync('npm run build', { stdio: 'inherit' });
    }
    
    // Create vercel.json if it doesn't exist
    const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
    if (!fs.existsSync(vercelConfigPath)) {
      spinner.text = 'Creating Vercel configuration...';
      const vercelConfig = {
        version: 2,
        name: path.basename(process.cwd()),
        builds: [
          {
            src: 'out/**/*',
            use: '@vercel/static'
          }
        ],
        routes: [
          {
            src: '/(.*)',
            dest: '/out/$1'
          }
        ]
      };
      
      await fs.writeJson(vercelConfigPath, vercelConfig, { spaces: 2 });
    }
    
    // Deploy
    spinner.text = 'Deploying to Vercel...';
    const deployCommand = options.prod ? 'vercel --prod' : 'vercel';
    
    const child = spawn('vercel', options.prod ? ['--prod'] : [], {
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        spinner.succeed(chalk.green('Successfully deployed to Vercel!'));
        console.log(chalk.cyan('\n🎉 Your site is live!'));
        console.log(chalk.yellow('💡 Manage your deployment at https://vercel.com/dashboard'));
      } else {
        spinner.fail(chalk.red('Vercel deployment failed'));
      }
    });
    
  } catch (error) {
    spinner.fail(chalk.red('Vercel deployment failed'));
    throw error;
  }
}

/**
 * Deploy to Netlify
 */
async function deployToNetlify(options = {}) {
  const spinner = ora('Deploying to Netlify...').start();
  
  try {
    // Check if Netlify CLI is installed
    try {
      execSync('netlify --version', { stdio: 'ignore' });
    } catch (error) {
      spinner.fail(chalk.red('Netlify CLI not found'));
      console.log(chalk.yellow('\n💡 Install Netlify CLI:'));
      console.log(chalk.gray('  npm install -g netlify-cli'));
      return;
    }
    
    // Check if project is built
    const distDir = path.join(process.cwd(), 'out');
    if (!fs.existsSync(distDir)) {
      spinner.text = 'Building project first...';
      execSync('npm run build', { stdio: 'inherit' });
    }
    
    // Create netlify.toml if it doesn't exist
    const netlifyConfigPath = path.join(process.cwd(), 'netlify.toml');
    if (!fs.existsSync(netlifyConfigPath)) {
      spinner.text = 'Creating Netlify configuration...';
      const netlifyConfig = `[build]
  publish = "out"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
`;
      
      await fs.writeFile(netlifyConfigPath, netlifyConfig);
    }
    
    // Deploy
    spinner.text = 'Deploying to Netlify...';
    const deployCommand = options.prod ? 'netlify deploy --prod --dir=out' : 'netlify deploy --dir=out';
    
    const child = spawn('netlify', ['deploy', '--dir=out', ...(options.prod ? ['--prod'] : [])], {
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        spinner.succeed(chalk.green('Successfully deployed to Netlify!'));
        console.log(chalk.cyan('\n🎉 Your site is live!'));
        console.log(chalk.yellow('💡 Manage your deployment at https://app.netlify.com/'));
      } else {
        spinner.fail(chalk.red('Netlify deployment failed'));
      }
    });
    
  } catch (error) {
    spinner.fail(chalk.red('Netlify deployment failed'));
    throw error;
  }
}

/**
 * Deploy to GitHub Pages
 */
async function deployToGitHubPages(options = {}) {
  const spinner = ora('Deploying to GitHub Pages...').start();
  
  try {
    // Check if we're in a git repository
    try {
      execSync('git status', { stdio: 'ignore' });
    } catch (error) {
      spinner.fail(chalk.red('Not a git repository'));
      console.log(chalk.yellow('\n💡 Initialize git repository:'));
      console.log(chalk.gray('  git init'));
      console.log(chalk.gray('  git remote add origin <your-repo-url>'));
      return;
    }
    
    // Check if project is built
    const distDir = path.join(process.cwd(), 'out');
    if (!fs.existsSync(distDir)) {
      spinner.text = 'Building project first...';
      execSync('npm run build', { stdio: 'inherit' });
    }
    
    // Create .nojekyll file to prevent Jekyll processing
    const nojekyllPath = path.join(distDir, '.nojekyll');
    if (!fs.existsSync(nojekyllPath)) {
      await fs.writeFile(nojekyllPath, '');
    }
    
    // Deploy using gh-pages branch
    spinner.text = 'Pushing to gh-pages branch...';
    
    // Save current branch
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    
    // Create and switch to gh-pages branch
    try {
      execSync('git checkout gh-pages', { stdio: 'ignore' });
    } catch (error) {
      // Branch doesn't exist, create it
      execSync('git checkout --orphan gh-pages', { stdio: 'ignore' });
    }
    
    // Clear the branch
    execSync('git rm -rf .', { stdio: 'ignore' });
    
    // Copy dist contents to root
    const distContents = await fs.readdir(distDir);
    for (const item of distContents) {
      await fs.copy(path.join(distDir, item), path.join(process.cwd(), item));
    }
    
    // Commit and push
    execSync('git add .', { stdio: 'ignore' });
    execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'ignore' });
    execSync('git push origin gh-pages --force', { stdio: 'inherit' });
    
    // Switch back to original branch
    execSync(`git checkout ${currentBranch}`, { stdio: 'ignore' });
    
    spinner.succeed(chalk.green('Successfully deployed to GitHub Pages!'));
    console.log(chalk.cyan('\n🎉 Your site will be available at:'));
    
    // Try to get repository URL
    try {
      const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
      const match = remoteUrl.match(/github\.com[:/](.+?)\/(.+?)(?:\.git)?$/);
      if (match) {
        const [, owner, repo] = match;
        console.log(chalk.blue(`  https://${owner}.github.io/${repo}`));
      }
    } catch (error) {
      console.log(chalk.gray('  Check your GitHub repository settings for the URL'));
    }
    
    console.log(chalk.yellow('\n💡 Enable GitHub Pages in your repository settings'));
    
  } catch (error) {
    spinner.fail(chalk.red('GitHub Pages deployment failed'));
    throw error;
  }
}

/**
 * Deploy to AWS S3
 */
async function deployToS3(bucketName, options = {}) {
  const spinner = ora('Deploying to AWS S3...').start();
  
  try {
    // Check if AWS CLI is installed
    try {
      execSync('aws --version', { stdio: 'ignore' });
    } catch (error) {
      spinner.fail(chalk.red('AWS CLI not found'));
      console.log(chalk.yellow('\n💡 Install AWS CLI:'));
      console.log(chalk.gray('  https://aws.amazon.com/cli/'));
      return;
    }
    
    // Check if project is built
    const distDir = path.join(process.cwd(), 'out');
    if (!fs.existsSync(distDir)) {
      spinner.text = 'Building project first...';
      execSync('npm run build', { stdio: 'inherit' });
    }
    
    // Sync to S3
    spinner.text = `Uploading to S3 bucket: ${bucketName}...`;
    const syncCommand = `aws s3 sync ${distDir} s3://${bucketName} --delete`;
    
    if (options.cloudfront) {
      syncCommand += ' --cache-control "public, max-age=31536000, immutable"';
    }
    
    execSync(syncCommand, { stdio: 'inherit' });
    
    // Configure bucket for static website hosting
    if (options.configure) {
      spinner.text = 'Configuring S3 bucket for static hosting...';
      
      const websiteConfig = {
        IndexDocument: { Suffix: 'index.html' },
        ErrorDocument: { Key: 'index.html' }
      };
      
      execSync(`aws s3api put-bucket-website --bucket ${bucketName} --website-configuration '${JSON.stringify(websiteConfig)}'`, { stdio: 'ignore' });
    }
    
    spinner.succeed(chalk.green('Successfully deployed to AWS S3!'));
    console.log(chalk.cyan('\n🎉 Your site is uploaded!'));
    console.log(chalk.blue(`  S3 URL: http://${bucketName}.s3-website-us-east-1.amazonaws.com`));
    
    if (options.cloudfront) {
      console.log(chalk.yellow('\n💡 Don\'t forget to invalidate your CloudFront distribution'));
    }
    
  } catch (error) {
    spinner.fail(chalk.red('AWS S3 deployment failed'));
    throw error;
  }
}

/**
 * Generate deployment guide
 */
async function generateDeploymentGuide() {
  const guideContent = `# Deployment Guide

## Vercel (Recommended)
\`\`\`bash
npm install -g vercel
zyros deploy vercel
\`\`\`

## Netlify
\`\`\`bash
npm install -g netlify-cli
zyros deploy netlify
\`\`\`

## GitHub Pages
\`\`\`bash
zyros deploy github
\`\`\`

## AWS S3
\`\`\`bash
zyros deploy s3 your-bucket-name
\`\`\`

## Manual Deployment
1. Run \`npm run build\`
2. Upload the \`out/\` folder to your hosting provider
3. Configure your server to serve \`index.html\` for all routes

## Environment Variables
- \`SITE_URL\`: Your site's base URL (for RSS and sitemap generation)

## Tips
- Always run \`zyros validate\` before deploying
- Use \`zyros optimize\` to reduce bundle size
- Enable gzip compression on your server
- Set up proper cache headers for static assets
`;

  const guidePath = path.join(process.cwd(), 'DEPLOYMENT.md');
  await fs.writeFile(guidePath, guideContent);
  
  console.log(chalk.green('✅ Deployment guide created: DEPLOYMENT.md'));
}

module.exports = {
  deployToVercel,
  deployToNetlify,
  deployToGitHubPages,
  deployToS3,
  generateDeploymentGuide
}; 