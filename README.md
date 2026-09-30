# korean-anti-slop

AI가 쓴 한국어에서 자주 보이는 직역투를 모아 둔 목록입니다. "시끄럽다(noisy)", "진실 원천(source of truth)",
"조용히 실패한다(silently fails)"처럼 영어로 생각한 문장을 단어 단위로 옮긴 표현과, 한국어 개발자가 실제로 쓰는 말을
한 줄씩 짝지어 둡니다.

사람이 읽는 규칙은 [`korean-writing.md`](korean-writing.md)에, 같은 표를 정규식으로 검사하는 스크립트는
[`check.mjs`](check.mjs)에 있습니다.

## 쓰는 법

**에이전트 지침으로 넣기.** `korean-writing.md`를 프로젝트에 복사하고 에이전트가 읽게 합니다.
Claude Code라면 `.claude/rules/korean-writing.md`에 두거나 `CLAUDE.md`에서 링크하고, Cursor라면 `.cursor/rules/`에 둡니다.

**검사기 실행하기.** Node 18 이상이면 의존성 없이 동작합니다. 걸린 표현이 있으면 줄 번호와 대신 쓸 말을 출력하고 종료 코드 1을 돌려줍니다.

```sh
node check.mjs README.md docs/*.md
git diff --name-only | xargs node check.mjs   # 바뀐 파일만
```

## 표현 추가하기

리뷰에서, 혹은 AI가 쓴 글에서 어색한 직역을 발견했다면 PR로 한 줄 보내 주세요. 한 PR에 한 표현을 권장합니다.

1. `korean-writing.md` 표에 `| 쓰지 않는다 (원래 영어) | 대신 |` 한 줄을 추가합니다.
2. 오탐 없이 정규식으로 잡을 수 있는 표현이면 `check.mjs`의 `RULES`에도 한 줄을 추가합니다. `yes`에는 걸려야 하는 예문을,
   `no`에는 걸리면 안 되는 올바른 예문을 넣습니다. 일반 문장에서도 흔히 쓰는 말(raw, 쓴다 등)은 표에만 둡니다.
3. `node check.mjs --self-test`가 통과하는지 확인합니다. PR마다 CI에서도 같은 검사를 실행합니다.

PR 설명에는 그 표현을 실제로 본 문장 하나를 붙여 주시면 판단하기 쉽습니다. 기준은 하나입니다 —
"한국어 화자가 실제로 이렇게 말하는가".

## 라이선스

[CC0 1.0](LICENSE). 출처 표기 없이 복사하고 고쳐서 써도 됩니다.
