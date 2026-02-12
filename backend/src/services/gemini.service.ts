import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateProductDescription(
    productName: string,
    category: string,
    brandName: string
  ): Promise<string> {
    try {
      const prompt = `Write a premium, high-converting fashion product description for a ${productName} in the ${category} category for the brand ${brandName}. Focus on luxury, quality, and lifestyle. Keep it under 100 words. Make it compelling and professional.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text() || 'Could not generate description.';
    } catch (error) {
      console.error('Gemini Error:', error);
      return 'Error generating AI description.';
    }
  }

  async generateSEOKeywords(productName: string): Promise<string[]> {
    try {
      const prompt = `Provide 5 SEO keywords for a fashion product called "${productName}". Return only the keywords separated by commas, no additional text.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0)
        .slice(0, 5);
    } catch (error) {
      console.error('Gemini Error:', error);
      return [];
    }
  }

  async generateCategoryDescription(
    categoryName: string,
    brandName: string
  ): Promise<string> {
    try {
      const prompt = `Write a compelling category description for "${categoryName}" in a fashion e-commerce store for the brand ${brandName}. Focus on the style, quality, and appeal of this category. Keep it under 80 words.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text() || 'Could not generate description.';
    } catch (error) {
      console.error('Gemini Error:', error);
      return 'Error generating category description.';
    }
  }
}

export const geminiService = new GeminiService();
