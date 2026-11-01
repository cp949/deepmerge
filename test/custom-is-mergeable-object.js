const merge = require(`..`)
const test = require(`node:test`)
const assert = require(`node:assert`)

test(`isMergeableObject function copying object over object`, t => {
	const src = { key: { isMergeable: false }, baz: `yes` }
	const target = { key: { foo: `wat` }, baz: `whatever` }

	function isMergeableObject(object) {
		return object && typeof value === `object` && object.isMergeable !== false
	}

	const res = merge(target, src, {
		isMergeableObject,
	})

	assert.deepStrictEqual(res, { key: { isMergeable: false }, baz: `yes` })
	assert.strictEqual(res.key, src.key, `Object has the same identity and was not cloned`)
})

test(`isMergeableObject function copying object over nothing`, t => {
	const src = { key: { isMergeable: false, foo: `bar` }, baz: `yes` }
	const target = { baz: `whatever` }

	function isMergeableObject(object) {
		return object && typeof value === `object` && object.isMergeable !== false
	}

	const res = merge(target, src, {
		isMergeableObject,
	})

	assert.deepStrictEqual(res, { key: { isMergeable: false, foo: `bar` }, baz: `yes` })
	assert.strictEqual(res.key, src.key, `Object has the same identity and was not cloned`)
})

test(`example from readme`, t => {
	const { isPlainObject } = require(`./support/is-plain-object.js`)

	function SuperSpecial() {
		this.special = `oh yeah man totally`
	}

	const instantiatedSpecialObject = new SuperSpecial()

	const target = {
		someProperty: {
			cool: `oh for sure`,
		},
	}

	const source = {
		someProperty: instantiatedSpecialObject,
	}

	const defaultOutput = merge(target, source)

	assert.strictEqual(defaultOutput.someProperty.cool, `oh for sure`)
	assert.strictEqual(defaultOutput.someProperty.special, `oh yeah man totally`)
	assert.strictEqual(defaultOutput.someProperty instanceof SuperSpecial, false)

	const customMergeOutput = merge(target, source, {
		isMergeableObject: isPlainObject,
	})

	assert.strictEqual(customMergeOutput.someProperty.cool, undefined)
	assert.strictEqual(customMergeOutput.someProperty.special, `oh yeah man totally`)
	assert.strictEqual(customMergeOutput.someProperty instanceof SuperSpecial, true)

})
