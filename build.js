const esbuild = require('esbuild');
const { sassPlugin } = require('esbuild-sass-plugin')

esbuild.build({
    entryPoints: ['assets/js/index.js'],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    outfile: 'dist/bundle.js',
    plugins: [sassPlugin()],
}).catch((e) => console.error(e.message))