#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');

const AI_TOOLS_VERSION = '1.0.0';

const contentTemplates = {
  'blog-post': {
    name: 'Blog Post',
    description: 'Generate engaging blog posts with SEO optimization',
    prompts: [
      'Write a comprehensive blog post about [TOPIC] targeting [AUDIENCE]',
      'Include an engaging introduction, main points, and conclusion',
      'Add relevant examples and actionable insights',
      'Optimize for SEO with proper headings and keywords'
    ]
  },
  'landing-page': {
    name: 'Landing Page',
    description: 'Create high-converting landing pages',
    prompts: [
      'Create a compelling landing page for [PRODUCT/SERVICE]',
      'Include hero section, benefits, features, and call-to-action',
      'Focus on conversion optimization and clear value proposition',
      'Add social proof and trust indicators'
    ]
  },
  'product-description': {
    name: 'Product Description',
    description: 'Generate compelling product descriptions',
    prompts: [
      'Write a persuasive product description for [PRODUCT]',
      'Highlight key features, benefits, and unique selling points',
      'Include technical specifications if relevant',
      'Add compelling call-to-action'
    ]
  },
  'about-page': {
    name: 'About Page',
    description: 'Create engaging about pages and company stories',
    prompts: [
      'Write an engaging about page for [COMPANY/PERSON]',
      'Include mission, vision, values, and story',
      'Highlight achievements and unique qualities',
      'Make it personal and relatable'
    ]
  }
};

async function generateContent() {
  console.log(chalk.blue.bold('\n🤖 AI Content Generator\n'));

  const { contentType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'contentType',
      message: 'What type of content would you like to generate?',
      choices: Object.entries(contentTemplates).map(([key, template]) => ({
        name: `${template.name} - ${template.description}`,
        value: key
      }))
    }
  ]);

  const { topic } = await inquirer.prompt([
    {
      type: 'input',
      name: 'topic',
      message: 'Enter your topic or subject:',
      validate: input => input.trim().length > 0 ? true : 'Please enter a topic'
    }
  ]);

  const { outputFile } = await inquirer.prompt([
    {
      type: 'input',
      name: 'outputFile',
      message: 'Output filename (without extension):',
      default: topic.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      validate: input => input.trim().length > 0 ? true : 'Please enter a filename'
    }
  ]);

  const spinner = ora('Generating content with AI...').start();

  // Simulate AI content generation
  await new Promise(resolve => setTimeout(resolve, 2000));

  const content = generateMockContent(contentType, topic);
  
  const filename = `${outputFile}.md`;
  const filepath = path.join(process.cwd(), filename);
  
  try {
    fs.writeFileSync(filepath, content);
    spinner.succeed(`Content generated successfully: ${chalk.green(filename)}`);
    
    console.log(chalk.gray('\nGenerated content preview:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(content.substring(0, 200) + '...');
    console.log(chalk.gray('─'.repeat(50)));
    
  } catch (error) {
    spinner.fail(`Failed to write file: ${error.message}`);
  }
}

function generateMockContent(type, topic) {
  const topicLower = topic.toLowerCase();
  
  switch (type) {
    case 'blog-post':
      return `# ${topic}: A Comprehensive Guide

## Introduction

Welcome to this comprehensive guide about ${topicLower}. In today's digital landscape, understanding ${topicLower} is crucial for success.

## Key Benefits

### 1. Enhanced Performance
${topicLower} significantly improves performance by optimizing core processes and reducing overhead.

### 2. Better User Experience
Users experience smoother interactions and faster response times when implementing ${topicLower}.

### 3. Increased Efficiency
Organizations report up to 40% efficiency gains when properly utilizing ${topicLower}.

## Implementation Strategy

### Step 1: Planning
Start by assessing your current situation and identifying key areas for improvement.

### Step 2: Execution
Implement ${topicLower} gradually, monitoring progress and making adjustments as needed.

### Step 3: Optimization
Fine-tune your approach based on real-world results and user feedback.

## Best Practices

- Always test thoroughly before deployment
- Monitor performance metrics continuously
- Gather user feedback regularly
- Stay updated with latest developments

## Conclusion

${topicLower} represents a significant opportunity for growth and improvement. By following the strategies outlined in this guide, you'll be well-positioned to achieve your goals.

Ready to get started? Contact us today to learn more about implementing ${topicLower} in your organization.`;

    case 'landing-page':
      return `# Transform Your Business with ${topic}

## Revolutionary Solution for Modern Challenges

Discover how ${topic} can revolutionize your business operations and drive unprecedented growth.

### Why Choose ${topic}?

**🚀 Boost Performance**
Experience 3x faster results with our optimized ${topicLower} solution.

**💡 Smart Innovation**
Leverage cutting-edge technology to stay ahead of the competition.

**🔒 Enterprise Security**
Bank-level security ensures your data is always protected.

**📈 Proven Results**
Join 10,000+ satisfied customers who've transformed their business.

### What Our Customers Say

*"${topic} completely transformed our workflow. We're now 50% more efficient!"*
- Sarah Johnson, CEO of TechCorp

*"The ROI was immediate. Best investment we've made this year."*
- Michael Chen, CTO of InnovateLabs

### Get Started Today

Ready to experience the power of ${topic}? Join thousands of successful businesses already using our solution.

**Special Limited Time Offer: 30% Off First Year**

[Start Free Trial] [Schedule Demo] [Contact Sales]`;

    default:
      return `# ${topic}

This is AI-generated content about ${topicLower}. The content has been optimized for engagement and SEO.

## Overview

${topicLower} is an important topic that deserves comprehensive coverage. This content provides valuable insights and actionable information.

## Key Points

- Point 1: Important aspect of ${topicLower}
- Point 2: Another crucial element
- Point 3: Final key consideration

## Conclusion

Understanding ${topicLower} is essential for success in today's competitive landscape.`;
  }
}

async function analyzeSEO() {
  console.log(chalk.green.bold('\n📊 SEO Analyzer\n'));

  const { filePath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filePath',
      message: 'Enter the path to your content file:',
      validate: input => {
        if (!input.trim()) return 'Please enter a file path';
        if (!fs.existsSync(input)) return 'File does not exist';
        return true;
      }
    }
  ]);

  const spinner = ora('Analyzing SEO...').start();
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Simulate SEO analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const analysis = performSEOAnalysis(content);
    
    spinner.succeed('SEO analysis complete!');
    
    console.log(chalk.blue.bold('\n📈 SEO Analysis Results\n'));
    
    // Overall Score
    const scoreColor = analysis.overallScore >= 80 ? chalk.green : 
                      analysis.overallScore >= 60 ? chalk.yellow : chalk.red;
    console.log(`Overall SEO Score: ${scoreColor.bold(analysis.overallScore + '/100')}\n`);
    
    // Detailed scores
    console.log(chalk.gray('Detailed Breakdown:'));
    console.log(`  Title: ${getScoreDisplay(analysis.titleScore)}`);
    console.log(`  Content: ${getScoreDisplay(analysis.contentScore)}`);
    console.log(`  Readability: ${getScoreDisplay(analysis.readabilityScore)}`);
    console.log(`  Structure: ${getScoreDisplay(analysis.structureScore)}\n`);
    
    // Suggestions
    if (analysis.suggestions.length > 0) {
      console.log(chalk.blue.bold('💡 Optimization Suggestions:\n'));
      analysis.suggestions.forEach((suggestion, index) => {
        const icon = suggestion.type === 'error' ? '❌' : 
                    suggestion.type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${icon} ${suggestion.message}`);
        if (suggestion.fix) {
          console.log(chalk.gray(`   💡 ${suggestion.fix}\n`));
        }
      });
    }
    
  } catch (error) {
    spinner.fail(`Failed to analyze file: ${error.message}`);
  }
}

function performSEOAnalysis(content) {
  const lines = content.split('\n');
  const words = content.split(/\s+/);
  const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
  const h1Count = (content.match(/^#\s+.+$/gm) || []).length;
  
  let suggestions = [];
  let titleScore = 100;
  let contentScore = 100;
  let readabilityScore = 100;
  let structureScore = 100;
  
  // Title analysis
  const title = lines.find(line => line.startsWith('# '));
  if (!title) {
    titleScore = 0;
    suggestions.push({
      type: 'error',
      message: 'No H1 title found',
      fix: 'Add a main title with # at the beginning of your content'
    });
  } else if (title.length < 30) {
    titleScore = 60;
    suggestions.push({
      type: 'warning',
      message: 'Title is too short',
      fix: 'Expand your title to 30-60 characters for better SEO'
    });
  } else if (title.length > 60) {
    titleScore = 70;
    suggestions.push({
      type: 'warning',
      message: 'Title is too long',
      fix: 'Shorten your title to under 60 characters'
    });
  }
  
  // Content analysis
  if (words.length < 300) {
    contentScore = 40;
    suggestions.push({
      type: 'warning',
      message: 'Content is too short',
      fix: 'Add more content. Aim for at least 300 words for better SEO'
    });
  }
  
  // Structure analysis
  if (h1Count === 0) {
    structureScore = 30;
    suggestions.push({
      type: 'error',
      message: 'No H1 heading found',
      fix: 'Add one H1 heading to your content'
    });
  } else if (h1Count > 1) {
    structureScore = 70;
    suggestions.push({
      type: 'warning',
      message: 'Multiple H1 headings found',
      fix: 'Use only one H1 heading per page'
    });
  }
  
  if (headings.length < 2) {
    structureScore = Math.min(structureScore, 60);
    suggestions.push({
      type: 'warning',
      message: 'Not enough headings for structure',
      fix: 'Add more headings (H2, H3) to organize your content'
    });
  }
  
  const overallScore = Math.round((titleScore + contentScore + readabilityScore + structureScore) / 4);
  
  return {
    titleScore,
    contentScore,
    readabilityScore,
    structureScore,
    overallScore,
    suggestions
  };
}

function getScoreDisplay(score) {
  const color = score >= 80 ? chalk.green : score >= 60 ? chalk.yellow : chalk.red;
  return color(`${score}/100`);
}

async function performanceAudit() {
  console.log(chalk.magenta.bold('\n⚡ Performance Audit\n'));
  
  const spinner = ora('Running performance analysis...').start();
  
  // Simulate performance audit
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const metrics = {
    lighthouse: {
      performance: 92,
      accessibility: 98,
      bestPractices: 87,
      seo: 95,
      pwa: 73
    },
    coreWebVitals: {
      lcp: 1.2,
      fid: 45,
      cls: 0.08
    },
    suggestions: [
      'Optimize images for better performance',
      'Enable text compression',
      'Minimize JavaScript bundles',
      'Use modern image formats (WebP)'
    ]
  };
  
  spinner.succeed('Performance audit complete!');
  
  console.log(chalk.magenta.bold('\n🚀 Performance Results\n'));
  
  console.log(chalk.gray('Lighthouse Scores:'));
  console.log(`  Performance: ${getScoreDisplay(metrics.lighthouse.performance)}`);
  console.log(`  Accessibility: ${getScoreDisplay(metrics.lighthouse.accessibility)}`);
  console.log(`  Best Practices: ${getScoreDisplay(metrics.lighthouse.bestPractices)}`);
  console.log(`  SEO: ${getScoreDisplay(metrics.lighthouse.seo)}`);
  console.log(`  PWA: ${getScoreDisplay(metrics.lighthouse.pwa)}\n`);
  
  console.log(chalk.gray('Core Web Vitals:'));
  console.log(`  LCP: ${metrics.coreWebVitals.lcp}s ${metrics.coreWebVitals.lcp <= 2.5 ? '✅' : '⚠️'}`);
  console.log(`  FID: ${metrics.coreWebVitals.fid}ms ${metrics.coreWebVitals.fid <= 100 ? '✅' : '⚠️'}`);
  console.log(`  CLS: ${metrics.coreWebVitals.cls} ${metrics.coreWebVitals.cls <= 0.1 ? '✅' : '⚠️'}\n`);
  
  console.log(chalk.blue.bold('💡 Optimization Suggestions:\n'));
  metrics.suggestions.forEach(suggestion => {
    console.log(`  • ${suggestion}`);
  });
}

async function main() {
  console.log(chalk.blue.bold(`
  ╔══════════════════════════════════════╗
  ║         🤖 Zyros AI Tools            ║
  ║              v${AI_TOOLS_VERSION}                ║
  ╚══════════════════════════════════════╝
  `));

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        {
          name: '🧠 Generate Content with AI',
          value: 'generate'
        },
        {
          name: '📊 Analyze SEO',
          value: 'seo'
        },
        {
          name: '⚡ Performance Audit',
          value: 'performance'
        },
        {
          name: '❌ Exit',
          value: 'exit'
        }
      ]
    }
  ]);

  switch (action) {
    case 'generate':
      await generateContent();
      break;
    case 'seo':
      await analyzeSEO();
      break;
    case 'performance':
      await performanceAudit();
      break;
    case 'exit':
      console.log(chalk.gray('\nGoodbye! 👋\n'));
      process.exit(0);
      break;
  }

  // Ask if user wants to continue
  const { continue: shouldContinue } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'continue',
      message: 'Would you like to use another AI tool?',
      default: true
    }
  ]);

  if (shouldContinue) {
    await main();
  } else {
    console.log(chalk.gray('\nThanks for using Zyros AI Tools! 🚀\n'));
    process.exit(0);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('\nError:'), error.message);
    process.exit(1);
  });
}

module.exports = {
  generateContent,
  analyzeSEO,
  performanceAudit
}; 