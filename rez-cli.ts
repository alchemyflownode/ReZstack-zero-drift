import { quickStart } from './rez-engine-core.js';

async function main() {
  console.log('🎮 REZ CLI Test');
  console.log('===============');
  
  try {
    const result = await quickStart();
    
    if (result.success) {
      console.log('\n🎉 Success!');
      console.log('Backend:', result.backend);
      
      if (result.backend === 'comfyui' && result.result?.prompt_id) {
        console.log('Prompt ID:', result.result.prompt_id);
        console.log('Check ComfyUI at: http://localhost:8188');
      }
    } else {
      console.log('\n❌ Failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ CLI Error:', error);
  }
}

main();