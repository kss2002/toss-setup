export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // type 목록: feat, fix, docs, style, refactor, test, chore, ci, perf, build, revert
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'ci', 'perf', 'build', 'revert'],
    ],
    // scope는 선택 사항 (기본값 유지)
    'scope-case': [2, 'always', 'kebab-case'],
    // subject 관련
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    // type 관련
    'type-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
  },
};
