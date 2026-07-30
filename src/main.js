import './styles/index.css';
import { renderNodePalette } from './panels/nodePalette.js';
import { setupCanvas } from './canvas/canvas.js';
import { setupNodeRenderer } from './canvas/nodeRenderer.js';
import { setupConnectionHandler } from './canvas/connectionHandler.js';
import { setupEdgeRenderer } from './canvas/edgeRenderer.js';
import { setupConfigPanel } from './panels/configPanel.js';

console.log('⚡ Relay — AI Workflow Builder');
console.log('Initializing Step 6 layout...');

renderNodePalette();
setupConfigPanel();
setupCanvas();
setupNodeRenderer();
setupEdgeRenderer();
setupConnectionHandler();