import React, { useState } from 'react';
import { Wand2, Sparkles, FileText, Zap, Brain, Copy } from './Icons';
import { Theme } from '../styles/themes';

interface AIContentGeneratorProps {
  theme: Theme;
  customStyle?: React.CSSProperties | null;
  onContentGenerated: (content: {
    type: string;
    content: string;
    title: string;
    template: string;
  }) => void;
}

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  prompts: string[];
  type: 'blog' | 'page' | 'content-block';
}

const contentTemplates: ContentTemplate[] = [
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Generate engaging blog posts with SEO optimization',
    icon: <FileText className="w-5 h-5" />,
    prompts: [
      'Write a comprehensive blog post about [TOPIC] targeting [AUDIENCE]',
      'Include an engaging introduction, main points, and conclusion',
      'Add relevant examples and actionable insights',
      'Optimize for SEO with proper headings and keywords'
    ],
    type: 'blog'
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Create high-converting landing pages',
    icon: <Zap className="w-5 h-5" />,
    prompts: [
      'Create a compelling landing page for [PRODUCT/SERVICE]',
      'Include hero section, benefits, features, and call-to-action',
      'Focus on conversion optimization and clear value proposition',
      'Add social proof and trust indicators'
    ],
    type: 'page'
  },
  {
    id: 'product-description',
    name: 'Product Description',
    description: 'Generate compelling product descriptions',
    icon: <Sparkles className="w-5 h-5" />,
    prompts: [
      'Write a persuasive product description for [PRODUCT]',
      'Highlight key features, benefits, and unique selling points',
      'Include technical specifications if relevant',
      'Add compelling call-to-action'
    ],
    type: 'content-block'
  },
  {
    id: 'about-page',
    name: 'About Page',
    description: 'Create engaging about pages and company stories',
    icon: <Brain className="w-5 h-5" />,
    prompts: [
      'Write an engaging about page for [COMPANY/PERSON]',
      'Include mission, vision, values, and story',
      'Highlight achievements and unique qualities',
      'Make it personal and relatable'
    ],
    type: 'page'
  }
];

export default function AIContentGenerator({ theme, customStyle, onContentGenerated }: AIContentGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [userInput, setUserInput] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'select' | 'input' | 'generate' | 'result'>('select');

  const handleTemplateSelect = (template: ContentTemplate) => {
    setSelectedTemplate(template);
    setStep('input');
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || !userInput.trim()) return;
    
    setIsGenerating(true);
    setStep('generate');

    try {
      // Simulate AI content generation (in a real implementation, this would call an AI API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockContent = generateMockContent(selectedTemplate, userInput);
      setGeneratedContent(mockContent);
      setStep('result');
    } catch (error) {
      // In production, you might want to log this to an error tracking service
      console.warn('Content generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockContent = (template: ContentTemplate, input: string): string => {
    const topic = input.toLowerCase();
    const titleCase = input.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    
    // Enhanced content generation with more variety and quality
    const contentVariations = {
      intros: [
        `In today's rapidly evolving digital landscape, ${topic} has emerged as a game-changing force.`,
        `The world of ${topic} is experiencing unprecedented transformation, and staying ahead requires deep understanding.`,
        `Success in ${topic} isn't just about following trends—it's about creating them.`,
        `What if I told you that mastering ${topic} could revolutionize your entire approach to business?`
      ],
      transitions: [
        "Let's dive deeper into this fascinating topic.",
        "Here's what you need to know to get started.",
        "The key lies in understanding these fundamental principles.",
        "But first, let's examine why this matters so much right now."
      ],
      conclusions: [
        `The future of ${topic} is bright, and those who act now will reap the greatest rewards.`,
        `By implementing these strategies, you're not just keeping up—you're leading the charge.`,
        `Remember, success in ${topic} is a journey, not a destination.`,
        `Your ${topic} transformation starts today. Take the first step and watch your results soar.`
      ]
    };

    const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    
    switch (template.id) {
      case 'blog-post':
        return `# ${titleCase}: The Complete 2024 Guide

${getRandomElement(contentVariations.intros)} ${getRandomElement(contentVariations.transitions)}

## Why ${titleCase} Matters More Than Ever

In an era where digital transformation is accelerating at breakneck speed, ${topic} has become the cornerstone of successful modern strategies. Recent studies show that organizations implementing ${topic} effectively see:

- **47% increase in operational efficiency**
- **63% improvement in customer satisfaction**
- **35% reduction in operational costs**
- **52% faster time-to-market for new initiatives**

## The Science Behind ${titleCase}

### Core Principles

**1. Strategic Foundation**
${titleCase} isn't just a buzzword—it's a fundamental shift in how we approach problem-solving. The most successful implementations focus on:

- Data-driven decision making
- User-centric design principles
- Scalable architecture patterns
- Continuous optimization cycles

**2. Implementation Framework**
Our proprietary framework has helped over 500+ companies successfully implement ${topic}:`;

      case 'landing-page':
        return `# Transform Your Business with ${input}

## Revolutionary Solution for Modern Challenges

Discover how ${input} can revolutionize your business operations and drive unprecedented growth.

### Why Choose ${input}?

**🚀 Boost Performance**
Experience 3x faster results with our optimized ${topic} solution.

**💡 Smart Innovation**
Leverage cutting-edge technology to stay ahead of the competition.

**🔒 Enterprise Security**
Bank-level security ensures your data is always protected.

**📈 Proven Results**
Join 10,000+ satisfied customers who've transformed their business.

### What Our Customers Say

*"${input} completely transformed our workflow. We're now 50% more efficient!"*
- Sarah Johnson, CEO of TechCorp

*"The ROI was immediate. Best investment we've made this year."*
- Michael Chen, CTO of InnovateLabs

### Get Started Today

Ready to experience the power of ${input}? Join thousands of successful businesses already using our solution.

**Special Limited Time Offer: 30% Off First Year**

[Start Free Trial] [Schedule Demo] [Contact Sales]`;

      default:
        return `# ${input}

This is AI-generated content about ${topic}. The content has been optimized for engagement and SEO.

## Overview

${topic} is an important topic that deserves comprehensive coverage. This content provides valuable insights and actionable information.

## Key Points

- Point 1: Important aspect of ${topic}
- Point 2: Another crucial element
- Point 3: Final key consideration

## Conclusion

Understanding ${topic} is essential for success in today's competitive landscape.`;
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const handleUseContent = () => {
    onContentGenerated({
      type: selectedTemplate?.type || 'content-block',
      content: generatedContent,
      title: userInput,
      template: selectedTemplate?.id || 'unknown'
    });
    setIsOpen(false);
    resetGenerator();
  };

  const resetGenerator = () => {
    setStep('select');
    setSelectedTemplate(null);
    setUserInput('');
    setGeneratedContent('');
  };

  if (!isOpen) {
    const defaultStyle = {
      position: 'fixed' as const,
      bottom: '1.5rem',
      right: '1.5rem',
      padding: '1.2rem',
      borderRadius: '1.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      color: '#ffffff',
      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
      zIndex: 50,
      border: 'none',
      cursor: 'pointer',
      animation: 'float 3s ease-in-out infinite'
    };

    return (
      <div>
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .ai-tooltip {
            background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
          }
        `}</style>
        <button
          onClick={() => setIsOpen(true)}
          className="transition-all duration-500 hover:scale-110 group relative"
          style={customStyle || defaultStyle}
        >
          <Wand2 className="w-7 h-7" />
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-3 ai-tooltip text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl">
            <div className="font-semibold">✨ AI Content Generator</div>
            <div className="text-xs text-gray-200 mt-1">Create amazing content with AI</div>
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-purple-900"></div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-3xl ${theme.card} border ${theme.border} shadow-2xl`}>
        {/* Enhanced Header */}
        <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 text-white shadow-lg">
                <Wand2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Content Generator
                </h2>
                <p className={`text-sm ${theme.secondary} mt-1`}>
                  Create engaging content with AI assistance • Currently using advanced mock generation
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-3 rounded-xl ${theme.border} hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all duration-300 text-xl font-bold`}
            >
              ×
            </button>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="p-8">
          {step === 'select' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  Choose Content Type
                </h3>
                <p className={`${theme.secondary} text-lg`}>Select the type of content you want to generate</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contentTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-8 rounded-3xl border-2 ${theme.border} hover:border-purple-500 transition-all duration-300 hover:scale-105 text-left group relative overflow-hidden shadow-lg hover:shadow-2xl`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-start space-x-5">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 text-white group-hover:scale-110 transition-transform shadow-lg">
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-xl ${theme.accent} mb-3`}>{template.name}</h4>
                        <p className={`text-sm ${theme.secondary} leading-relaxed`}>{template.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* AI Integration Notice */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <Brain className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                      🚀 Ready for Real AI Integration
                    </h4>
                    <p className="text-blue-700 dark:text-blue-400 text-sm leading-relaxed">
                      Currently using advanced mock generation. To integrate with real AI APIs, consider these free options:
                    </p>
                    <ul className="text-blue-600 dark:text-blue-400 text-sm mt-2 space-y-1">
                      <li>• <strong>Hugging Face Inference API</strong> - Free tier available</li>
                      <li>• <strong>Google AI Studio (Gemini)</strong> - Generous free quota</li>
                      <li>• <strong>Cohere API</strong> - Free tier for text generation</li>
                      <li>• <strong>OpenAI API</strong> - $5 free credit for new users</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'input' && selectedTemplate && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  Generate {selectedTemplate.name}
                </h3>
                <p className={`${theme.secondary} text-lg`}>{selectedTemplate.description}</p>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <label className={`block text-sm font-semibold ${theme.accent} mb-3`}>
                    Topic or Subject
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Enter your topic (e.g., 'Next.js Development', 'Digital Marketing Strategy')"
                      className={`w-full p-6 pr-12 rounded-2xl border-2 ${theme.border} ${theme.card} focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-lg`}
                    />
                    <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-400" />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep('select')}
                    className={`px-8 py-4 rounded-2xl border-2 ${theme.border} ${theme.text} hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 font-semibold`}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={!userInput.trim()}
                    className="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
                  >
                    ✨ Generate Content
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'generate' && (
            <div className="text-center space-y-8">
              <div className="relative">
                <div className="animate-spin w-24 h-24 border-4 border-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 border-t-purple-600 rounded-full mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Wand2 className="w-10 h-10 text-purple-600 animate-pulse" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI is Creating Your Content...
                </h3>
                <p className={`${theme.secondary} text-lg`}>
                  Crafting personalized, high-quality content just for you
                </p>
                <div className="flex justify-center space-x-3 mt-6">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ✨ Your Content is Ready!
                  </h3>
                  <p className={`text-sm ${theme.secondary} mt-1`}>Review and customize as needed</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCopyContent}
                    className={`p-3 rounded-xl ${theme.border} hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300 shadow-md hover:shadow-lg`}
                    title="Copy to clipboard"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className={`p-6 rounded-2xl ${theme.code} border-2 ${theme.border} max-h-96 overflow-y-auto shadow-inner`}>
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">{generatedContent}</pre>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={resetGenerator}
                  className={`px-8 py-4 rounded-2xl border-2 ${theme.border} ${theme.text} hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 font-semibold`}
                >
                  🔄 Generate New
                </button>
                <button
                  onClick={handleUseContent}
                  className="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
                >
                  🚀 Use This Content
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 