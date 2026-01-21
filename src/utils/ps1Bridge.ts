// src/utils/ps1Bridge.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const runPSCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Properly escape the command for PowerShell
    const escapedCommand = command.replace(/"/g, '\\"').replace(/\$/g, '\\$');
    
    exec(
      `powershell -NoProfile -Command "${escapedCommand}"`,
      { 
        maxBuffer: 1024 * 1024 * 10,
        shell: 'powershell.exe'
      },
      (err, stdout, stderr) => {
        if (err) {
          console.error('[PS1 Error]', stderr || err.message);
          reject(new Error(stderr || err.message));
          return;
        }
        resolve(stdout.trim());
      }
    );
  });
};

// Quick intents for dependency analysis
export const DEPENDENCY_INTENTS = {
  'scan-services': () => runPSCommand(`
    Get-ChildItem -Path "./src/services" -Filter "*.ts" -File -ErrorAction SilentlyContinue | Select-Object Name | ConvertTo-Json
  `),
  
  'find-unused': () => runPSCommand(`
    $files = Get-ChildItem -Path "./src/services" -Filter "*.ts" -File -ErrorAction SilentlyContinue | Select-Object -ExpandProperty BaseName
    if ($files) {
      $files | ForEach-Object {
        $name = $_
        $count = (Select-String -Path "./src/**/*.ts", "./src/**/*.tsx" -Pattern $name -SimpleMatch -ErrorAction SilentlyContinue | 
                  Where-Object { $_.Path -notlike "*\\$name*" }).Count
        [PSCustomObject]@{ File = $name; ImportCount = $count; IsUsed = $count -gt 0 }
      } | ConvertTo-Json
    } else {
      ConvertTo-Json @()
    }
  `),
  
  'get-import-tree': (file: string) => runPSCommand(`
    Select-String -Path "${file}" -Pattern "^import" -ErrorAction SilentlyContinue | 
    ForEach-Object { $_.Line } | 
    ConvertTo-Json
  `)
};

// Check if PowerShell is available
export const checkPowerShell = async (): Promise<boolean> => {
  try {
    await runPSCommand('$PSVersionTable.PSVersion');
    return true;
  } catch {
    return false;
  }
};

// Get project root
export const getProjectRoot = async (): Promise<string> => {
  try {
    const result = await runPSCommand('Get-Location | Select-Object -ExpandProperty Path');
    return result;
  } catch (error) {
    console.error('Failed to get project root:', error);
    return process.cwd();
  }
};

// List all files in a folder recursively
export const listFilesRecursive = async (folderPath: string): Promise<string[]> => {
  try {
    const result = await runPSCommand(`
      Get-ChildItem -Path "${folderPath}" -Filter "*.ts" -Filter "*.tsx" -Recurse -File | 
      Select-Object -ExpandProperty FullName |
      ConvertTo-Json
    `);
    
    if (!result) return [];
    const parsed = JSON.parse(result);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error('Failed to list files:', error);
    return [];
  }
};
