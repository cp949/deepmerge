var merge = require('../')
var test = require('node:test')
var assert = require('node:assert')

test('add keys in target that do not exist at the root', function(t) {
	var src = { key1: 'value1', key2: 'value2' }
	var target = {}

	var res = merge(target, src)

	assert.deepStrictEqual(target, {}, 'merge should be immutable')
	assert.deepStrictEqual(res, src)
})

test('merge existing simple keys in target at the roots', function(t) {
	var src = { key1: 'changed', key2: 'value2' }
	var target = { key1: 'value1', key3: 'value3' }

	var expected = {
		key1: 'changed',
		key2: 'value2',
		key3: 'value3',
	}

	assert.deepStrictEqual(target, { key1: 'value1', key3: 'value3' })
	assert.deepStrictEqual(merge(target, src), expected)
})

test('merge nested objects into target', function(t) {
	var src = {
		key1: {
			subkey1: 'changed',
			subkey3: 'added',
		},
	}
	var target = {
		key1: {
			subkey1: 'value1',
			subkey2: 'value2',
		},
	}

	var expected = {
		key1: {
			subkey1: 'changed',
			subkey2: 'value2',
			subkey3: 'added',
		},
	}

	assert.deepStrictEqual(target, {
		key1: {
			subkey1: 'value1',
			subkey2: 'value2',
		},
	})
	assert.deepStrictEqual(merge(target, src), expected)
})

test('replace simple key with nested object in target', function(t) {
	var src = {
		key1: {
			subkey1: 'subvalue1',
			subkey2: 'subvalue2',
		},
	}
	var target = {
		key1: 'value1',
		key2: 'value2',
	}

	var expected = {
		key1: {
			subkey1: 'subvalue1',
			subkey2: 'subvalue2',
		},
		key2: 'value2',
	}

	assert.deepStrictEqual(target, { key1: 'value1', key2: 'value2' })
	assert.deepStrictEqual(merge(target, src), expected)
})

test('should add nested object in target', function(t) {
	var src = {
		"b": {
			"c": {},
		},
	}

	var target = {
		"a": {},
	}

	var expected = {
		"a": {},
		"b": {
			"c": {},
		},
	}

	assert.deepStrictEqual(merge(target, src), expected)
})

test('should clone source and target', function(t) {
	var src = {
		"b": {
			"c": "foo",
		},
	}

	var target = {
		"a": {
			"d": "bar",
		},
	}

	var expected = {
		"a": {
			"d": "bar",
		},
		"b": {
			"c": "foo",
		},
	}

	var merged = merge(target, src, { clone: true })

	assert.deepStrictEqual(merged, expected)

	assert.notStrictEqual(merged.a, target.a)
	assert.notStrictEqual(merged.b, src.b)

})

test('should clone source and target', function(t) {
	var src = {
		"b": {
			"c": "foo",
		},
	}

	var target = {
		"a": {
			"d": "bar",
		},
	}

	var merged = merge(target, src)
	assert.notStrictEqual(merged.a, target.a)
	assert.notStrictEqual(merged.b, src.b)

})

test('should replace object with simple key in target', function(t) {
	var src = { key1: 'value1' }
	var target = {
		key1: {
			subkey1: 'subvalue1',
			subkey2: 'subvalue2',
		},
		key2: 'value2',
	}

	var expected = { key1: 'value1', key2: 'value2' }

	assert.deepStrictEqual(target, {
		key1: {
			subkey1: 'subvalue1',
			subkey2: 'subvalue2',
		},
		key2: 'value2',
	})
	assert.deepStrictEqual(merge(target, src), expected)
})

test('should replace objects with arrays', function(t) {
	var target = { key1: { subkey: 'one' } }

	var src = { key1: [ 'subkey' ] }

	var expected = { key1: [ 'subkey' ] }

	assert.deepStrictEqual(merge(target, src), expected)
})

test('should replace arrays with objects', function(t) {
	var target = { key1: [ "subkey" ] }

	var src = { key1: { subkey: 'one' } }

	var expected = { key1: { subkey: 'one' } }

	assert.deepStrictEqual(merge(target, src), expected)
})

test('should replace dates with arrays', function(t) {
	var target = { key1: new Date() }

	var src = { key1: [ "subkey" ] }

	var expected = { key1: [ "subkey" ] }

	assert.deepStrictEqual(merge(target, src), expected)
})

test('should replace null with arrays', function(t) {
	var target = {
		key1: null,
	}

	var src = {
		key1: [ "subkey" ],
	}

	var expected = {
		key1: [ "subkey" ],
	}

	assert.deepStrictEqual(merge(target, src), expected)
})

test('should work on simple array', function(t) {
	var src = [ 'one', 'three' ]
	var target = [ 'one', 'two' ]

	var expected = [ 'one', 'two', 'one', 'three' ]

	assert.deepStrictEqual(merge(target, src), expected)
	assert.ok(Array.isArray(merge(target, src)))
})

test('should work on another simple array', function(t) {
	var target = [ "a1", "a2", "c1", "f1", "p1" ]
	var src = [ "t1", "s1", "c2", "r1", "p2", "p3" ]

	var expected = [ "a1", "a2", "c1", "f1", "p1", "t1", "s1", "c2", "r1", "p2", "p3" ]
	assert.deepStrictEqual(target, [ "a1", "a2", "c1", "f1", "p1" ])
	assert.deepStrictEqual(merge(target, src), expected)
	assert.ok(Array.isArray(merge(target, src)))
})

test('should work on array properties', function(t) {
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

	assert.deepStrictEqual(merge(target, src), expected)
	assert.ok(Array.isArray(merge(target, src).key1))
	assert.ok(Array.isArray(merge(target, src).key2))
})

test('should work on array properties with clone option', function(t) {
	var src = {
		key1: [ 'one', 'three' ],
		key2: [ 'four' ],
	}
	var target = {
		key1: [ 'one', 'two' ],
	}

	assert.deepStrictEqual(target, {
		key1: [ 'one', 'two' ],
	})
	var merged = merge(target, src, { clone: true })
	assert.notStrictEqual(merged.key1, src.key1)
	assert.notStrictEqual(merged.key1, target.key1)
	assert.notStrictEqual(merged.key2, src.key2)
})

test('should work on array of objects', function(t) {
	var src = [
		{ key1: [ 'one', 'three' ], key2: [ 'one' ] },
		{ key3: [ 'five' ] },
	]
	var target = [
		{ key1: [ 'one', 'two' ] },
		{ key3: [ 'four' ] },
	]

	var expected = [
		{ key1: [ 'one', 'two' ] },
		{ key3: [ 'four' ] },
		{ key1: [ 'one', 'three' ], key2: [ 'one' ] },
		{ key3: [ 'five' ] },
	]

	assert.deepStrictEqual(merge(target, src), expected)
	assert.ok(Array.isArray(merge(target, src)), 'result should be an array')
	assert.ok(Array.isArray(merge(target, src)[0].key1), 'subkey should be an array too')

})

test('should work on array of objects with clone option', function(t) {
	var src = [
		{ key1: [ 'one', 'three' ], key2: [ 'one' ] },
		{ key3: [ 'five' ] },
	]
	var target = [
		{ key1: [ 'one', 'two' ] },
		{ key3: [ 'four' ] },
	]

	var expected = [
		{ key1: [ 'one', 'two' ] },
		{ key3: [ 'four' ] },
		{ key1: [ 'one', 'three' ], key2: [ 'one' ] },
		{ key3: [ 'five' ] },
	]

	var merged = merge(target, src, { clone: true })
	assert.deepStrictEqual(merged, expected)
	assert.ok(Array.isArray(merge(target, src)), 'result should be an array')
	assert.ok(Array.isArray(merge(target, src)[0].key1), 'subkey should be an array too')
	assert.notStrictEqual(merged[0].key1, src[0].key1)
	assert.notStrictEqual(merged[0].key1, target[0].key1)
	assert.notStrictEqual(merged[0].key2, src[0].key2)
	assert.notStrictEqual(merged[1].key3, src[1].key3)
	assert.notStrictEqual(merged[1].key3, target[1].key3)
})

test('should treat regular expressions like primitive values', function(t) {
	var target = { key1: /abc/ }
	var src = { key1: /efg/ }
	var expected = { key1: /efg/ }

	assert.deepStrictEqual(merge(target, src), expected)
	assert.deepStrictEqual(merge(target, src).key1.test('efg'), true)
})

test('should treat regular expressions like primitive values and should not'
				+ ' clone even with clone option', function(t) {
	var target = { key1: /abc/ }
	var src = { key1: /efg/ }

	var output = merge(target, src, { clone: true })

	assert.strictEqual(output.key1, src.key1)
}
)

test('should treat dates like primitives', function(t) {
	var monday = new Date('2016-09-27T01:08:12.761Z')
	var tuesday = new Date('2016-09-28T01:18:12.761Z')

	var target = {
		key: monday,
	}
	var source = {
		key: tuesday,
	}

	var expected = {
		key: tuesday,
	}
	var actual = merge(target, source)

	assert.deepStrictEqual(actual, expected)
	assert.strictEqual(actual.key.valueOf(), tuesday.valueOf())
})

test('should treat dates like primitives and should not clone even with clone'
				+  ' option', function(t) {
	var monday = new Date('2016-09-27T01:08:12.761Z')
	var tuesday = new Date('2016-09-28T01:18:12.761Z')

	var target = {
		key: monday,
	}
	var source = {
		key: tuesday,
	}

	var actual = merge(target, source, { clone: true })

	assert.strictEqual(actual.key, tuesday)
})

test('should work on array with null in it', function(t) {
	var target = []

	var src = [ null ]

	var expected = [ null ]

	assert.deepStrictEqual(merge(target, src), expected)
})

test('should clone array\'s element if it is object', function(t) {
	var a = { key: 'yup' }
	var target = []
	var source = [ a ]

	var output = merge(target, source, { clone: true })

	assert.notStrictEqual(output[0], a)
	assert.strictEqual(output[0].key, 'yup')
})

test('should clone an array property when there is no target array', function(t) {
	const someObject = {}
	var target = {}
	var source = { ary: [ someObject ] }
	var output = merge(target, source, { clone: true })

	assert.deepStrictEqual(output, { ary: [{}] })
	assert.notStrictEqual(output.ary[0], someObject)
})

test('should overwrite values when property is initialised but undefined', function(t) {
	var target1 = { value: [] }
	var target2 = { value: null }
	var target3 = { value: 2 }

	var src = { value: undefined }

	function hasUndefinedProperty(o) {
		assert.ok(o.hasOwnProperty('value'))
		assert.strictEqual(typeof o.value, 'undefined')
	}

	hasUndefinedProperty(merge(target1, src))
	hasUndefinedProperty(merge(target2, src))
	hasUndefinedProperty(merge(target3, src))

})

test('dates should copy correctly in an array', function(t) {
	var monday = new Date('2016-09-27T01:08:12.761Z')
	var tuesday = new Date('2016-09-28T01:18:12.761Z')

	var target = [ monday, 'dude' ]
	var source = [ tuesday, 'lol' ]

	var expected = [ monday, 'dude', tuesday, 'lol' ]
	var actual = merge(target, source)

	assert.deepStrictEqual(actual, expected)
})

test('should handle custom merge functions', function(t) {
	var target = {
		letters: ['a', 'b'],
		people: {
			first: 'Alex',
			second: 'Bert',
		}
	}

	var source = {
		letters: ['c'],
		people: {
			first: 'Smith',
			second: 'Bertson',
			third: 'Car'
		}
	}

    const mergePeople = (target, source, options) => {
       const keys = new Set(Object.keys(target).concat(Object.keys(source)))
	   const destination = {}
       keys.forEach(key => {
           if (key in target && key in source) {
               destination[key] = `${target[key]}-${source[key]}`
           } else if (key in target) {
               destination[key] = target[key]
           } else {
               destination[key] = source[key]
           }
	   })
       return destination
   }

   const options = {
       customMerge: (key, options) => {
         if (key === 'people') {
           return mergePeople
		 }

		 return merge
       }
   }

	var expected = {
		letters: ['a', 'b', 'c'],
		people: {
			first: 'Alex-Smith',
			second: 'Bert-Bertson',
			third: 'Car'
		}
	}

	var actual = merge(target, source, options)
	assert.deepStrictEqual(actual, expected)
})


test('should handle custom merge functions', function(t) {
	var target = {
		letters: ['a', 'b'],
		people: {
			first: 'Alex',
			second: 'Bert',
		}
	}

	var source = {
		letters: ['c'],
		people: {
			first: 'Smith',
			second: 'Bertson',
			third: 'Car'
		}
	}

    const mergeLetters = (target, source, options) => {
      return 'merged letters'
    }


    const options = {
        customMerge: (key, options) => {
          if (key === 'letters') {
            return mergeLetters
          }
        }
    }

    const expected = {
        letters: 'merged letters',
        people: {
            first: 'Smith',
            second: 'Bertson',
            third: 'Car'
        }
    }

	var actual = merge(target, source, options)
	assert.deepStrictEqual(actual, expected)
})

test('should merge correctly if custom merge is not a valid function', function(t) {
	var target = {
		letters: ['a', 'b'],
		people: {
			first: 'Alex',
			second: 'Bert',
		}
	}

	var source = {
		letters: ['c'],
		people: {
			first: 'Smith',
			second: 'Bertson',
			third: 'Car'
		}
	}

    const options = {
        customMerge: (key, options) => {
            return  false
        }
    }

    const expected = {
        letters: ['a', 'b', 'c'],
        people: {
            first: 'Smith',
            second: 'Bertson',
            third: 'Car'
        }
    }

	var actual = merge(target, source, options)
	assert.deepStrictEqual(actual, expected)

})

test('copy symbol keys in target that do not exist on the target', function(t) {
	var mySymbol = Symbol();
	var src = { [mySymbol]: 'value1' }
	var target = {}

	var res = merge(target, src)

	assert.strictEqual(res[mySymbol], 'value1')
	assert.deepStrictEqual(Object.getOwnPropertySymbols(res), Object.getOwnPropertySymbols(src))
})

test('copy symbol keys in target that do exist on the target', function(t) {
	var mySymbol = Symbol();
	var src = { [mySymbol]: 'value1' }
	var target = { [mySymbol]: 'wat'}

	var res = merge(target, src)

	assert.strictEqual(res[mySymbol], 'value1')
})

test('Falsey properties should be mergeable', function(t) {
	var uniqueValue = {}

	var target = {
		wat: false
	}

	var source = {
		wat: false
	}

	var customMergeWasCalled = false

	var result = merge(target, source, {
		isMergeableObject: function() {
			return true
		},
		customMerge: function() {
			return function() {
				customMergeWasCalled = true
				return uniqueValue
			}
		}
	})

	assert.strictEqual(result.wat, uniqueValue)
	assert.ok(customMergeWasCalled, 'custom merge function was called')
})
