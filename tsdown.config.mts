import { defineConfig } from 'tsdown'

// 배포물은 기존 4.x와 같은 경로(dist/cjs.js, dist/umd.js)와 export 형태를 유지한다.
const shared = {
	entry: { index: 'index.js' },
	outDir: 'dist',
	// 브라우저 번들러 소비자도 있으므로 engines(Node 24) 기준이 아닌 ES2015로 낮춘다.
	target: 'es2015',
	platform: 'neutral',
	dts: false,
	clean: false,
} as const

export default defineConfig([
	{
		...shared,
		format: 'cjs',
		outExtensions: () => ({ js: '.js' }),
		outputOptions: { entryFileNames: 'cjs.js' },
	},
	{
		...shared,
		format: 'umd',
		globalName: 'deepmerge',
		outExtensions: () => ({ js: '.js' }),
		outputOptions: { entryFileNames: 'umd.js' },
	},
])
