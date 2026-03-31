const axios = require('axios');

class GPTZeroAPI {
  constructor() {
    this.apiKey = process.env.GPTZERO_API_KEY;
    this.baseUrl = 'https://api.gptzero.me/v2';
  }

  async checkAIContent(text, title = '') {
    try {
      if (!this.apiKey) {
        return this.getMockResponse();
      }

      const response = await axios.post(
        `${this.baseUrl}/predict`,
        {
          document: text.substring(0, 50000), // Limit text length
          title: title.substring(0, 200)
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = this.parseResponse(response.data);

      return {
        success: true,
        aiScore: result.aiScore,
        humanScore: result.humanScore,
        confidence: result.confidence,
        sentences: result.sentences
      };
    } catch (error) {
      console.error('GPTZero API error:', error);
      return {
        success: false,
        error: 'Failed to check AI content with GPTZero',
        details: error.message
      };
    }
  }

  parseResponse(data) {
    try {
      const result = {
        aiScore: 0,
        humanScore: 0,
        confidence: 0,
        sentences: []
      };

      // GPTZero response structure
      if (data.documents && data.documents.length > 0) {
        const doc = data.documents[0];
        
        if (doc.classes) {
          result.aiScore = Math.round(doc.classes.ai || 0);
          result.humanScore = Math.round(doc.classes.human || 0);
          result.confidence = Math.round(doc.confidence || 0);
        }

        if (doc.sentences) {
          result.sentences = doc.sentences.map(sentence => ({
            text: sentence.text,
            aiProbability: Math.round(sentence.ai_probability * 100),
            humanProbability: Math.round(sentence.human_probability * 100),
            classification: sentence.classification
          }));
        }
      }

      return result;
    } catch (error) {
      console.error('Error parsing GPTZero response:', error);
      return {
        aiScore: 0,
        humanScore: 0,
        confidence: 0,
        sentences: []
      };
    }
  }

  getMockResponse() {
    // Mock response for development/testing
    const mockAIScore = Math.floor(Math.random() * 40) + 10; // 10-50% AI content
    const mockHumanScore = 100 - mockAIScore;
    
    const mockSentences = [
      {
        text: "This is the first sentence that appears to be human-written.",
        aiProbability: Math.floor(Math.random() * 30),
        humanProbability: Math.floor(Math.random() * 40) + 60,
        classification: "human"
      },
      {
        text: "This sentence demonstrates characteristics typical of AI-generated content.",
        aiProbability: Math.floor(Math.random() * 40) + 60,
        humanProbability: Math.floor(Math.random() * 30),
        classification: "ai"
      },
      {
        text: "Another example of human writing with natural flow and expression.",
        aiProbability: Math.floor(Math.random() * 20),
        humanProbability: Math.floor(Math.random() * 30) + 70,
        classification: "human"
      }
    ];

    return {
      success: true,
      aiScore: mockAIScore,
      humanScore: mockHumanScore,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
      sentences: mockSentences
    };
  }

  async batchCheck(texts) {
    try {
      const results = [];
      
      for (const text of texts) {
        const result = await this.checkAIContent(text);
        results.push(result);
      }

      return {
        success: true,
        results
      };
    } catch (error) {
      console.error('GPTZero batch check error:', error);
      return {
        success: false,
        error: 'Failed to perform batch AI content check',
        details: error.message
      };
    }
  }

  // Method to extract text from file buffer (for direct file processing)
  extractTextFromFile(buffer, fileType) {
    try {
      // This is a simplified implementation
      // In production, you'd use proper text extraction libraries
      // like pdf-parse, mammoth (for docx), etc.
      
      let text = '';
      
      switch (fileType.toLowerCase()) {
        case 'txt':
          text = buffer.toString('utf8');
          break;
        case 'pdf':
          // Mock text extraction for PDF
          text = buffer.toString('utf8').substring(0, 10000);
          break;
        case 'docx':
          // Mock text extraction for DOCX
          text = buffer.toString('utf8').substring(0, 10000);
          break;
        default:
          throw new Error('Unsupported file type');
      }

      return text;
    } catch (error) {
      console.error('Error extracting text from file:', error);
      throw new Error('Failed to extract text from file');
    }
  }
}

module.exports = new GPTZeroAPI();
