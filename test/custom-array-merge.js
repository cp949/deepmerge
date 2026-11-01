var merge = require('../')
var test = require('node:test')
var assert = require('node:assert')

test('custom merge array', function(t) {
	var mergeFunctionCalled = false
	function overwriteMerge(target, source, options) {
		mergeFunctionCalled = true
		assert.strictEqual(options.arrayMerge, overwriteMerge)

		return source
	}
	const destination = {
		someArray: [ 1, 2 ],
		someObject: { what: 'yes' },
	}
	const source = {
		someArray: [ 1, 2, 3 ],
	}

	const actual = merge(destination, source, { arrayMerge: overwriteMerge })
	const expected = {
		someArray: [ 1, 2, 3 ],
		someObject: { what: 'yes' },
	}

	assert.ok(mergeFunctionCalled)
	assert.deepStrictEqual(actual, expected)
})

test('merge top-level arrays', function(t) {
	function overwriteMerge(a, b) {
		return b
	}
	var actual = merge([ 1, 2 ], [ 1, 2 ], { arrayMerge: overwriteMerge })
	var expected = [ 1, 2 ]

	assert.deepStrictEqual(actual, expected)
})

test('cloner function is available for merge functions to use', function(t) {
	var customMergeWasCalled = false
	function cloneMerge(target, source, options) {
		customMergeWasCalled = true
		assert.ok(options.cloneUnlessOtherwiseSpecified, 'cloner function is available')
		return target.concat(source).map(function(element) {
			return options.cloneUnlessOtherwiseSpecified(element, options)
		})
	}

	var src = {
		key1: [ 'one', 'three' ],
		key2: [ 'four' ],
	}
	var target = {
		key1: [ 'one', 'two' ],
	}

	var expected = {
		key1: [ 'one', 'two', 'one', 'three' ],
		key2: [ 'four' ],
	}

	assert.deepStrictEqual(merge(target, src, { arrayMerge: cloneMerge }), expected)
	assert.ok(customMergeWasCalled)
	assert.ok(Array.isArray(merge(target, src).key1))
	assert.ok(Array.isArray(merge(target, src).key2))
})
