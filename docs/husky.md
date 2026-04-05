# Husky & Git Hooks 가이드

## 목차

- [개요](#개요)
- [팀원 온보딩 가이드](#팀원-온보딩-가이드)
- [기술 레퍼런스](#기술-레퍼런스)
  - [Husky](#husky)
  - [lint-staged](#lint-staged)
  - [commitlint](#commitlint)
- [처음부터 설정하기](#처음부터-설정하기)
- [트러블슈팅](#트러블슈팅)

---

## 개요

이 프로젝트는 **Husky**를 사용하여 Git hooks를 관리합니다. 커밋 품질을 자동으로 보장하기 위해 아래 두 가지 hook을 사용합니다.

| Hook         | 실행 시점              | 역할                                           |
| ------------ | ---------------------- | ---------------------------------------------- |
| `pre-commit` | `git commit` 실행 직전 | staged 파일에 대해 ESLint + Prettier 자동 실행 |
| `commit-msg` | 커밋 메시지 작성 후    | Conventional Commits 규칙 검증                 |

### 사용하는 도구

| 도구                                                      | 버전 | 역할                             |
| --------------------------------------------------------- | ---- | -------------------------------- |
| [husky](https://typicode.github.io/husky/)                | v9   | Git hooks 관리                   |
| [lint-staged](https://github.com/lint-staged/lint-staged) | v16  | staged 파일에만 lint/format 실행 |
| [commitlint](https://commitlint.js.org/)                  | v20  | 커밋 메시지 규칙 검증            |
| [prettier](https://prettier.io/)                          | v3   | 코드 포매팅                      |
| [eslint](https://eslint.org/)                             | v8   | 코드 린팅                        |

---

## 팀원 온보딩 가이드

### 1. 클론 후 설치만 하면 끝

```sh
git clone <repository-url>
cd toss-setup
yarn install
```

`yarn install`을 실행하면 `package.json`의 `prepare` 스크립트가 자동으로 실행되어 Husky가 활성화됩니다.

```jsonc
// package.json
{
  "scripts": {
    "prepare": "husky", // yarn install 시 자동 실행
  },
}
```

> **별도의 설정이 필요 없습니다.** 설치만 하면 Git hooks가 바로 동작합니다.

### 2. 커밋할 때 자동으로 일어나는 일

```
git add src/App.tsx
git commit -m "feat: 로그인 페이지 추가"
```

위 명령을 실행하면 내부적으로 아래 흐름이 자동으로 수행됩니다.

```
git commit 실행
  │
  ├─ [pre-commit hook 실행]
  │   └─ lint-staged 실행
  │       ├─ App.tsx → eslint --fix --max-warnings=0
  │       └─ App.tsx → prettier --write
  │       └─ ❌ lint 에러가 있으면 커밋 중단
  │
  ├─ [commit-msg hook 실행]
  │   └─ commitlint 실행
  │       └─ "feat: 로그인 페이지 추가" 규칙 검증
  │       └─ ❌ 규칙 위반 시 커밋 중단
  │
  └─ ✅ 모든 hook 통과 → 커밋 완료
```

### 3. 커밋 메시지 작성법

```
<type>(<scope>): <subject>
```

- **type** (필수): 커밋의 종류를 나타내는 접두사
- **scope** (선택): 변경 범위, kebab-case로 작성
- **subject** (필수): 변경 내용 요약, 마침표로 끝나지 않아야 함

#### 올바른 예시

```sh
feat: 로그인 페이지 추가
fix(auth): 토큰 만료 시 리다이렉트 누락 수정
docs: README 업데이트
refactor(api): HTTP 클라이언트 추상화
style: 불필요한 공백 제거
chore: 의존성 업데이트
```

#### 잘못된 예시

```sh
기능 추가                # ❌ type 누락
Feature: 로그인 추가     # ❌ type은 소문자만 허용
feat: 로그인 추가.       # ❌ subject 끝에 마침표 불가
feat(Auth): 수정         # ❌ scope는 kebab-case만 허용
```

#### 허용되는 type 목록

| type       | 설명                           | 예시                                 |
| ---------- | ------------------------------ | ------------------------------------ |
| `feat`     | 새로운 기능 추가               | `feat: 다크모드 지원`                |
| `fix`      | 버그 수정                      | `fix: 무한 스크롤 중복 호출 수정`    |
| `docs`     | 문서 변경                      | `docs: API 명세 업데이트`            |
| `style`    | 코드 포매팅 (동작 변경 없음)   | `style: import 순서 정리`            |
| `refactor` | 리팩토링 (기능/버그 변경 없음) | `refactor: 컴포넌트 분리`            |
| `test`     | 테스트 추가 및 수정            | `test: 로그인 유닛 테스트 추가`      |
| `chore`    | 빌드 설정, 패키지 매니저 등    | `chore: eslint 규칙 변경`            |
| `ci`       | CI/CD 설정 변경                | `ci: GitHub Actions 워크플로우 추가` |
| `perf`     | 성능 개선                      | `perf: 이미지 lazy loading 적용`     |
| `build`    | 빌드 관련 변경                 | `build: vite 설정 수정`              |
| `revert`   | 이전 커밋 되돌리기             | `revert: feat: 다크모드 지원`        |

### 4. hook을 건너뛰어야 할 때

긴급하게 hook 검증 없이 커밋해야 하는 경우 `--no-verify` 플래그를 사용할 수 있습니다.

```sh
git commit --no-verify -m "hotfix: 긴급 수정"
```

> ⚠️ **주의**: 이 플래그는 모든 Git hook을 건너뜁니다. 정말 긴급한 상황에서만 사용하세요.

---

## 기술 레퍼런스

### Husky

#### 디렉토리 구조

```
.husky/
├── _/              # husky 내부 스크립트 (자동 생성, 수정 불필요)
├── pre-commit      # pre-commit hook 스크립트
└── commit-msg      # commit-msg hook 스크립트
```

#### `.husky/pre-commit`

```sh
npx lint-staged
```

커밋 직전에 `lint-staged`를 실행합니다. lint-staged는 staged된 파일에 대해서만 lint와 format을 수행합니다.

#### `.husky/commit-msg`

```sh
npx --no -- commitlint --edit ${1}
```

커밋 메시지가 작성된 후 `commitlint`로 메시지 규칙을 검증합니다. `${1}`은 커밋 메시지가 저장된 임시 파일의 경로입니다.

#### 동작 원리

```
yarn install
  └─ "prepare": "husky" 스크립트 실행
       └─ .git/config에 core.hooksPath = .husky/_ 설정
            └─ Git이 .husky/ 디렉토리의 hook 스크립트를 사용하도록 변경
```

Husky v9부터는 `.husky/_` 디렉토리에 wrapper 스크립트를 두고, `.git/config`의 `core.hooksPath`를 통해 Git이 이 디렉토리를 hook 경로로 인식하게 합니다.

---

### lint-staged

#### 설정 (`package.json`)

```jsonc
{
  "lint-staged": {
    // TypeScript 파일: ESLint로 자동 수정, warning 0개까지 허용
    "*.{ts,tsx}": ["eslint --fix --max-warnings=0"],
    // 지원 파일 전체: Prettier로 포맷팅
    "*.{ts,tsx,js,jsx,json,css,scss,md}": ["prettier --write"],
  },
}
```

#### 동작 방식

1. `git commit` 실행 → pre-commit hook → `lint-staged` 실행
2. `git diff --staged`로 staged 파일 목록 확인
3. 파일 확장자에 따라 매칭되는 명령어 실행
4. 명령어 실행 후 변경된 파일을 자동으로 다시 staging
5. 하나라도 실패하면 커밋 중단

#### 왜 lint-staged를 쓰는가?

전체 프로젝트에 `eslint .`을 실행하면 파일이 많을수록 느려집니다. lint-staged는 **변경된(staged) 파일에만** 실행하므로:

- ⚡ 속도가 빠름 (몇 초 내 완료)
- 🎯 변경한 파일만 검사하므로 불필요한 에러 노출 없음
- 🔄 자동 수정(`--fix`, `--write`) 결과를 다시 staging

#### `--max-warnings=0` 옵션

ESLint의 `--max-warnings=0`은 warning이 하나라도 있으면 에러로 처리합니다. 이를 통해 warning이 점진적으로 쌓이는 것을 방지합니다.

---

### commitlint

#### 설정 파일 (`commitlint.config.js`)

```js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2, // 2 = error (위반 시 커밋 차단)
      'always', // 항상 이 규칙 적용
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'ci', 'perf', 'build', 'revert'],
    ],
    'scope-case': [2, 'always', 'kebab-case'], // scope는 kebab-case
    'subject-empty': [2, 'never'], // subject 비어있으면 안됨
    'subject-full-stop': [2, 'never', '.'], // subject 끝에 마침표 금지
    'type-empty': [2, 'never'], // type 비어있으면 안됨
    'type-case': [2, 'always', 'lower-case'], // type은 소문자
  },
};
```

#### 규칙 레벨 설명

| 레벨 | 값      | 의미                     |
| ---- | ------- | ------------------------ |
| `0`  | disable | 규칙 비활성화            |
| `1`  | warning | 경고만 표시, 커밋은 허용 |
| `2`  | error   | 에러 표시, 커밋 차단     |

#### 커밋 메시지 파싱 구조

```
feat(auth): 로그인 API 연동
│     │      │
│     │      └─ subject: 변경 내용 요약
│     └─ scope: 변경 범위 (선택, kebab-case)
└─ type: 커밋 종류 (필수, lower-case)
```

#### 규칙 커스터마이징 예시

scope를 필수로 바꾸고 싶다면:

```js
// commitlint.config.js
'scope-empty': [2, 'never'],  // scope 필수
```

특정 scope만 허용하고 싶다면:

```js
'scope-enum': [2, 'always', ['auth', 'api', 'ui', 'common']],
```

---

## 처음부터 설정하기

새 프로젝트에서 처음부터 Husky를 설정하는 방법입니다.

### Step 1: 패키지 설치

```sh
# npm
npm install -D husky lint-staged prettier @commitlint/cli @commitlint/config-conventional

# yarn (classic)
yarn add -D husky lint-staged prettier @commitlint/cli @commitlint/config-conventional

# yarn (berry / v4+)
yarn add -D husky lint-staged prettier @commitlint/cli @commitlint/config-conventional

# pnpm
pnpm add -D husky lint-staged prettier @commitlint/cli @commitlint/config-conventional
```

### Step 2: Husky 초기화

```sh
npx husky init
```

이 명령은 다음을 수행합니다:

1. `.husky/` 디렉토리 생성
2. `.husky/pre-commit` 샘플 파일 생성
3. `package.json`에 `"prepare": "husky"` 스크립트 추가

### Step 3: pre-commit hook 작성

```sh
# .husky/pre-commit 파일 내용을 교체
echo "npx lint-staged" > .husky/pre-commit
```

### Step 4: commit-msg hook 작성

```sh
# .husky/commit-msg 파일 생성
echo 'npx --no -- commitlint --edit ${1}' > .husky/commit-msg
```

### Step 5: lint-staged 설정

`package.json`에 추가합니다:

```jsonc
{
  // ... 기존 내용
  "lint-staged": {
    // 프로젝트에 맞게 확장자와 명령어를 조정하세요
    "*.{ts,tsx}": ["eslint --fix --max-warnings=0"],
    "*.{ts,tsx,js,jsx,json,css,scss,md}": ["prettier --write"],
  },
}
```

> 또는 `.lintstagedrc.json` 파일로 분리할 수도 있습니다.

### Step 6: commitlint 설정

프로젝트 루트에 `commitlint.config.js` 파일을 생성합니다:

```js
// ESM (package.json에 "type": "module"이 있는 경우)
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'ci', 'perf', 'build', 'revert'],
    ],
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
  },
};

// CJS (package.json에 "type": "module"이 없는 경우)
// module.exports = { ... } 형태로 작성
```

### Step 7: 검증

```sh
# commitlint 검증
echo "feat: 테스트 커밋" | npx commitlint     # ✅ 통과
echo "잘못된 메시지" | npx commitlint           # ❌ 실패

# lint-staged 검증 (staged 파일이 있어야 함)
git add .
npx lint-staged
```

### 전체 설정 요약 (체크리스트)

```
□ husky, lint-staged, prettier, @commitlint/cli, @commitlint/config-conventional 설치
□ npx husky init 실행
□ .husky/pre-commit → npx lint-staged
□ .husky/commit-msg → npx --no -- commitlint --edit ${1}
□ package.json에 lint-staged 설정 추가
□ commitlint.config.js 생성
□ package.json에 "prepare": "husky" 스크립트 확인
□ 테스트 커밋으로 동작 확인
```

---

## 트러블슈팅

### 1. `husky - pre-commit script failed`

```
husky - pre-commit script failed (code 1)
```

**원인**: lint-staged 실행 중 에러 발생 (ESLint 에러 또는 Prettier 실행 불가)

**해결**:

```sh
# 에러 내용 직접 확인
npx lint-staged --debug

# ESLint를 직접 실행하여 에러 확인
npx eslint src/문제파일.tsx

# Prettier가 설치되어 있는지 확인
npx prettier --version
```

### 2. `ENOENT: prettier --write`

```
✖ Task failed to spawn: prettier --write
ENOENT
```

**원인**: `prettier`가 프로젝트에 직접 설치되어 있지 않음 (`eslint-config-prettier`와는 다름)

**해결**:

```sh
yarn add -D prettier
```

### 3. `commitlint: type may not be empty`

```
✖ type may not be empty [type-empty]
```

**원인**: 커밋 메시지에 type이 없음

**해결**: Conventional Commits 규칙에 맞게 커밋 메시지를 작성하세요.

```sh
# ❌
git commit -m "로그인 기능 추가"

# ✅
git commit -m "feat: 로그인 기능 추가"
```

### 4. hook이 동작하지 않을 때

```sh
# Husky가 제대로 설치되었는지 확인
cat .git/config | grep hooksPath

# 결과가 없으면 다시 설치
npx husky

# hook 파일에 실행 권한이 있는지 확인 (macOS/Linux)
ls -la .husky/pre-commit
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### 5. Yarn Berry (v4) 환경에서 `npx` 관련 에러

Yarn Berry를 사용할 때 `npx`가 제대로 동작하지 않을 수 있습니다.

**해결**: `.husky/pre-commit`에서 `npx` 대신 `yarn`을 사용합니다.

```sh
# .husky/pre-commit
yarn lint-staged
```

```sh
# .husky/commit-msg
yarn commitlint --edit ${1}
```

### 6. CI 환경에서 Husky 비활성화

CI 환경에서는 Git hooks가 불필요하므로 비활성화할 수 있습니다.

```sh
# 환경변수로 비활성화
HUSKY=0 yarn install

# 또는 CI 환경변수를 감지하여 자동 스킵 (package.json)
{
  "scripts": {
    "prepare": "husky || true"
  }
}
```

`husky || true`로 설정하면 CI 환경에서 husky가 실패해도 install이 중단되지 않습니다.

---

## 참고 자료

- [Husky 공식 문서](https://typicode.github.io/husky/)
- [lint-staged 공식 저장소](https://github.com/lint-staged/lint-staged)
- [commitlint 공식 문서](https://commitlint.js.org/)
- [Conventional Commits 스펙](https://www.conventionalcommits.org/ko/v1.0.0/)
