# 토스 Frontend Developer 면접 과제 🔥

## 설명

토스 과제 더미 데이터를 아카이빙합니다.

emotion이 기본 스타일링 라이브러리로 사용됩니다. (TDS도 emotion 기반으로 만들어졌습니다.)

## 환경 요구사항

| 항목 | 버전 |
| --- | --- |
| Node.js | v20.11.1 (`.nvmrc` 참고) |
| Yarn | v4.1.0 (Corepack) |

## Getting Started

```sh
# 1. 의존성 설치 (Husky Git hooks 자동 활성화)
yarn install

# 2. 개발 서버 실행
yarn dev
```

> `yarn install` 실행 시 `prepare` 스크립트를 통해 Husky가 자동으로 설치됩니다.
> 별도의 추가 설정 없이 Git hooks가 활성화됩니다.

## Git Hooks

### Pre-commit

커밋 시 staged 파일에 대해 자동으로 lint & format을 실행합니다.

| 대상 파일 | 실행 명령어 |
| --- | --- |
| `*.ts`, `*.tsx` | `eslint --fix --max-warnings=0` |
| `*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.json`, `*.css`, `*.scss`, `*.md` | `prettier --write` |

### Commit Message Convention

[Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다.

```
<type>(<scope>): <subject>
```

- **type** (필수): 커밋의 종류
- **scope** (선택): 변경 범위 (kebab-case)
- **subject** (필수): 변경 내용 요약

#### 허용되는 type 목록

| type | 설명 |
| --- | --- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 변경 |
| `style` | 코드 포맷팅 (동작 변경 없음) |
| `refactor` | 리팩토링 (기능/버그 변경 없음) |
| `test` | 테스트 추가 및 수정 |
| `chore` | 빌드 설정, 패키지 매니저 등 기타 변경 |
| `ci` | CI/CD 설정 변경 |
| `perf` | 성능 개선 |
| `build` | 빌드 관련 변경 |
| `revert` | 이전 커밋 되돌리기 |

#### 예시

```sh
# ✅ 올바른 커밋 메시지
feat: 로그인 페이지 추가
fix(auth): 토큰 만료 시 리다이렉트 누락 수정
docs: README 업데이트
refactor(api): HTTP 클라이언트 추상화

# ❌ 잘못된 커밋 메시지
기능 추가                # type 누락
Feature: 로그인 추가     # type은 소문자만 허용
feat: 로그인 추가.       # subject 끝에 마침표 불가
```

## 기술 스택

| 분류 | 기술 |
| --- | --- |
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Emotion |
| Routing | React Router v6 |
| Linting | ESLint + Prettier |
| Git Hooks | Husky + lint-staged + commitlint |
