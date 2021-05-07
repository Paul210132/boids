import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
//import indexcss from './src/css/index.css'
// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;
export default {
	input: 'src/js/index.js',
	output: {
		file: 'public/bundle.js',
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: true
	},
	plugins: [
		// postcss({
		//   extract: true,
		//   extract: indexcss.resolve('index.css')
		// }),
		resolve(), // tells Rollup how to find date-fns in node_modules
		commonjs(), // converts date-fns to ES modules
		production && terser(), // minify, but only in production
		copy({
			targets: [
        { src: 'src/index.html', dest: ['./public','./'] },
        { src: 'src/css/index.css', dest: ['./public','./'] },
        { src: ['./public/bundle.js','./public/bundle.js.map'], dest: './' }
			]
		})
	]
};
