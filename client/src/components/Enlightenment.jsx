import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

const Enlightenment = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const prompts = useMemo(() => [
    'Generate a brief and concise educational message about blood groups or blood donations.',
    'Explain the importance of regular blood donation in a few sentences.',
    'What are the different blood types and their significance? Summarize briefly.',
    'How does blood donation impact community health? Keep it short.'
  ], []);

  const generateText = async (input) => {
    try {
      const response = await axios.post('http://localhost:8080/generateText', { input });
      return response.data.output; 
    } catch (error) {
      console.error('Error generating text:', error);
      return 'Failed to generate text.';
    }
  };

  const fetchMessage = useCallback(async () => {
    setLoading(true); 
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]; 
    const generatedText = await generateText(randomPrompt);
    setMessage(generatedText);
    setLoading(false); 
  }, [prompts]); 

  useEffect(() => {
    fetchMessage(); // Fetch the initial message

    const intervalId = setInterval(fetchMessage, 60000); // Fetch a new message every 60 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [fetchMessage]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl w-full text-center">
        <h2 className="text-xl font-semibold mb-4 text-black">Education and Awareness</h2>
        {loading ? (
          <p className="text-gray-700">Loading...</p>
        ) : (
          <p className="text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Enlightenment;
