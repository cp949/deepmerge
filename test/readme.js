// README의 예제 코드가 실제로 동작하는지 검사한다(jsmd 대체).
// - ```js / ```javascript 코드 블록과 <!--js ... --> 주석을 문서 순서대로 이어 한 스크립트로 실행한다.
// - `식 // => 기대값` 형태의 줄 주석은 deepStrictEqual 단언으로 바꾼다.
// - 기대값 주석이 어떤 문장과도 연결되지 않으면 실패시켜, 예제가 조용히 검사에서 빠지는 일을 막는다.
const test = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')
const acorn = require('acorn')

const readmePath = path.join(__dirname, '..', 'readme.md')

function extractCode(markdown) {
	const pattern = /^```(?:js|javascript)[ \t]*\n([\s\S]*?)^```[ \t]*$|^<!--js\s([\s\S]*?)-->/gm
	const blocks = []
	let match
	while ((match = pattern.exec(markdown)) !== null) {
		blocks.push(match[1] !== undefined ? match[1] : match[2])
	}
	return blocks.join('\n')
}

function walk(node, visit) {
	visit(node)
	for (const key of Object.keys(node)) {
		const value = node[key]
		const children = Array.isArray(value) ? value : [ value ]
		for (const child of children) {
			if (child && typeof child.type === 'string') {
				walk(child, visit)
			}
		}
	}
}

function rewriteAssertions(code) {
	const comments = []
	const ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'script', locations: true, onComment: comments })

	const expectations = new Map()
	for (const comment of comments) {
		const match = comment.type === 'Line' && /^\s*=>\s*([\s\S]*)$/.exec(comment.value)
		if (match) {
			expectations.set(comment.loc.start.line, match[1].trim())
		}
	}

	// 기대값 주석과 같은 줄에서 끝나는 가장 바깥 식 문장을 단언 대상으로 삼는다.
	const statements = new Map()
	walk(ast, function(node) {
		const line = node.loc.end.line
		if (node.type === 'ExpressionStatement' && expectations.has(line)) {
			const previous = statements.get(line)
			if (!previous || node.start < previous.start) {
				statements.set(line, node)
			}
		}
	})

	const unmatched = [ ...expectations.keys() ].filter(line => !statements.has(line))
	assert.deepStrictEqual(unmatched, [], '문장과 연결되지 않은 `// =>` 주석이 있다 (추출 코드 기준 줄 번호)')

	// 뒤쪽 문장부터 바꿔야 앞쪽 문장의 오프셋이 유지된다.
	let rewritten = code
	const ordered = [ ...statements.entries() ].sort((a, b) => b[1].start - a[1].start)
	for (const [ line, node ] of ordered) {
		const actual = code.slice(node.expression.start, node.expression.end)
		const expected = expectations.get(line)
		const replacement = `__readmeAssert__((${actual}), (${expected}), ${JSON.stringify(actual + ' // => ' + expected)});`
		rewritten = rewritten.slice(0, node.start) + replacement + rewritten.slice(node.end)
	}

	return { code: rewritten, count: statements.size }
}

test('README 예제 코드의 기대값 주석이 실제 결과와 같다', function(t) {
	const { code, count } = rewriteAssertions(extractCode(fs.readFileSync(readmePath, 'utf8')))
	assert.ok(count > 0, 'README에서 단언을 하나 이상 찾아야 한다')

	let checked = 0
	function readmeAssert(actual, expected, message) {
		assert.deepStrictEqual(actual, expected, message)
		checked++
	}

	// README의 require('./')가 저장소 루트(package.json main)를 가리키도록 한다.
	// is-plain-object는 npm 의존성 대신 vendor 복사본으로 연결한다.
	const readmeRequire = createRequire(readmePath)
	const vendored = { 'is-plain-object': path.join(__dirname, '..', 'vendor', 'is-plain-object', 'is-plain-object.mjs') }
	function requireForReadme(id) {
		return readmeRequire(vendored[id] || id)
	}
	const run = new Function('require', '__readmeAssert__', code)
	run(requireForReadme, readmeAssert)

	assert.strictEqual(checked, count, '모든 단언이 실행되어야 한다')
	t.diagnostic('README 단언 ' + checked + '개 실행')
})
