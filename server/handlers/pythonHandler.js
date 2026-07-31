import { spawn } from 'child_process';
import { interpolate } from '../../src/utils/templateEngine.js';

export async function handle(data, inputs) {
    const code = interpolate(data.code || '', inputs);
    
    return new Promise((resolve, reject) => {
        const python = spawn('python', ['-c', code]);
        let output = '';
        let errorOutput = '';

        python.stdout.on('data', (d) => { output += d.toString(); });
        python.stderr.on('data', (d) => { errorOutput += d.toString(); });

        python.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python Error: ${errorOutput}`));
            } else {
                resolve({ output: output.trim() });
            }
        });
        
        python.on('error', (err) => {
            reject(new Error(`Failed to start python: ${err.message}`));
        });
    });
}
