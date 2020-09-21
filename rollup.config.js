const rollup = require('rollup');
import serve from 'rollup-plugin-serve';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

const options = {
    input: 'src/main.js',
    output: {
        file: 'dist/bundle.js',
        format: 'umd',
        sourcemap: true,
        name: 'extractVideoFrames'
    },
    plugins: [
        serve({
            host: 'localhost',
            port: 8080,
            contentBase: ['']
        }),
        resolve(() => {
            console.log(123)
        }),
        commonjs(), 
        production && terser()
    ]
};

const watcher = rollup.watch(options);
watcher.on('event', event => {
    // console.log(event, event.code)
    if (event.code === 'BUNDLE_END') {
        console.log('launch at: http://localhost:8080/example/index.html')
    }
});


export default options;


