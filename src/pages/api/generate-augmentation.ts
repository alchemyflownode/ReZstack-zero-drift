// src/pages/api/generate-augmentation.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { generateAugmentation } from '../../services/ai-generation-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { profile } = req.body;
    const augmentation = await generateAugmentation(profile);
    
    res.status(200).json({
      ...augmentation,
      generatedAt: new Date().toISOString(),
      vibeStatement: "Creative, precise, and confident — delight within boundaries, never guess, never overdo."
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      error: 'Generation failed',
      fallback: {
        architectureTemplate: "Next.js App Router (Sovereign Shell)",
        recommendedStack: {
          architecture: { tool: "Next.js 14+", reason: "App Router for deterministic routing" },
          stateManagement: { tool: "Zustand", reason: "Minimalist, hook-based state management" },
          styling: { tool: "Tailwind CSS", reason: "Utility-first with your palette" },
          backend: { tool: "Server Actions", reason: "Direct data mutations without API layer" }
        },
        projectStructure: "ABC168Reality/\n├── app/\n├── components/\n└── lib/",
        files: [],
        warnings: [{ type: "Fallback", message: "Using cached architecture", suggestion: "Retry with AI connection" }]
      }
    });
  }
}
