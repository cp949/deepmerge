var merge = require('../')
var test = require('node:test')
var assert = require('node:assert')

test('throw error if first argument is not an array', function(t) {
	assert.throws(merge.all.bind(null, { example: true }, { another: '2' }), Error)
})

test('return an empty object if first argument is an array with no elements', function(t) {
	assert.deepStrictEqual(merge.all([]), {})
})

test('Work just fine if first argument is an array with least than two elements', function(t) {
	var actual = merge.all([{ example: true }])
	var expected = { example: true }
	assert.deepStrictEqual(actual, expected)
})

test('execute correctly if options object were not passed', function(t) {
	var arrayToMerge = [{ example: true }, { another: '123' }]
	assert.doesNotThrow(merge.all.bind(null, arrayToMerge))
})

test('execute correctly if options object were passed', function(t) {
	var arrayToMerge = [{ example: true }, { another: '123' }]
	assert.doesNotThrow(merge.all.bind(null, arrayToMerge, { clone: true }))
})

test('invoke merge on every item in array should result with all props', function(t) {
	var firstObject = { first: true }
	var secondObject = { second: false }
	var thirdObject = { third: 123 }
	var fourthObject = { fourth: 'some string' }

	var mergedObject = merge.all([ firstObject, secondObject, thirdObject, fourthObject ])

	assert.ok(mergedObject.first === true)
	assert.ok(mergedObject.second === false)
	assert.ok(mergedObject.third === 123)
	assert.ok(mergedObject.fourth === 'some string')
})

test('invoke merge on every item in array with clone should clone all elements', function(t) {
	var firstObject = { a: { d: 123 } }
	var secondObject = { b: { e: true } }
	var thirdObject = { c: { f: 'string' } }

	var mergedWithClone = merge.all([ firstObject, secondObject, thirdObject ], { clone: true })

	assert.notStrictEqual(mergedWithClone.a, firstObject.a)
	assert.notStrictEqual(mergedWithClone.b, secondObject.b)
	assert.notStrictEqual(mergedWithClone.c, thirdObject.c)

})

test('invoke merge on every item in array clone=false should not clone all elements', function(t) {
	var firstObject = { a: { d: 123 } }
	var secondObject = { b: { e: true } }
	var thirdObject = { c: { f: 'string' } }

	var mergedWithoutClone = merge.all([ firstObject, secondObject, thirdObject ], { clone: false })

	assert.strictEqual(mergedWithoutClone.a, firstObject.a)
	assert.strictEqual(mergedWithoutClone.b, secondObject.b)
	assert.strictEqual(mergedWithoutClone.c, thirdObject.c)

})


test('invoke merge on every item in array without clone should clone all elements', function(t) {
	var firstObject = { a: { d: 123 } }
	var secondObject = { b: { e: true } }
	var thirdObject = { c: { f: 'string' } }

	var mergedWithoutClone = merge.all([ firstObject, secondObject, thirdObject ])

	assert.notStrictEqual(mergedWithoutClone.a, firstObject.a)
	assert.notStrictEqual(mergedWithoutClone.b, secondObject.b)
	assert.notStrictEqual(mergedWithoutClone.c, thirdObject.c)

})
