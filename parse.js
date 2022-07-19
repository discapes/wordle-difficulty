import * as fs from 'fs';
import * as readline from 'readline';

const DEV = false;

const stream = fs.createReadStream('parole_frek.txt');
const rl = readline.createInterface({ input: stream, });

let freqs = {};

let i = 0;
for await (const line of rl) {
	if (DEV && i > 99) break;
	i++;
	const [rank, n, word, ...rest] = line.split(' ');
	if (word.length !== 5) continue;
	const freqperc = +(rest[0].slice(1));
	freqs[word] = { rank, freqperc };
}

fs.writeFileSync('src/freqs.js', `export const freqs = ${JSON.stringify(freqs)};`);