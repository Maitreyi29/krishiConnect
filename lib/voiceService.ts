import { apiClient } from './api';

class VoiceService {
  private recognition: any | null = null; // Use 'any' to avoid type issues with SpeechRecognition
  private isListening = false;

  constructor() {
    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
      }
    }
  }

  // Text-to-Speech using backend API
  async textToSpeech(text: string, language: string = 'english'): Promise<void> {
    try {
      const audioBlob = await apiClient.textToSpeech(text, language);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        audioElement.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audioElement.onerror = (err) => {
          URL.revokeObjectURL(audioUrl);
          reject(err);
        };
        audioElement.play();
      });
    } catch (error) {
      console.error('Text-to-speech error:', error);
      throw error;
    }
  }

  // Speech-to-Text using Web Speech API
  async speechToText(language: string = 'english'): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        return reject(new Error('Speech recognition not supported'));
      }

      // Set language
      this.recognition.lang = language === 'hindi' ? 'hi-IN' : 'en-US';
      
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        resolve(transcript);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      if (this.isListening) {
        this.recognition.stop();
      }
      
      this.isListening = true;
      this.recognition.start();
    });
  }

  // Stop listening
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Check if currently listening
  getIsListening(): boolean {
    return this.isListening;
  }

  // Check if speech recognition is supported
  isSpeechRecognitionSupported(): boolean {
    return this.recognition !== null;
  }
}

// Export singleton instance
export const voiceService = new VoiceService();
export default voiceService;
