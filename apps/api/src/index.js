import { createApp } from './app.js';
import { config } from './config.js';

const app = createApp();

app.listen(config.port, config.host, () => {
  console.log(`\n  NewsLens API  ▸  http://localhost:${config.port}/api`);
  console.log(`  data mode     ▸  ${config.dataMode}`);
  console.log(`  cors origin   ▸  ${config.corsOrigin}\n`);
});
