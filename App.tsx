
import React, { useState, useCallback, useMemo } from 'react';
import { editImageWithGemini } from './services/geminiService';
import { UploadIcon, SparklesIcon, ErrorIcon } from './components/icons';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      setEditedImage(null);
      setOriginalFile(file);
      fileToBase64(file).then(setOriginalImage).catch(err => {
        console.error("Error converting file to base64", err);
        setError("Failed to load image. Please try another file.");
      });
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!originalFile || !prompt) return;

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const base64Data = (await fileToBase64(originalFile)).split(',')[1];
      const mimeType = originalFile.type;
      
      const editedImageBase64 = await editImageWithGemini(base64Data, mimeType, prompt);
      
      setEditedImage(`data:${mimeType};base64,${editedImageBase64}`);

    } catch (err) {
      console.error(err);
      setError('Failed to generate image. The model may be overloaded. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [originalFile, prompt]);

  const isGenerateDisabled = useMemo(() => isLoading || !prompt || !originalImage, [isLoading, prompt, originalImage]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
            AI Image Editor
          </h1>
          <p className="text-gray-400 mt-2">Bring your creative visions to life with the power of Gemini.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Controls */}
          <div className="flex flex-col gap-6 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg">
            {!originalImage ? (
              <ImageUploader onImageUpload={handleImageUpload} />
            ) : (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-gray-300 mb-3">Original Image</h2>
                  <div className="aspect-square w-full rounded-xl overflow-hidden border-2 border-dashed border-gray-600 flex items-center justify-center">
                    <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="prompt" className="text-lg font-semibold text-gray-300">
                    Editing Prompt
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'Change the background to a futuristic cityscape at night' or 'make this a pop art style painting'"
                    className="w-full h-24 p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none text-gray-200 placeholder-gray-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerateDisabled}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                  >
                    <SparklesIcon />
                    {isLoading ? 'Generating...' : 'Generate'}
                  </button>
                </div>
                 <button
                  onClick={() => {
                    setOriginalImage(null);
                    setOriginalFile(null);
                    setEditedImage(null);
                    setPrompt('');
                    setError(null);
                  }}
                  className="w-full mt-auto text-center text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Start Over
                </button>
              </>
            )}
          </div>

          {/* Right Panel: Output */}
          <div className="flex flex-col p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg aspect-square">
            <h2 className="text-lg font-semibold text-gray-300 mb-3">Edited Image</h2>
            <div className="flex-1 flex items-center justify-center w-full h-full bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-600 overflow-hidden">
              {isLoading && <LoadingSpinner />}
              {error && <ErrorMessage message={error} />}
              {editedImage && !isLoading && (
                <img src={editedImage} alt="Edited" className="w-full h-full object-contain" />
              )}
              {!isLoading && !error && !editedImage && (
                <div className="text-center text-gray-500">
                  <SparklesIcon className="mx-auto h-12 w-12" />
                  <p className="mt-2">Your creation will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};


const ImageUploader: React.FC<{ onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void }> = ({ onImageUpload }) => (
  <div className="flex flex-col items-center justify-center h-full w-full">
    <label
      htmlFor="file-upload"
      className="relative cursor-pointer w-full h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-xl hover:bg-gray-700/50 hover:border-indigo-500 transition-all duration-300"
    >
      <div className="text-center p-8">
        <UploadIcon />
        <p className="mt-4 text-xl font-semibold">Upload an Image</p>
        <p className="mt-1 text-sm text-gray-400">Click to browse or drag and drop</p>
        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
      </div>
      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onImageUpload} accept="image/png, image/jpeg, image/gif" />
    </label>
  </div>
);

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-gray-400">
    <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="mt-4 text-lg">Generating your image...</p>
    <p className="text-sm text-gray-500">This might take a moment.</p>
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center text-red-400 p-4">
    <ErrorIcon className="mx-auto" />
    <p className="mt-2 font-semibold">An Error Occurred</p>
    <p className="text-sm text-red-300">{message}</p>
  </div>
);

export default App;
