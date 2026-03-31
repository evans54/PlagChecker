const axios = require('axios');

class CopyscapeAPI {
  constructor() {
    this.apiKey = process.env.COPYSCAPE_API_KEY;
    this.baseUrl = 'https://www.copyscape.com/api';
  }

  async checkPlagiarism(text, title = '') {
    try {
      if (!this.apiKey) {
        // Mock response for development
        return this.getMockResponse();
      }

      const params = new URLSearchParams({
        u: this.apiKey,
        o: 'csearch',
        e: 'UTF-8',
        t: text.substring(0, 2000), // Limit text length
        c: title.substring(0, 100)
      });

      const response = await axios.get(`${this.baseUrl}?${params}`);
      const result = this.parseResponse(response.data);

      return {
        success: true,
        plagiarismScore: result.score,
        sources: result.sources,
        totalWords: result.totalWords,
        matchedWords: result.matchedWords
      };
    } catch (error) {
      console.error('Copyscape API error:', error);
      return {
        success: false,
        error: 'Failed to check plagiarism with Copyscape',
        details: error.message
      };
    }
  }

  parseResponse(data) {
    try {
      const lines = data.split('\n');
      const result = {
        score: 0,
        sources: [],
        totalWords: 0,
        matchedWords: 0
      };

      for (const line of lines) {
        if (line.startsWith('count')) {
          const parts = line.split(',');
          result.totalWords = parseInt(parts[1]) || 0;
          result.matchedWords = parseInt(parts[2]) || 0;
          result.score = result.totalWords > 0 ? 
            Math.round((result.matchedWords / result.totalWords) * 100) : 0;
        } else if (line.startsWith('view')) {
          const parts = line.split(',');
          if (parts.length >= 4) {
            result.sources.push({
              url: parts[1],
              title: parts[2].replace(/"/g, ''),
              similarity: parseInt(parts[3]) || 0
            });
          }
        }
      }

      return result;
    } catch (error) {
      console.error('Error parsing Copyscape response:', error);
      return {
        score: 0,
        sources: [],
        totalWords: 0,
        matchedWords: 0
      };
    }
  }

  getMockResponse() {
    // Mock response for development/testing
    const mockScore = Math.floor(Math.random() * 30) + 5; // 5-35% plagiarism
    const mockSources = [
      {
        url: 'https://example.com/source1',
        title: 'Similar Article 1',
        similarity: Math.floor(Math.random() * 20) + 10
      },
      {
        url: 'https://example.com/source2',
        title: 'Similar Article 2',
        similarity: Math.floor(Math.random() * 15) + 5
      }
    ].filter(source => source.similarity > mockScore);

    return {
      success: true,
      plagiarismScore: mockScore,
      sources: mockSources.slice(0, 3),
      totalWords: 1500,
      matchedWords: Math.floor(1500 * mockScore / 100)
    };
  }
}

module.exports = new CopyscapeAPI();
