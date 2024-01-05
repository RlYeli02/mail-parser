const { exec } = require('child_process');

// Get the command-line arguments excluding the first two (node and script names)
const entities = process.argv.slice(2);

if (!entities?.length) {
  console.log('Usage: node generateEntities.js [entities]');
  process.exit(1);
}

const commands = entities.reduce((acc, entity) => {
  acc.push(`nest g mo modules/${entity}`);
  acc.push(`nest g co modules/${entity}`);
  acc.push(`nest g s modules/${entity}`);

  return acc;
}, []);

exec(commands.join(' && '));
