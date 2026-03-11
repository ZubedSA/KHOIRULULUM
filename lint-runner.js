/* eslint-disable */
const { execSync } = require('child_process');
const fs = require('fs');
try {
    const result = execSync('npm run lint', { encoding: 'utf8' });
    fs.writeFileSync('lint-clean.txt', result);
    console.log('Lint passed');
} catch (e) {
    fs.writeFileSync('lint-clean.txt', e.stdout || e.message);
    console.log('Lint failed, output written to lint-clean.txt');
}
