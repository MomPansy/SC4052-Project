// esbuild.config.mjs
import esbuild from 'esbuild';
import pkg from '@esbuild-plugins/tsconfig-paths';   // keeps your "paths" aliases working
const { esbuildPluginTsconfigPaths } = pkg;
import { nodeExternalsPlugin }  from 'esbuild-node-externals';   // leaves built‑ins & deps in node_modules un‑bundled
import ThreadsPlugin from 'threads-plugin'
/** ------------------------------------------------------------------
 *  1.  Decide what you want to start from.  Esbuild only needs ENTRY
 *      FILES, not globs.  Anything that file imports will be pulled in.
 * ------------------------------------------------------------------*/
const entryPoints = ['server/index.ts'];      // <-- change to your real entry

/** ------------------------------------------------------------------
 *  2.  One build call = one bundle (or directory of chunks if you code‑split)
 *      Nearly every option maps 1‑to‑1 from your tsconfig:
 *          - "target":     ESNext            → target: 'esnext'
 *          - "module":     ESNext            → format: 'esm'
 *          - "jsx":        react-jsx         → jsx: 'automatic'
 *          - "jsxImportSource": "hono/jsx"   → jsxImportSource: 'hono/jsx'
 *          - "outDir":     dist              → outdir: 'dist'
 * ------------------------------------------------------------------*/
await esbuild.build({
  entryPoints,
  bundle: true,            // put everything in one file
  platform: 'node',        // keeps __dirname, require(…), etc.
  format: 'esm',           // ESNext → ESM
  target: ['esnext'],      // same as "target": "ESNext"
  outdir: 'dist',
  sourcemap: true,
  jsx: 'automatic',
  jsxImportSource: 'hono/jsx',
  // Esbuild will *read* the tsconfig to pick up "paths" & "ts/tsx" loaders
  tsconfig: 'tsconfig.node.json',

  /** --------------------------------------------------------------
   *  Plugins
   *    • esbuildPluginTsconfigPaths   – honours   "paths": { … }
   *    • nodeExternalsPlugin          – keeps built‑ins & deps out
   * --------------------------------------------------------------*/
  plugins: [
    esbuildPluginTsconfigPaths({ tsconfig: 'tsconfig.node.json' }),
    nodeExternalsPlugin(),
    new ThreadsPlugin()
  ],
  /**
   *  Optional dev watch: `node esbuild.config.mjs --watch`
   */
  watch: process.argv.includes('--watch') && {
    onRebuild(error) {
      if (error) console.error('❌  Rebuild failed:', error);
      else       console.log ('✅  Rebuilt');
    }
  }
}).catch(() => process.exit(1));
