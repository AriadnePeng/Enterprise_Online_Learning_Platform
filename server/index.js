import { createApp } from './app.js';

const { server, settings } = await createApp();

server.listen(settings.port, settings.host, () => {
  console.log(`Enterprise Learning API running at http://${settings.host}:${settings.port}`);
  console.log(`Health check: http://${settings.host}:${settings.port}/api/health`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

