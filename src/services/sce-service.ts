export const sce = {
  async generateVideo(params: { prompt: string }) {
    console.log("SCE generating video:", params);
    await new Promise(r => setTimeout(r, 2000));
    return ["mock-video.mp4"];
  }
};

export const suno = {
  async generateAudio(params: { text: string }) {
    console.log("Suno generating audio:", params);
    await new Promise(r => setTimeout(r, 1000));
    return "mock-audio.mp3";
  }
};


