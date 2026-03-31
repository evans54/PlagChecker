const axios = require('axios');

class CopyleaksAPI {
  constructor() {
    this.apiKey = process.env.COPYLEAKS_API_KEY;
    this.baseUrl = 'https://api.copyleaks.com/v2';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    try {
      if (!this.apiKey) {
        return null; // No API key configured
      }

      // Check if token is still valid
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      const response = await axios.post(
        `${this.baseUrl}/login/access-token`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      this.accessToken = response.data.access_token;
      // Set token expiry to 1 hour from now (minus 5 minutes buffer)
      this.tokenExpiry = Date.now() + (55 * 60 * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('Error getting Copyleaks access token:', error);
      return null;
    }
  }

  async checkPlagiarism(fileBuffer, fileName, fileType) {
    try {
      if (!this.apiKey) {
        return this.getMockResponse();
      }

      const token = await this.getAccessToken();
      if (!token) {
        throw new Error('Failed to get access token');
      }

      // Create a new scan
      const scanResponse = await axios.post(
        `${this.baseUrl}/scans/create`,
        {
          base64: fileBuffer.toString('base64'),
          filename: fileName,
          properties: {
            scan: {
              internet: {
                enabled: true
              },
              database: {
                enabled: true
              }
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const scanId = scanResponse.data.scanId;

      // Poll for results (in production, you'd use webhooks)
      const result = await this.pollForResult(scanId, token);

      return {
        success: true,
        scanId,
        plagiarismScore: result.score,
        sources: result.sources,
        totalWords: result.totalWords,
        matchedWords: result.matchedWords
      };
    } catch (error) {
      console.error('Copyleaks API error:', error);
      return {
        success: false,
        error: 'Failed to check plagiarism with Copyleaks',
        details: error.message
      };
    }
  }

  async pollForResult(scanId, token, maxAttempts = 10) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await axios.get(
          `${this.baseUrl}/scans/${scanId}/result`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const status = response.data.status;
        
        if (status === 'Completed') {
          return this.parseResult(response.data);
        } else if (status === 'Failed') {
          throw new Error('Scan failed');
        }

        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    throw new Error('Scan timeout');
  }

  parseResult(data) {
    try {
      const result = {
        score: 0,
        sources: [],
        totalWords: 0,
        matchedWords: 0
      };

      if (data.results && data.results.length > 0) {
        let totalSimilarity = 0;
        
        data.results.forEach(item => {
          if (item.url && item.percent) {
            result.sources.push({
              url: item.url,
              title: item.title || 'Unknown Source',
              similarity: Math.round(item.percent)
            });
            totalSimilarity += item.percent;
          }
        });

        // Calculate average similarity as score
        result.score = Math.round(totalSimilarity / data.results.length);
        result.totalWords = data.totalWords || 1500;
        result.matchedWords = Math.floor(result.totalWords * result.score / 100);
      }

      return result;
    } catch (error) {
      console.error('Error parsing Copyleaks result:', error);
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
    const mockScore = Math.floor(Math.random() * 25) + 8; // 8-33% plagiarism
    const mockSources = [
      {
        url: 'https://example.org/research1',
        title: 'Academic Paper 1',
        similarity: Math.floor(Math.random() * 25) + 15
      },
      {
        url: 'https://example.edu/article2',
        title: 'Research Article 2',
        similarity: Math.floor(Math.random() * 20) + 8
      },
      {
        url: 'https://example.com/blog3',
        title: 'Blog Post 3',
        similarity: Math.floor(Math.random() * 15) + 5
      }
    ].filter(source => source.similarity > mockScore);

    return {
      success: true,
      plagiarismScore: mockScore,
      sources: mockSources.slice(0, 3),
      totalWords: 1200,
      matchedWords: Math.floor(1200 * mockScore / 100)
    };
  }
}

module.exports = new CopyleaksAPI();
