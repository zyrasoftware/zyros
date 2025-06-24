import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, AlertCircle, Check, Eye, BarChart3, FileText } from './Icons';
import { Theme } from '../styles/themes';

interface SEOAnalyzerProps {
  theme: Theme;
  customStyle?: React.CSSProperties | null;
  content: string;
  title: string;
  description?: string;
  keywords?: string[];
  onOptimizationSuggestion: (suggestions: SEOSuggestion[]) => void;
}

interface SEOSuggestion {
  type: 'error' | 'warning' | 'success' | 'info';
  category: 'title' | 'description' | 'content' | 'keywords' | 'readability' | 'structure';
  message: string;
  fix?: string;
  score: number;
}

interface SEOMetrics {
  titleScore: number;
  descriptionScore: number;
  contentScore: number;
  keywordScore: number;
  readabilityScore: number;
  structureScore: number;
  overallScore: number;
}

export default function SEOAnalyzer({ 
  theme, 
  customStyle,
  content, 
  title, 
  description = '', 
  keywords = [],
  onOptimizationSuggestion 
}: SEOAnalyzerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [suggestions, setSuggestions] = useState<SEOSuggestion[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (isOpen && (content || title)) {
      analyzeContent();
    }
  }, [isOpen, content, title, description, keywords]);

  const analyzeContent = async () => {
    setAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const analysis = performSEOAnalysis(content, title, description, keywords);
    setMetrics(analysis.metrics);
    setSuggestions(analysis.suggestions);
    onOptimizationSuggestion(analysis.suggestions);
    
    setAnalyzing(false);
  };

  const performSEOAnalysis = (
    content: string, 
    title: string, 
    description: string, 
    keywords: string[]
  ): { metrics: SEOMetrics; suggestions: SEOSuggestion[] } => {
    const suggestions: SEOSuggestion[] = [];
    
    // Title Analysis
    const titleScore = analyzeTitleSEO(title, suggestions);
    
    // Description Analysis
    const descriptionScore = analyzeDescriptionSEO(description, suggestions);
    
    // Content Analysis
    const contentScore = analyzeContentSEO(content, suggestions);
    
    // Keywords Analysis
    const keywordScore = analyzeKeywordsSEO(content, title, description, keywords, suggestions);
    
    // Readability Analysis
    const readabilityScore = analyzeReadability(content, suggestions);
    
    // Structure Analysis
    const structureScore = analyzeStructure(content, suggestions);
    
    const overallScore = Math.round(
      (titleScore + descriptionScore + contentScore + keywordScore + readabilityScore + structureScore) / 6
    );

    return {
      metrics: {
        titleScore,
        descriptionScore,
        contentScore,
        keywordScore,
        readabilityScore,
        structureScore,
        overallScore
      },
      suggestions: suggestions.sort((a, b) => {
        const typeOrder = { error: 0, warning: 1, info: 2, success: 3 };
        return typeOrder[a.type] - typeOrder[b.type];
      })
    };
  };

  const analyzeTitleSEO = (title: string, suggestions: SEOSuggestion[]): number => {
    let score = 0;
    
    if (!title) {
      suggestions.push({
        type: 'error',
        category: 'title',
        message: 'Title is missing',
        fix: 'Add a descriptive title to your content',
        score: 0
      });
      return 0;
    }
    
    if (title.length < 30) {
      suggestions.push({
        type: 'warning',
        category: 'title',
        message: 'Title is too short',
        fix: 'Expand your title to 30-60 characters for better SEO',
        score: 40
      });
      score = 40;
    } else if (title.length > 60) {
      suggestions.push({
        type: 'warning',
        category: 'title',
        message: 'Title is too long',
        fix: 'Shorten your title to under 60 characters to avoid truncation in search results',
        score: 60
      });
      score = 60;
    } else {
      suggestions.push({
        type: 'success',
        category: 'title',
        message: 'Title length is optimal',
        score: 100
      });
      score = 100;
    }
    
    return score;
  };

  const analyzeDescriptionSEO = (description: string, suggestions: SEOSuggestion[]): number => {
    let score = 0;
    
    if (!description) {
      suggestions.push({
        type: 'error',
        category: 'description',
        message: 'Meta description is missing',
        fix: 'Add a compelling meta description (120-160 characters)',
        score: 0
      });
      return 0;
    }
    
    if (description.length < 120) {
      suggestions.push({
        type: 'warning',
        category: 'description',
        message: 'Meta description is too short',
        fix: 'Expand your description to 120-160 characters',
        score: 50
      });
      score = 50;
    } else if (description.length > 160) {
      suggestions.push({
        type: 'warning',
        category: 'description',
        message: 'Meta description is too long',
        fix: 'Shorten your description to under 160 characters',
        score: 70
      });
      score = 70;
    } else {
      suggestions.push({
        type: 'success',
        category: 'description',
        message: 'Meta description length is optimal',
        score: 100
      });
      score = 100;
    }
    
    return score;
  };

  const analyzeContentSEO = (content: string, suggestions: SEOSuggestion[]): number => {
    let score = 0;
    const wordCount = content.split(/\s+/).length;
    
    if (wordCount < 300) {
      suggestions.push({
        type: 'warning',
        category: 'content',
        message: 'Content is too short',
        fix: 'Add more content. Aim for at least 300 words for better SEO',
        score: 40
      });
      score = 40;
    } else if (wordCount > 2000) {
      suggestions.push({
        type: 'info',
        category: 'content',
        message: 'Content is very long',
        fix: 'Consider breaking this into multiple pages or adding a table of contents',
        score: 80
      });
      score = 80;
    } else {
      suggestions.push({
        type: 'success',
        category: 'content',
        message: `Content length is good (${wordCount} words)`,
        score: 100
      });
      score = 100;
    }
    
    return score;
  };

  const analyzeKeywordsSEO = (
    content: string, 
    title: string, 
    description: string, 
    keywords: string[], 
    suggestions: SEOSuggestion[]
  ): number => {
    if (keywords.length === 0) {
      suggestions.push({
        type: 'warning',
        category: 'keywords',
        message: 'No keywords specified',
        fix: 'Add 3-5 relevant keywords for your content',
        score: 30
      });
      return 30;
    }
    
    const contentLower = content.toLowerCase();
    const titleLower = title.toLowerCase();
    const descriptionLower = description.toLowerCase();
    
    let keywordScore = 0;
    let keywordsInTitle = 0;
    let keywordsInDescription = 0;
    let keywordsInContent = 0;
    
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      if (titleLower.includes(keywordLower)) keywordsInTitle++;
      if (descriptionLower.includes(keywordLower)) keywordsInDescription++;
      if (contentLower.includes(keywordLower)) keywordsInContent++;
    });
    
    if (keywordsInTitle === 0) {
      suggestions.push({
        type: 'warning',
        category: 'keywords',
        message: 'No keywords found in title',
        fix: 'Include at least one target keyword in your title',
        score: 50
      });
    } else {
      keywordScore += 30;
    }
    
    if (keywordsInDescription === 0) {
      suggestions.push({
        type: 'warning',
        category: 'keywords',
        message: 'No keywords found in description',
        fix: 'Include target keywords in your meta description',
        score: 50
      });
    } else {
      keywordScore += 30;
    }
    
    if (keywordsInContent === 0) {
      suggestions.push({
        type: 'error',
        category: 'keywords',
        message: 'No keywords found in content',
        fix: 'Naturally incorporate your target keywords throughout the content',
        score: 20
      });
    } else {
      keywordScore += 40;
    }
    
    if (keywordScore === 100) {
      suggestions.push({
        type: 'success',
        category: 'keywords',
        message: 'Keywords are well distributed',
        score: 100
      });
    }
    
    return keywordScore;
  };

  const analyzeReadability = (content: string, suggestions: SEOSuggestion[]): number => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/);
    const avgWordsPerSentence = words.length / sentences.length;
    
    let score = 100;
    
    if (avgWordsPerSentence > 20) {
      suggestions.push({
        type: 'warning',
        category: 'readability',
        message: 'Sentences are too long on average',
        fix: 'Try to keep sentences under 20 words for better readability',
        score: 60
      });
      score = 60;
    } else if (avgWordsPerSentence < 8) {
      suggestions.push({
        type: 'info',
        category: 'readability',
        message: 'Sentences are very short',
        fix: 'Consider varying sentence length for better flow',
        score: 80
      });
      score = 80;
    } else {
      suggestions.push({
        type: 'success',
        category: 'readability',
        message: 'Sentence length is optimal for readability',
        score: 100
      });
    }
    
    return score;
  };

  const analyzeStructure = (content: string, suggestions: SEOSuggestion[]): number => {
    const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
    const h1Count = (content.match(/^#\s+.+$/gm) || []).length;
    
    let score = 0;
    
    if (h1Count === 0) {
      suggestions.push({
        type: 'error',
        category: 'structure',
        message: 'No H1 heading found',
        fix: 'Add one H1 heading to your content',
        score: 30
      });
      score = 30;
    } else if (h1Count > 1) {
      suggestions.push({
        type: 'warning',
        category: 'structure',
        message: 'Multiple H1 headings found',
        fix: 'Use only one H1 heading per page',
        score: 70
      });
      score = 70;
    } else {
      score += 50;
    }
    
    if (headings.length < 2) {
      suggestions.push({
        type: 'warning',
        category: 'structure',
        message: 'Not enough headings for structure',
        fix: 'Add more headings (H2, H3) to organize your content',
        score: score + 20
      });
      score += 20;
    } else {
      suggestions.push({
        type: 'success',
        category: 'structure',
        message: 'Good heading structure',
        score: 100
      });
      score = 100;
    }
    
    return score;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number): string => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (!isOpen) {
    const defaultStyle = {
      position: 'fixed' as const,
      bottom: '1.5rem',
      left: '1.5rem',
      padding: '1rem',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#ffffff',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      zIndex: 50,
      border: 'none',
      cursor: 'pointer'
    };

    return (
      <button
        onClick={() => setIsOpen(true)}
        className="transition-all duration-300 hover:scale-110 group"
        style={customStyle || defaultStyle}
      >
        <Search className="w-6 h-6" />
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          SEO Analyzer
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${theme.card} border ${theme.border} shadow-2xl`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${theme.accent}`}>SEO Analyzer</h2>
                <p className={`text-sm ${theme.secondary}`}>Optimize your content for search engines</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-2 rounded-lg ${theme.border} hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {analyzing ? (
            <div className="text-center space-y-6">
              <div className="animate-spin w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full mx-auto"></div>
              <div>
                <h3 className={`text-lg font-semibold ${theme.accent} mb-2`}>Analyzing Content...</h3>
                <p className={`${theme.secondary}`}>Evaluating SEO factors and generating recommendations</p>
              </div>
            </div>
          ) : metrics ? (
            <div className="space-y-8">
              {/* Overall Score */}
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold ${getScoreColor(metrics.overallScore)} ${getScoreBackground(metrics.overallScore)} mb-4`}>
                  {metrics.overallScore}
                </div>
                <h3 className={`text-xl font-semibold ${theme.accent} mb-2`}>Overall SEO Score</h3>
                <p className={`${theme.secondary}`}>
                  {metrics.overallScore >= 80 ? 'Excellent SEO optimization!' :
                   metrics.overallScore >= 60 ? 'Good SEO with room for improvement' :
                   'Needs significant SEO improvements'}
                </p>
              </div>

              {/* Detailed Scores */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Title', score: metrics.titleScore, icon: <FileText className="w-4 h-4" /> },
                  { label: 'Description', score: metrics.descriptionScore, icon: <Eye className="w-4 h-4" /> },
                  { label: 'Content', score: metrics.contentScore, icon: <BarChart3 className="w-4 h-4" /> },
                  { label: 'Keywords', score: metrics.keywordScore, icon: <Search className="w-4 h-4" /> },
                  { label: 'Readability', score: metrics.readabilityScore, icon: <TrendingUp className="w-4 h-4" /> },
                  { label: 'Structure', score: metrics.structureScore, icon: <Check className="w-4 h-4" /> }
                ].map((item, index) => (
                  <div key={index} className={`p-4 rounded-xl ${theme.card} border ${theme.border}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {item.icon}
                      <span className={`text-sm font-medium ${theme.accent}`}>{item.label}</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                      {item.score}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          item.score >= 80 ? 'bg-green-600' :
                          item.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div>
                <h4 className={`text-lg font-semibold ${theme.accent} mb-4`}>Optimization Suggestions</h4>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border-l-4 ${
                        suggestion.type === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                        suggestion.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                        suggestion.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                        'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      } ${theme.card}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-1 rounded-full ${
                          suggestion.type === 'error' ? 'text-red-600' :
                          suggestion.type === 'warning' ? 'text-yellow-600' :
                          suggestion.type === 'success' ? 'text-green-600' :
                          'text-blue-600'
                        }`}>
                          {suggestion.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-medium uppercase tracking-wide ${
                              suggestion.type === 'error' ? 'text-red-600' :
                              suggestion.type === 'warning' ? 'text-yellow-600' :
                              suggestion.type === 'success' ? 'text-green-600' :
                              'text-blue-600'
                            }`}>
                              {suggestion.category}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getScoreBackground(suggestion.score)} ${getScoreColor(suggestion.score)}`}>
                              {suggestion.score}/100
                            </span>
                          </div>
                          <p className={`${theme.text} mb-1`}>{suggestion.message}</p>
                          {suggestion.fix && (
                            <p className={`text-sm ${theme.secondary}`}>💡 {suggestion.fix}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={analyzeContent}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 transition-all duration-300 hover:scale-105"
                >
                  Re-analyze
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`px-6 py-3 rounded-xl border ${theme.border} ${theme.text} hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className={`${theme.secondary} mb-4`}>Click "Analyze" to evaluate your content's SEO performance</p>
              <button
                onClick={analyzeContent}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 transition-all duration-300 hover:scale-105"
              >
                Start Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 