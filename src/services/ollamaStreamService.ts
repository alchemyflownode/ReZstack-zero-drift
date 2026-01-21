/**
 * Streaming Ollama Interface with Real-Time Token Parsing
 * Enables live bytecode generation with human-in-the-loop editing.
 */

export interface StreamCallback {
  onToken: (partialText: string) => void;
  onComplete: (finalText: string) => void;
  onError: (error: string) => void;
}

export const streamToOllama = async (
  prompt: string,
  model: string = "llama3",
  callbacks: StreamCallback
): Promise<void> => {
  const { onToken, onComplete, onError } = callbacks;

  try {
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error("Failed to connect to Ollama streaming endpoint");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(line => line.trim() !== "");

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) {
            accumulated += json.response;
            onToken(accumulated); // Emit partial bytecode
          }
          if (json.done) {
            onComplete(accumulated);
            return;
          }
        } catch (e) {
          // Ignore malformed lines (common in streaming)
        }
      }
    }

    onComplete(accumulated);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown stream error";
    onError(msg);
  }
};


