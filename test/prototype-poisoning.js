var merge = require('../')
var test = require('node:test')
var assert = require('node:assert')
// 이 테스트에서는 '객체면 병합 가능'이라는 최소 판정만 필요하다.
function isMergeableObject(value) {
	return !!value && typeof value === 'object'
}

test('merging objects with own __proto__', function(t) {
	var user = {}
	var malicious = JSON.parse('{ "__proto__": { "admin": true } }')
	var mergedObject = merge(user, malicious)
	assert.ok(!mergedObject.__proto__.admin, 'non-plain properties should not be merged')
	assert.ok(!mergedObject.admin, 'the destination should have an unmodified prototype')
})

test('merging objects with plain and non-plain properties', function(t) {
	var plainSymbolKey = Symbol('plainSymbolKey')
	var parent = {
		parentKey: 'should be undefined'
	}
	
	var target = Object.create(parent)	
	target.plainKey = 'should be replaced'
	target[plainSymbolKey] = 'should also be replaced'
	
	var source = {
		parentKey: 'foo',
		plainKey: 'bar',
		newKey: 'baz',
		[plainSymbolKey]: 'qux'
	}
	
	var mergedObject = merge(target, source)
	assert.strictEqual(undefined, mergedObject.parentKey, 'inherited properties of target should be removed, not merged or ignored')
	assert.strictEqual('bar', mergedObject.plainKey, 'enumerable own properties of target should be merged')
	assert.strictEqual('baz', mergedObject.newKey, 'properties not yet on target should be merged')
	assert.strictEqual('qux', mergedObject[plainSymbolKey], 'enumerable own symbol properties of target should be merged')
})

// the following cases come from the thread here: https://github.com/TehShrike/deepmerge/pull/164
test('merging strings works with a custom string merge', function(t) {
	var target = { name: "Alexander" }
	var source = { name: "Hamilton" }
	function customMerge(key, options) {
		if (key === 'name') {
			return function(target, source, options) {
				return target[0] + '. ' + source.substring(0, 3)
			}
		} else {
			return merge
		}
	}

	function mergeable(target) {
		return isMergeableObject(target) || (typeof target === 'string' && target.length > 1)
	}

	assert.strictEqual('A. Ham', merge(target, source, { customMerge: customMerge, isMergeableObject: mergeable }).name)
})

test('merging objects with null prototype', function(t) {
	var target = Object.create(null)
	var source = Object.create(null)
	target.wheels = 4
	target.trunk = { toolbox: ['hammer'] }
	source.trunk = { toolbox: ['wrench'] }
	source.engine = 'v8'
	var expected = {
		wheels: 4,
		engine: 'v8',
		trunk: {
			toolbox: ['hammer', 'wrench' ]
		}
	}

	assert.deepStrictEqual(expected, merge(target, source))
})

// GHSA-gcqx-w48m-w2h4 회귀 테스트: 반환 객체의 prototype이 바뀌면 안 된다.
function poisonedPayload() {
	return JSON.parse('{ "__proto__": { "admin": true } }')
}

function assertNotPoisoned(t, value, label) {
	assert.strictEqual(Object.getPrototypeOf(value), Object.prototype, label + ': prototype이 Object.prototype이어야 한다')
	assert.strictEqual(value.admin, undefined, label + ': 주입된 속성이 보이면 안 된다')
	assert.strictEqual({}.admin, undefined, label + ': 전역 Object.prototype이 오염되면 안 된다')
}

test('prototype이 없는 target에 source의 __proto__를 주입하지 않는다', function(t) {
	assertNotPoisoned(t, merge(Object.create(null), poisonedPayload()), 'null prototype target')
})

test('null인 중첩 target을 복제해도 __proto__를 주입하지 않는다', function(t) {
	assertNotPoisoned(t, merge({ session: null }, { session: poisonedPayload() }).session, '중첩 null target')
})

test('target의 자체 __proto__ 속성을 결과에 복사하지 않는다', function(t) {
	assertNotPoisoned(t, merge(poisonedPayload(), {}), 'target 자체 __proto__')
})

test('clone false와 customMerge 경로에서도 __proto__를 주입하지 않는다', function(t) {
	assertNotPoisoned(t, merge({ session: null }, { session: poisonedPayload() }, { clone: false }).session, 'clone false')
	var customMergeResult = merge(
		{ session: Object.create(null) },
		{ session: poisonedPayload() },
		{ customMerge: function() { return undefined } }
	)
	assertNotPoisoned(t, customMergeResult.session, 'customMerge 기본 경로')
})

test('배열 원소와 all 병합에서도 __proto__를 주입하지 않는다', function(t) {
	assertNotPoisoned(t, merge([], [ poisonedPayload() ])[0], '배열 원소')
	assertNotPoisoned(t, merge.all([ Object.create(null), poisonedPayload() ]), 'all')
})

test('target과 source의 constructor와 prototype 키를 중첩 객체에서도 제외한다', function(t) {
	var raw = '{ "config": { "constructor": { "prototype": { "admin": true } }, "prototype": { "admin": true }, "enabled": true } }'
	assert.deepStrictEqual(merge(JSON.parse(raw), {}), { config: { enabled: true } }, 'target 쪽')
	assert.deepStrictEqual(merge({}, JSON.parse(raw)), { config: { enabled: true } }, 'source 쪽')
	assert.deepStrictEqual(merge(Object.create(null), { constructor: 'x' }), {}, 'null prototype target의 constructor')
})
