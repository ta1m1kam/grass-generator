const { build } = require('esbuild');
const glob = require('glob');
const entryPoints = glob.sync('./src/**/*.ts');

const isWatchMode = process.argv[2] === "watch";

build({
  entryPoints,
  outbase: './src',
  outdir: './lib',
  platform: 'browser',
  external: [],
  watch: process.argv[2] === "watch"
});

console.info(`build completed!`);

if (isWatchMode) {
  console.info(`Running in watch mode`);
}
