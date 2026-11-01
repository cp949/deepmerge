# Unreleased

- 보안: 반환 객체의 prototype 변조 차단 ([GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4)). target과 source의 열거 키에서 `__proto__`, `constructor`, `prototype`을 제외한다.
  - 동작 변경: 위 세 키는 일반 데이터여도 결과에서 빠진다. 예: `merge({}, { prototype: 1 })`은 `{}`를 반환한다.
- `engines.node`를 `>=24.18.0`으로 올린다. `dist/*`는 ES2015 문법으로 빌드한다(기존 ES5).
- `package.json`에 `types: "index.d.ts"`를 명시한다.
- 의존성 정리 (`npm audit` 0건)
  - `is-mergeable-object`, `is-plain-object` 의존성 제거. 기본 병합 판정은 `index.js`에 직접 구현하고(동작 동일), `isPlainObject`는 테스트 헬퍼(`test/support/`)로 둔다.
  - 빌드: rollup 1 + 플러그인 → tsdown. 출력 경로(`dist/cjs.js`, `dist/umd.js`)와 `module.exports = deepmerge` 형태는 유지한다.
  - 테스트: tape → `node:test`, jsmd → `test/readme.js`(acorn 기반), ts-node + TypeScript 2.2.2 → TypeScript 7 타입 검사
  - `size` 스크립트: uglify-js → rolldown minifier
- CI: Travis 설정을 GitHub Actions로 교체. Node 24.18.0/24/26 테스트와 주 1회 `npm audit` 실행. Dependabot 추가

# [4.3.1](https://github.com/TehShrike/deepmerge/releases/tag/v4.3.1)

- Fix type definition for arrayMerge options.  [#239](https://github.com/TehShrike/deepmerge/pull/239)

# [4.3.0](https://github.com/TehShrike/deepmerge/releases/tag/v4.3.0)

- Avoid thrown errors if the target doesn't have `propertyIsEnumerable`.  [#252](https://github.com/TehShrike/deepmerge/pull/252)

# [4.2.2](https://github.com/TehShrike/deepmerge/releases/tag/v4.2.2)

- `isMergeableObject` is now only called if there are two values that could be merged.  [a34dd4d2](https://github.com/TehShrike/deepmerge/commit/a34dd4d25bf5e250653540a2022bc832c7b00a19)

# [4.2.1](https://github.com/TehShrike/deepmerge/releases/tag/v4.2.1)

- Fix: falsey values can now be merged.  [#170](https://github.com/TehShrike/deepmerge/issues/170)

# [4.2.0](https://github.com/TehShrike/deepmerge/releases/tag/v4.2.0)

- Properties are now only overwritten if they exist on the target object and are enumerable.  [#164](https://github.com/TehShrike/deepmerge/pull/164)

Technically this could probably be a patch release since "which properties get overwritten" wasn't documented and accidentally overwriting a built-in function or some function up the property chain would almost certainly be undesirable, but it feels like a gray area, so here we are with a feature version bump.

# [4.1.2](https://github.com/TehShrike/deepmerge/releases/tag/v4.1.2)

- Rolled back #167 since `Object.assign` breaks ES5 support.  [55067352](https://github.com/TehShrike/deepmerge/commit/55067352a92c65a6c44a5165f3387720aae1e192)

# [4.1.1](https://github.com/TehShrike/deepmerge/releases/tag/v4.1.1)

- The `options` argument is no longer mutated [#167](https://github.com/TehShrike/deepmerge/pull/167)

# [4.1.0](https://github.com/TehShrike/deepmerge/releases/tag/v4.1.0)

- `cloneUnlessOtherwiseSpecified` is now exposed to the `arrayMerge` function [#165](https://github.com/TehShrike/deepmerge/pull/165)

# [4.0.0](https://github.com/TehShrike/deepmerge/releases/tag/v4.0.0)

- The `main` entry point in `package.json` is now a CommonJS module instead of a UMD module [#155](https://github.com/TehShrike/deepmerge/pull/155)

# [3.3.0](https://github.com/TehShrike/deepmerge/releases/tag/v3.3.0)

- Enumerable Symbol properties are now copied [#151](https://github.com/TehShrike/deepmerge/pull/151)

# [3.2.1](https://github.com/TehShrike/deepmerge/releases/tag/v3.2.1)

- bumping dev dependency versions to try to shut up bogus security warnings from Github/npm [#149](https://github.com/TehShrike/deepmerge/pull/149)

# [3.2.0](https://github.com/TehShrike/deepmerge/releases/tag/v3.2.0)

- feature: added the [`customMerge`](https://github.com/TehShrike/deepmerge#custommerge) option [#133](https://github.com/TehShrike/deepmerge/pull/133)

# [3.1.0](https://github.com/TehShrike/deepmerge/releases/tag/v3.1.0)

- typescript typing: make the `all` function generic [#129](https://github.com/TehShrike/deepmerge/pull/129)

# [3.0.0](https://github.com/TehShrike/deepmerge/releases/tag/v3.0.0)

- drop ES module build [#123](https://github.com/TehShrike/deepmerge/issues/123)

# [2.2.1](https://github.com/TehShrike/deepmerge/releases/tag/v2.2.1)

- bug: typescript export type was wrong [#121](https://github.com/TehShrike/deepmerge/pull/121)

# [2.2.0](https://github.com/TehShrike/deepmerge/releases/tag/v2.2.0)

- feature: added TypeScript typings [#119](https://github.com/TehShrike/deepmerge/pull/119)

# [2.1.1](https://github.com/TehShrike/deepmerge/releases/tag/v2.1.1)

- documentation: Rename "methods" to "api", note ESM syntax [#103](https://github.com/TehShrike/deepmerge/pull/103)
- documentation: Fix grammar [#107](https://github.com/TehShrike/deepmerge/pull/107)
- documentation: Restructure headers for clarity + some wording tweaks [108](https://github.com/TehShrike/deepmerge/pull/108) + [109](https://github.com/TehShrike/deepmerge/pull/109)


# [2.1.0](https://github.com/TehShrike/deepmerge/releases/tag/v2.1.0)

- feature: Support a custom `isMergeableObject` function [#96](https://github.com/TehShrike/deepmerge/pull/96)
- documentation: note a Webpack bug that some users might need to work around [#100](https://github.com/TehShrike/deepmerge/pull/100)

# [2.0.1](https://github.com/TehShrike/deepmerge/releases/tag/v2.0.1)

- documentation: fix the old array merge algorithm in the readme.  [#84](https://github.com/TehShrike/deepmerge/pull/84)

# [2.0.0](https://github.com/TehShrike/deepmerge/releases/tag/v2.0.0)

- breaking: the array merge algorithm has changed from a complicated thing to `target.concat(source).map(element => cloneUnlessOtherwiseSpecified(element, optionsArgument))`
- breaking: The `clone` option now defaults to `true`
- feature: `merge.all` now accepts an array of any size, even 0 or 1 elements

See [pull request 77](https://github.com/TehShrike/deepmerge/pull/77).

# [1.5.2](https://github.com/TehShrike/deepmerge/releases/tag/v1.5.2)

- fix: no longer attempts to merge React elements [#76](https://github.com/TehShrike/deepmerge/issues/76)

# [1.5.1](https://github.com/TehShrike/deepmerge/releases/tag/v1.5.1)

- bower support: officially dropping bower support.  If you use bower, please depend on the [unpkg distribution](https://unpkg.com/deepmerge/dist/umd.js).  See [#63](https://github.com/TehShrike/deepmerge/issues/63)

# [1.5.0](https://github.com/TehShrike/deepmerge/releases/tag/v1.5.0)

- bug fix: merging objects into arrays was allowed, and doesn't make any sense. [#65](https://github.com/TehShrike/deepmerge/issues/65) published as a feature release instead of a patch because it is a decent behavior change.

# [1.4.4](https://github.com/TehShrike/deepmerge/releases/tag/v1.4.4)

- bower support: updated `main` in bower.json

# [1.4.3](https://github.com/TehShrike/deepmerge/releases/tag/v1.4.3)

- bower support: inline is-mergeable-object in a new CommonJS build, so that people using both bower and CommonJS can bundle the library [0b34e6](https://github.com/TehShrike/deepmerge/commit/0b34e6e95f989f2fc8091d25f0d291c08f3d2d24)

# [1.4.2](https://github.com/TehShrike/deepmerge/releases/tag/v1.4.2)

- performance: bump is-mergeable-object dependency version for a slight performance improvement [5906c7](https://github.com/TehShrike/deepmerge/commit/5906c765d691d48e83d76efbb0d4b9ca150dc12c)

# [1.4.1](https://github.com/TehShrike/deepmerge/releases/tag/v1.4.1)

- documentation: fix unpkg link [acc45b](https://github.com/TehShrike/deepmerge/commit/acc45be85519c1df906a72ecb24764b622d18d47)

# [1.4.0](https://github.com/TehShrike/deepmerge/releases/tag/v1.4.0)

- api: instead of only exporting a UMD module, expose a UMD module with `pkg.main`, a CJS module with `pkg.browser`, and an ES module with `pkg.module` [#62](https://github.com/TehShrike/deepmerge/pull/62)

# [1.3.2](https://github.com/TehShrike/deepmerge/releases/tag/v1.3.2)

- documentation: note the minified/gzipped file sizes [56](https://github.com/TehShrike/deepmerge/pull/56)
- documentation: make data structures more readable in merge example: pull request [57](https://github.com/TehShrike/deepmerge/pull/57)

# [1.3.1](https://github.com/TehShrike/deepmerge/releases/tag/v1.3.1)

- documentation: clarify and test some array merging documentation: pull request [51](https://github.com/TehShrike/deepmerge/pull/51)

# [1.3.0](https://github.com/TehShrike/deepmerge/releases/tag/v1.3.0)

- feature: `merge.all`, a merge function that merges any number of objects: pull request [50](https://github.com/TehShrike/deepmerge/pull/50)

# [1.2.0](https://github.com/TehShrike/deepmerge/releases/tag/v1.2.0)

- fix: an error that would be thrown when an array would be merged onto a truthy non-array value: pull request [46](https://github.com/TehShrike/deepmerge/pull/46)
- feature: the ability to clone: Issue [28](https://github.com/TehShrike/deepmerge/issues/28), pull requests [44](https://github.com/TehShrike/deepmerge/pull/44) and [48](https://github.com/TehShrike/deepmerge/pull/48)
- maintenance: added tests + travis to `.npmignore`: pull request [47](https://github.com/TehShrike/deepmerge/pull/47)

# [1.1.1](https://github.com/TehShrike/deepmerge/releases/tag/v1.1.1)

- fix an issue where an error was thrown when merging an array onto a non-array: [Pull request 46](https://github.com/TehShrike/deepmerge/pull/46)

# [1.1.0](https://github.com/TehShrike/deepmerge/releases/tag/v1.1.0)

- allow consumers to specify their own array merging algorithm: [Pull request 37](https://github.com/TehShrike/deepmerge/pull/37)

# [1.0.3](https://github.com/TehShrike/deepmerge/releases/tag/v1.0.3)

- adding bower.json back: [Issue 38](https://github.com/TehShrike/deepmerge/pull/38)
- updating keywords and Github links in package.json [bc3898e](https://github.com/TehShrike/deepmerge/commit/bc3898e587a56f74591328f40f656b0152c1d5eb)

# [1.0.2](https://github.com/TehShrike/deepmerge/releases/tag/v1.0.2)

- Updating the readme: dropping bower, testing that the example works: [7102fc](https://github.com/TehShrike/deepmerge/commit/7102fcc4ddec11e2d33205866f9f18df14e5aeb5)

# [1.0.1](https://github.com/TehShrike/deepmerge/releases/tag/v1.0.1)

- `null`, dates, and regular expressions are now properly merged in arrays: [Issue 18](https://github.com/TehShrike/deepmerge/pull/18), plus commit: [ef1c6b](https://github.com/TehShrike/deepmerge/commit/ef1c6bac8350ba12a24966f0bc7da02560827586)

# 1.0.0

- Should only be a patch change, because this module is READY. [Issue 15](https://github.com/TehShrike/deepmerge/issues/15)
- Regular expressions are now treated like primitive values when merging: [Issue 30](https://github.com/TehShrike/deepmerge/pull/30)
- Dates are now treated like primitives when merging: [Issue 31](https://github.com/TehShrike/deepmerge/issues/31)
