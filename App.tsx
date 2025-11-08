import React, { useState, useCallback } from 'react';
import { type Message, type ChartData } from './types';
import { runChat } from './services/geminiService';
import ChatInterface from './components/ChatInterface';
import FileUpload from './components/FileUpload';
import { fileToGenerativePart } from './utils/file';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) {
      setMessages([]);
      setError(null);
    }
  };

  const parseVisualization = (responseText: string): { text: string; chartData: ChartData | null } => {
    const jsonRegex = /```json\n([\s\S]*?)\n```/;
    const match = responseText.match(jsonRegex);
  
    if (match && match[1]) {
      try {
        const chartData = JSON.parse(match[1]);
        // Basic validation
        if (chartData.title && chartData.labels && chartData.datasets) {
          const text = responseText.replace(jsonRegex, '').trim();
          return { text, chartData };
        }
      } catch (e) {
        console.error("Failed to parse chart JSON:", e);
        // Fallback to showing the raw text if parsing fails
        return { text: responseText, chartData: null };
      }
    }
  
    return { text: responseText, chartData: null };
  };

  const handleSendMessage = useCallback(async (prompt: string) => {
    if (!file) {
      setError("Please upload a file first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      role: 'user',
      parts: [{ text: prompt }],
    };

    if (messages.length === 0) {
      try {
        const filePart = await fileToGenerativePart(file);
        const initialPrompt = {
            text: `You are a specialized AI assistant for analyzing and summarizing academic and medical documents. A user has uploaded a document. Your first task is to provide a comprehensive summary based on the user's request. After that, you will answer follow-up questions based on the document's content.

IMPORTANT: If the user asks you to "visualize", "chart", "plot", or "graph" data from the document, you must:
1.  Provide a brief textual summary or introduction for the data visualization.
2.  Follow the summary with a JSON object enclosed in a markdown code block (\`\`\`json ... \`\`\`).
3.  The JSON object MUST conform to the following structure for creating a bar chart:
    {
      "title": "Chart Title",
      "labels": ["Label 1", "Label 2"],
      "datasets": [
        {
          "label": "Dataset 1 Name",
          "data": [value1, value2]
        }
      ]
    }

Here is the document.`
        };
        const userRequest = {
            text: `User request: "${prompt}"`
        }

        userMessage.parts = [initialPrompt, filePart, userRequest];
      } catch (e) {
        setError("Error processing file. Please try another file.");
        setIsLoading(false);
        return;
      }
    }
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const responseText = await runChat(updatedMessages);
      const { text, chartData } = parseVisualization(responseText);

      const modelMessage: Message = {
        role: 'model',
        parts: [{ text }],
        visualizationData: chartData,
      };
      setMessages([...updatedMessages, modelMessage]);
    } catch (e: any) {
      const errorMessage = e.message || 'An unexpected error occurred.';
      setError(`Error: ${errorMessage}`);
      const errorModelMessage: Message = {
          role: 'model',
          parts: [{ text: `Sorry, I encountered an error. ${errorMessage}` }]
      }
      setMessages(prev => [...prev, errorModelMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [file, messages]);

  return (
    <div className="bg-brand-bg text-text-main min-h-screen font-sans flex flex-col">
      <header className="sticky top-0 z-10 w-full bg-surface/80 backdrop-blur-md border-b border-border-color">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-primary">
            DocuMind Summarizer
          </h1>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col container mx-auto w-full max-w-4xl p-4">
        <div className="flex-1 flex flex-col gap-4">
          <FileUpload onFileChange={handleFileChange} file={file} />
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          <ChatInterface 
            messages={messages} 
            isLoading={isLoading} 
            onSendMessage={handleSendMessage}
            isFileLoaded={!!file}
          />
        </div>
      </main>

      <footer className="text-center p-4 text-text-secondary text-sm">
        Powered by Google Gemini
      </footer>
    </div>
  );
};

export default App;