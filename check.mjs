#!/usr/bin/env node
// korean-writing.md "직역 표현" 표를 정규식으로 검사한다. 의존성 없음(Node 18+).
//   node check.mjs 파일...      걸린 줄을 출력하고, 하나라도 있으면 종료 코드 1
//   node check.mjs --self-test  각 규칙의 yes 는 걸리고 no 는 어느 규칙에도 걸리지 않는지 확인
// 표에 줄을 추가하면 여기에도 규칙을 하나 추가한다. 오탐 없이 잡기 어려운 표현(raw, 쓴다 등)은 표에만 둔다.
import { readFileSync } from "node:fs";

const RULES = [
  { bad: /시끄러/, fix: "경고가 너무 자주 뜬다", yes: ["경고가 시끄러워서 뺐다"], no: ["경고가 너무 자주 떠서 뺐다"] },
  { bad: /두 겹/, fix: "두 부분", yes: ["검사는 두 겹이다"], no: ["검사는 두 부분으로 나뉜다"] },
  { bad: /조용히 (사라|실패|무시)/, fix: "겉으로 드러나지 않는다, 알아챌 방법이 없다", yes: ["에러가 조용히 사라진다"], no: ["에러가 나도 알아챌 방법이 없다"] },
  { bad: /언랩/, fix: "`data`만 꺼내기", yes: ["응답을 언랩한다"], no: ["const v = unwrap(body);"] },
  { bad: /쌍둥이/, fix: "같은 경로의 파일", yes: ["host 의 쌍둥이 파일"], no: ["host 의 같은 경로의 파일"] },
  { bad: /드리프트/, fix: "어긋남, 구버전", yes: ["두 설정이 드리프트한다"], no: ["두 설정이 어긋난다"] },
  { bad: /굴러다/, fix: "남아 있다", yes: ["옛 스크립트가 굴러다닌다"], no: ["옛 스크립트가 남아 있다"] },
  { bad: /깨끗하/, fix: "문제가 없다", yes: ["린트가 깨끗하다"], no: ["린트에 문제가 없다"] },
  { bad: /잠갔다|잠그는|잠근다|잠글 /, fix: "검증한다", yes: ["이 규칙은 테스트가 잠갔다.", "규칙을 잠그는 테스트"], no: ["이 규칙은 테스트로 검증됩니다."] },
  { bad: /진실 원천/, fix: "기준", yes: ["레지스트리가 진실 원천이다"], no: ["레지스트리가 기준이다"] },
  { bad: /살아 있는 (계정|값|코드)/, fix: "아직 유효한 계정·값", yes: ["살아 있는 계정으로 테스트"], no: ["아직 유효한 계정으로 테스트"] },
  { bad: /죽은 코드/, fix: "주석 처리된 코드, 쓰이지 않는 코드", yes: ["죽은 코드를 지운다"], no: ["쓰이지 않는 코드를 지운다"] },
  { bad: /자리표시자/, fix: "아직 채워지지 않은 값", yes: ["자리표시자를 넣어 둔다"], no: ["placeholder 속성"] },
  { bad: /흡수(해|한다)/, fix: "~를 받는다", yes: ["차이를 흡수한다"], no: ["차이를 받는다"] },
  { bad: /파일 꼬리/, fix: "파일 끝부분", yes: ["파일 꼬리에 붙인다"], no: ["파일 끝부분에 붙인다"] },
  { bad: /(^|[^가-힣])잎 패키지/, fix: "다른 패키지에 의존하지 않는 패키지", yes: ["tokens 는 잎 패키지다"], no: ["나뭇잎 패키지 디자인"] },
  { bad: /(판정|신원) 축/, fix: "판정 기준, 신원 항목", yes: ["판정 축이 두 개다"], no: ["판정 기준이 두 개다"] },
  { bad: /무게로/, fix: "같은 비중으로 보다", yes: ["같은 무게로 센다"], no: ["같은 비중으로 본다"] },
  { bad: /쏟아진다/, fix: "많이 나온다", yes: ["오탐이 쏟아진다"], no: ["오탐이 많이 나온다"] },
  { bad: /프리미티브/, fix: "기반 라이브러리, 기본 컴포넌트", yes: ["UI 프리미티브"], no: ["기본 컴포넌트"] },
  { bad: /봉투/, fix: "request / response 와 필드 이름(`code`, `data`)", yes: ["// 응답 봉투를 벗겨 payload만 돌려준다"], no: ["// response에서 data만 꺼낸다", "const envelope = parse(body);"] },
  { bad: /응답 본문|요청 본문/, fix: "response body, request body", yes: ["응답 본문을 읽는다"], no: ["response body 를 읽는다", "권한을 요청한다"] },
  { bad: /되돌아간다/, fix: "원래대로 덮어써진다", yes: ["설정이 되돌아간다"], no: ["설정이 원래대로 덮어써진다"] },
  { bad: /창구/, fix: "경로", yes: ["단일 창구로 보낸다"], no: ["한 경로로 보낸다"] },
  { bad: /긁어 ?[오온와]|박아 ?넣/, fix: "내려받다, 넣다·기록하다", yes: ["문서를 긁어 온다", "버전을 박아 넣는다"], no: ["문서를 내려받는다"] },
  { bad: /memo`? ?가 듣는|값이 듣는/, fix: "`memo` 가 이전 값과 비교할 수 있다, 적용된다", yes: ["원시값으로 받아야 `memo` 가 듣는다", "설정 값이 듣는다"], no: ["설정 값이 적용된다"] },
  { bad: /인 거예요|거죠[.?!]/, fix: "~입니다", yes: ["그래서 필요한 거죠.", "캐시 때문인 거예요"], no: ["그래서 필요합니다."] },
];

const hits = (line) => RULES.filter((r) => r.bad.test(line));

if (process.argv[2] === "--self-test") {
  let failed = 0;
  for (const r of RULES) {
    for (const s of r.yes) if (!r.bad.test(s)) (failed++, console.error(`안 걸림: ${r.bad} ← "${s}"`));
    for (const s of r.no) for (const h of hits(s)) (failed++, console.error(`오탐: ${h.bad} ← "${s}"`));
  }
  console.log(failed ? `실패 ${failed}건` : `규칙 ${RULES.length}개 모두 통과`);
  process.exit(failed ? 1 : 0);
}

let found = 0;
for (const file of process.argv.slice(2)) {
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    for (const r of hits(line)) {
      found++;
      console.log(`${file}:${i + 1}: 「${line.match(r.bad)[0]}」 → ${r.fix}`);
    }
  });
}
process.exit(found ? 1 : 0);
