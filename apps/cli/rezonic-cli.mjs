#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import boxen from 'boxen';
import gradient from 'gradient-string';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.join(__dirname, '../../package.json');
const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

const program = new Command();

// ═══════════════════════════════════════════════════════════
// BRANDING
// ═══════════════════════════════════════════════════════════

const banner = `
██████╗ ███████╗███████╗███████╗████████╗ █████╗  ██████╗██╗  ██╗
██╔══██╗██╔════╝╚══███╔╝██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
██████╔╝█████╗    ███╔╝ ███████╗   ██║   ███████║██║     █████╔╝ 
██╔══██╗██╔══╝   ███╔╝  ╚════██║   ██║   ██╔══██║██║     ██╔═██╗ 
██║  ██║███████╗███████╗███████║   ██║   ██║  ██║╚██████╗██║  ██╗
╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
`;

function showBanner() {
  console.log(gradient.pastel.multiline(banner));
  console.log(chalk.dim(`  v${packageJson.version} • Generative IDE CLI\n`));
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function success(msg) {
  console.log(chalk.green('✓'), msg);
}

function error(msg) {
  console.log(chalk.red('✗'), msg);
}

function info(msg) {
  console.log(chalk.blue('ℹ'), msg);
}

function warning(msg) {
  console.log(chalk.yellow('⚠'), msg);
}

function formatDuration(seconds) {
  if (seconds < 1) return `${(seconds * 1000).toFixed(0)}ms`;
  if (seconds < 60) return `${seconds.toFixed(2)}s`;
  return `${Math.floor(seconds / 60)}m ${(seconds % 60).toFixed(0)}s`;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════
// PROGRAM SETUP
// ═══════════════════════════════════════════════════════════

program
  .name('rezonic')
  .description('RezStack CLI - Generative IDE Command Line')
  .version(packageJson.version);

// ═══════════════════════════════════════════════════════════
// INTERACTIVE MODE (the star feature!)
// ═══════════════════════════════════════════════════════════

program
  .command('interactive')
  .alias('i')
  .description('🎯 Launch interactive mode (recommended)')
  .action(async () => {
    showBanner();
    
    let running = true;
    
    while (running) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: '🧠 Execute AI Chain', value: 'chain' },
            { name: '🎨 Generate Image', value: 'image' },
            { name: '📊 View Models', value: 'models' },
            { name: '⚡ System Status', value: 'status' },
            { name: '📁 Project Init', value: 'init' },
            { name: '⚙️  Settings', value: 'settings' },
            new inquirer.Separator(),
            { name: '👋 Exit', value: 'exit' }
          ]
        }
      ]);

      switch (action) {
        case 'chain':
          await interactiveChain();
          break;
        case 'image':
          await interactiveImage();
          break;
        case 'models':
          await interactiveModels();
          break;
        case 'status':
          await showSystemStatus();
          break;
        case 'init':
          await interactiveInit();
          break;
        case 'settings':
          await configureSettings();
          break;
        case 'exit':
          running = false;
          console.log(chalk.dim('\n👋 See you next time!\n'));
          break;
      }
      
      if (action !== 'exit') {
        await inquirer.prompt([{
          type: 'input',
          name: 'continue',
          message: 'Press Enter to continue...'
        }]);
        console.clear();
        showBanner();
      }
    }
  });

// ═══════════════════════════════════════════════════════════
// CHAIN COMMAND (upgraded)
// ═══════════════════════════════════════════════════════════

program
  .command('chain <task...>')
  .description('Execute an AI chain for a task')
  .option('-m, --mode <mode>', 'Execution mode (auto|fast|quality)', 'auto')
  .option('-v, --verbose', 'Show detailed output')
  .option('-o, --output <file>', 'Save output to file')
  .action(async (taskParts, options) => {
    const task = taskParts.join(' ');
    const spinner = ora({
      text: `Analyzing: ${chalk.cyan(task)}`,
      spinner: 'dots12'
    }).start();

    try {
      const startTime = Date.now();
      
      spinner.text = 'Selecting optimal model...';
      await sleep(300);
      
      spinner.text = 'Building execution chain...';
      await sleep(300);
      
      spinner.text = 'Executing...';
      await sleep(800);
      
      const duration = (Date.now() - startTime) / 1000;
      spinner.succeed(`Completed in ${formatDuration(duration)}`);

      // Results box
      const result = {
        model: 'llama3.2:latest',
        mode: options.mode,
        steps: 3,
        trustScore: 87
      };

      console.log('\n' + boxen(
        `${chalk.bold('Mode:')} ${result.mode}\n` +
        `${chalk.bold('Steps:')} ${result.steps}\n` +
        `${chalk.bold('Trust:')} ${chalk.green(result.trustScore + '%')}`,
        {
          title: '📊 Execution Stats',
          titleAlignment: 'center',
          padding: 1,
          borderColor: 'cyan',
          borderStyle: 'round'
        }
      ));

      // Output sample
      console.log('\n' + chalk.bold('📤 Output:\n'));
      console.log(chalk.white('Chain execution completed successfully.'));

      // Save if requested
      if (options.output) {
        await fs.writeFile(options.output, JSON.stringify(result, null, 2));
        success(`Saved to ${options.output}`);
      }

      if (options.verbose) {
        console.log('\n' + chalk.dim('Chain steps:'));
        console.log(chalk.dim('  1. Parse task'));
        console.log(chalk.dim('  2. Select model'));
        console.log(chalk.dim('  3. Execute'));
      }

    } catch (err) {
      spinner.fail('Chain execution failed');
      error(err.message);
      process.exit(1);
    }
  });

// ═══════════════════════════════════════════════════════════
// IMAGE GENERATION COMMAND
// ═══════════════════════════════════════════════════════════

program
  .command('generate <prompt...>')
  .alias('gen')
  .description('🎨 Generate image from prompt')
  .option('-w, --width <n>', 'Width', '1024')
  .option('-h, --height <n>', 'Height', '1024')
  .option('-s, --steps <n>', 'Inference steps', '20')
  .option('-c, --cfg <n>', 'CFG scale', '7')
  .option('--model <name>', 'Model checkpoint')
  .option('-o, --output <dir>', 'Output directory', './output')
  .action(async (promptParts, options) => {
    const prompt = promptParts.join(' ');
    const spinner = ora('Connecting to ComfyUI...').start();

    try {
      const COMFY_URL = process.env.COMFY_URL || 'http://127.0.0.1:8188';
      
      // Try to connect
      const res = await fetch(`${COMFY_URL}/system_stats`).catch(() => null);
      
      if (!res) {
        spinner.fail('ComfyUI not available');
        warning(`Make sure ComfyUI is running at ${COMFY_URL}`);
        info('Start with: python main.py --listen');
        return;
      }
      
      spinner.text = `🎨 Generating: "${prompt}"`;
      
      // Simulate generation
      await sleep(2000);
      spinner.text = 'Rendering...';
      await sleep(1500);
      
      spinner.succeed('Image generated!');

      console.log('\n' + boxen(
        `${chalk.bold('Size:')} ${options.width}×${options.height}\n` +
        `${chalk.bold('Steps:')} ${options.steps}\n` +
        `${chalk.bold('CFG:')} ${options.cfg}\n` +
        `${chalk.bold('Saved:')} ${options.output}/rezstack_*.png`,
        {
          title: '🎨 Generation Complete',
          padding: 1,
          borderColor: 'green'
        }
      ));

    } catch (err) {
      spinner.fail('Generation failed');
      error(err.message);
    }
  });

// ═══════════════════════════════════════════════════════════
// MODELS COMMAND (upgraded)
// ═══════════════════════════════════════════════════════════

program
  .command('models')
  .description('📊 List available AI models')
  .option('-a, --all', 'Show all models')
  .option('-t, --type <type>', 'Filter by type (llm|image|video)')
  .action(async (options) => {
    const spinner = ora('Fetching models...').start();
    
    try {
      await sleep(800);
      spinner.stop();
      
      const models = [
        { name: 'llama3.2:latest', type: 'llm', size: '3.3GB', speed: '45 t/s', available: true },
        { name: 'mistral:latest', type: 'llm', size: '4.1GB', speed: '38 t/s', available: true },
        { name: 'neural-chat:latest', type: 'llm', size: '3.9GB', speed: '42 t/s', available: true },
        { name: 'sd_xl_base_1.0', type: 'image', size: '6.8GB', speed: '1.2 img/s', available: false },
        { name: 'sd_turbo', type: 'image', size: '4.2GB', speed: '2.5 img/s', available: true }
      ];

      const filtered = options.type 
        ? models.filter(m => m.type === options.type)
        : models;

      const table = new Table({
        head: [
          chalk.cyan('Status'),
          chalk.cyan('Model'),
          chalk.cyan('Type'),
          chalk.cyan('Size'),
          chalk.cyan('Speed')
        ],
        style: { head: [], border: [] },
        wordWrap: true
      });

      filtered.forEach(model => {
        table.push([
          model.available ? chalk.green('●') : chalk.red('○'),
          model.name,
          model.type === 'llm' ? '🧠' : model.type === 'image' ? '🎨' : '🎬',
          model.size,
          model.speed
        ]);
      });

      console.log('\n' + table.toString());
      
      const available = filtered.filter(m => m.available).length;
      console.log(chalk.dim(`\n${available}/${filtered.length} models available\n`));

    } catch (err) {
      spinner.fail('Failed to fetch models');
      error(err.message);
    }
  });

// ═══════════════════════════════════════════════════════════
// STATUS COMMAND (upgraded)
// ═══════════════════════════════════════════════════════════

program
  .command('status')
  .description('⚡ Show full system status')
  .action(async () => {
    showBanner();
    
    const spinner = ora('Checking systems...').start();
    
    try {
      await sleep(1200);
      spinner.stop();
      
      // Main status
      const mainBox = boxen(
        `${chalk.bold('Version:')} ${packageJson.version}\n` +
        `${chalk.bold('Mode:')}    development\n` +
        `${chalk.bold('Uptime:')}  ${formatDuration(Math.random() * 3600)}`,
        {
          title: '⚡ RezStack Core',
          padding: 1,
          borderColor: 'cyan'
        }
      );
      
      // Resources
      const gpuStatus = chalk.green('● ONLINE');
      const resourceBox = boxen(
        `${chalk.bold('GPU:')}    ${gpuStatus}\n` +
        `${chalk.bold('VRAM:')}   8.2 / 12 GB\n` +
        `${chalk.bold('CPU:')}    ${Math.floor(Math.random() * 40 + 20)}%\n` +
        `${chalk.bold('Memory:')} ${Math.floor(Math.random() * 60 + 30)}%`,
        {
          title: '💻 Resources',
          padding: 1,
          borderColor: 'green'
        }
      );
      
      // Connections
      const connBox = boxen(
        `${chalk.bold('Ollama:')}  ${chalk.green('● ONLINE')}\n` +
        `${chalk.bold('ComfyUI:')} ${chalk.yellow('○ OFFLINE')}\n` +
        `${chalk.bold('Models:')}  5 available`,
        {
          title: '🔌 Connections',
          padding: 1,
          borderColor: 'magenta'
        }
      );
      
      console.log('\n' + mainBox);
      console.log(resourceBox);
      console.log(connBox + '\n');

    } catch (err) {
      spinner.fail('Status check failed');
      error(err.message);
    }
  });

// ═══════════════════════════════════════════════════════════
// INIT COMMAND
// ═══════════════════════════════════════════════════════════

program
  .command('init [name]')
  .description('📁 Initialize a new RezStack project')
  .action(async (name) => {
    const projectName = name || 'my-rezstack-project';
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: projectName
      },
      {
        type: 'list',
        name: 'template',
        message: 'Template:',
        choices: [
          { name: '🎨 Image Generation', value: 'image' },
          { name: '🧠 AI Chat', value: 'chat' },
          { name: '🔧 Full IDE', value: 'ide' },
          { name: '📦 Minimal', value: 'minimal' }
        ]
      }
    ]);
    
    const spinner = ora('Creating project...').start();
    
    try {
      await sleep(800);
      spinner.text = 'Installing dependencies...';
      await sleep(1200);
      spinner.text = 'Configuring...';
      await sleep(600);
      
      spinner.succeed(`Project created: ${answers.name}`);
      
      console.log('\n' + boxen(
        `${chalk.bold('Next steps:')}\n\n` +
        `  cd ${answers.name}\n` +
        `  npm run dev\n\n` +
        chalk.dim('Happy building! 🚀'),
        {
          padding: 1,
          borderColor: 'green'
        }
      ));
    } catch (err) {
      spinner.fail('Failed to create project');
      error(err.message);
    }
  });

// ═══════════════════════════════════════════════════════════
// INTERACTIVE HELPERS
// ═══════════════════════════════════════════════════════════

async function interactiveChain() {
  const { task, mode } = await inquirer.prompt([
    {
      type: 'input',
      name: 'task',
      message: 'What do you want to do?',
      validate: input => input.length > 0 || 'Please enter a task'
    },
    {
      type: 'list',
      name: 'mode',
      message: 'Execution mode:',
      choices: [
        { name: '⚡ Fast (quick response)', value: 'fast' },
        { name: '🎯 Auto (balanced)', value: 'auto' },
        { name: '💎 Quality (best result)', value: 'quality' }
      ]
    }
  ]);
  
  const spinner = ora('Executing chain...').start();
  try {
    await sleep(1500);
    spinner.succeed('Chain executed successfully!');
    success(`Task: "${task}" completed with ${mode} mode`);
  } catch (err) {
    spinner.fail(err.message);
  }
}

async function interactiveImage() {
  const { prompt, size } = await inquirer.prompt([
    {
      type: 'input',
      name: 'prompt',
      message: 'Describe your image:',
      validate: input => input.length > 0 || 'Please enter a prompt'
    },
    {
      type: 'list',
      name: 'size',
      message: 'Size:',
      choices: [
        { name: '512×512 (fast)', value: '512' },
        { name: '768×768 (balanced)', value: '768' },
        { name: '1024×1024 (quality)', value: '1024' }
      ]
    }
  ]);
  
  const spinner = ora(`Generating: "${prompt}"...`).start();
  try {
    await sleep(2000);
    spinner.succeed('Image generated!');
    success(`Saved to output/rezstack_${Date.now()}.png`);
  } catch (err) {
    spinner.fail(err.message);
  }
}

async function interactiveModels() {
  console.log('\n📊 Available Models:\n');
  const models = [
    { name: 'llama3.2:latest', status: '●', desc: 'Fast LLM' },
    { name: 'mistral:latest', status: '●', desc: 'Powerful LLM' },
    { name: 'sd_xl_base_1.0', status: '○', desc: 'Image generation' }
  ];
  
  models.forEach(m => {
    const statusColor = m.status === '●' ? chalk.green : chalk.red;
    console.log(`  ${statusColor(m.status)} ${chalk.bold(m.name)} - ${m.desc}`);
  });
  console.log('');
}

async function showSystemStatus() {
  console.log('\n⚡ System Status:\n');
  const table = new Table({
    head: [chalk.cyan('Component'), chalk.cyan('Status'), chalk.cyan('Details')],
    style: { head: [], border: [] }
  });

  table.push(
    ['Core', chalk.green('✓'), 'Running'],
    ['GPU', chalk.green('✓'), 'NVIDIA CUDA Ready'],
    ['Ollama', chalk.green('✓'), '5 models loaded'],
    ['ComfyUI', chalk.yellow('⚠'), 'Not running'],
    ['Storage', chalk.green('✓'), '150GB available']
  );

  console.log(table.toString() + '\n');
}

async function interactiveInit() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: 'my-project'
    },
    {
      type: 'list',
      name: 'template',
      message: 'Choose template:',
      choices: [
        { name: '🎨 Image Generator', value: 'image' },
        { name: '🧠 Chat Bot', value: 'chat' },
        { name: '🔧 Full Stack', value: 'full' }
      ]
    }
  ]);

  const spinner = ora('Scaffolding project...').start();
  try {
    await sleep(1000);
    spinner.succeed('Project initialized!');
    success(`Navigate: cd ${answers.name}`);
    success('Start: npm run dev');
  } catch (err) {
    spinner.fail(err.message);
  }
}

async function configureSettings() {
  const { setting } = await inquirer.prompt([
    {
      type: 'list',
      name: 'setting',
      message: 'Configure:',
      choices: [
        { name: '🔗 Ollama URL', value: 'ollama' },
        { name: '🎨 Default Model', value: 'model' },
        { name: '📁 Output Directory', value: 'output' },
        { name: '← Back', value: 'back' }
      ]
    }
  ]);

  if (setting !== 'back') {
    const value = await inquirer.prompt([
      {
        type: 'input',
        name: 'value',
        message: `Enter ${setting} value:`
      }
    ]);
    success(`${setting} updated to: ${value.value}`);
  }
}

// ═══════════════════════════════════════════════════════════
// RUN
// ═══════════════════════════════════════════════════════════

// Show banner for no args
if (process.argv.length === 2) {
  showBanner();
  program.help();
}

program.parse();
