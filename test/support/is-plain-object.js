// README 예제가 쓰는 is-plain-object 패키지 대신 테스트에서 쓰는 판정 함수.
// Object 생성자나 Object.create(null)로 만든 객체만 true다. 클래스 인스턴스는 false다.
function isPlainObject(value) {
	if (Object.prototype.toString.call(value) !== '[object Object]') {
		return false
	}
	var prototype = Object.getPrototypeOf(value)
	return prototype === null || prototype === Object.prototype
}

module.exports = { isPlainObject: isPlainObject }
