import React, { useState } from "react";
import { Image, Palette, ZoomIn, Download, Sparkles, Layers, Grid, Settings } from "lucide-react";
import { useMultimodalStore } from "../stores/multimodal-store";

export const ImageGenerationTab: React.FC = () => {
  const { generateImage, isGeneratingImage, imagePrompt, setImagePrompt } = useMultimodalStore();
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!imagePrompt.trim()) return;
    const images = await generateImage(imagePrompt);
    setGeneratedImages(images);
  };

  return (
    <div className="p-4">
      <textarea value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} />
      <button onClick={handleGenerate} disabled={isGeneratingImage}>
        {isGeneratingImage ? "Generating..." : "Generate"}
      </button>
      <div>
        {generatedImages.map((img, idx) => <img key={idx} src={img} alt="Generated" />)}
      </div>
    </div>
  );
};




