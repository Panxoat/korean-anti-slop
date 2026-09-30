# korean-anti-slop

AI가 쓴 한국어 글에는 영어 표현을 단어 그대로 옮긴 말이 자주 섞입니다. "경고가 시끄럽다(noisy)",
"진실 원천(source of truth)", "조용히 실패한다(fails silently)" 같은 말입니다. 이런 표현을 모으고,
한국어 개발자가 실제로 쓰는 말을 옆에 적었습니다.

규칙은 [`korean-writing.md`](korean-writing.md) 한 파일에 모두 있습니다.

## 쓰는 법

`korean-writing.md`를 프로젝트에 복사해서 AI 에이전트가 읽게 하면 됩니다. Claude Code는 `.claude/rules/`에,
Cursor는 `.cursor/rules/`에 넣습니다. `CLAUDE.md`나 `AGENTS.md`에서 링크해도 됩니다.

## 표현 추가하기

어색한 표현을 발견하면 Claude Code에 아래처럼 입력하면 됩니다. `〈 〉` 안만 바꿉니다.

```
https://github.com/Panxoat/korean-anti-slop 에 직역 표현을 하나 추가하는 PR을 올려 줘.
쓰지 않을 표현: 〈레버리지한다 (leverage)〉
대신 쓸 말: 〈활용한다〉
실제로 본 문장: 〈"기존 캐시를 레버리지해서 속도를 높였다"〉
```

PR을 머지할지는 "한국어 개발자가 동료에게 실제로 이렇게 말하는가"로 판단합니다.

### PR을 만드는 에이전트에게

1. `korean-writing.md`의 "직역 표현 → 대신 쓸 말" 표 맨 아래에 `| 표현 (원래 영어) | 대신 쓸 말 |` 형식으로 한 줄을 추가합니다.
2. 같거나 비슷한 표현이 이미 표에 있으면 새 줄을 만들지 않고 그 줄에 합칩니다.
3. PR 하나에는 표현 하나만 넣습니다. PR 설명에는 그 표현을 실제로 본 문장을 적습니다.
4. 레포에 쓰기 권한이 없으면 포크해서 PR을 올립니다.
5. 커밋 메시지와 PR 설명도 `korean-writing.md` 규칙을 따릅니다.

## 라이선스

[CC0 1.0](LICENSE). 출처를 밝히지 않고 복사하거나 고쳐 써도 됩니다.
