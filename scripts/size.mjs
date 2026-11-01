// README의 "UMD bundle is ...B minified+gzipped" 수치를 재는 스크립트. 빌드 후 실행한다.
import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { minifySync } from 'rolldown/utils'

const file = `dist/umd.js`
const { code, errors } = minifySync(file, readFileSync(file, `utf8`), { compress: true, mangle: true })
if (errors && errors.length > 0) {
	throw new Error(`minify 실패: ${errors.map(e => e.message).join(`, `)}`)
}
console.log(`${gzipSync(code).length}B minified+gzipped (${file})`)
