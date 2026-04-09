# CHANGELOG — onetask

---

## 2026-04-10 (세션 6)
### 완료
- 영어 단어장 DB 구축: `english_words` 테이블 생성, MUSE en-ko 15,868개 삽입
  - Facebook Research MUSE 사전 (en-ko.txt) 다운로드
  - 음역(transliteration) 필터링 후 유효 단어 15,868개
  - 컬럼: `id`, `word`, `meaning`, `created_at`
- HSK4 이미지 생성 스크립트 준비 (`gen_hsk4_images.py`, LIMIT 200)
- 모바일 LAN 접속 설정 완료 (frontend 0.0.0.0 바인딩, CORS 추가)

### 변경된 파일
- `backend/import_english.py` — 신규: MUSE en-ko import 스크립트
- `backend/gen_hsk4_images.py` — 신규: HSK4 watercolor 이미지 생성 스크립트
- `backend/main.py` — CORS origins에 192.168.219.104:3000 추가
- `frontend/.env.local` — 신규: NEXT_PUBLIC_API_URL=http://192.168.219.104:8000
- `frontend/package.json` — dev script에 -H 0.0.0.0 추가

### 다음 세션
- 영어 단어 API 엔드포인트 추가 (`/english-words`)
- 영어 단어장 프론트엔드 UI 구현
- HSK4 이미지 생성 실행 (python gen_hsk4_images.py)

---

## 2026-04-09 (세션 5)
### 완료
- HSK 6급 단어 전체 2500개 한국어 뜻 + 중국어 예문 + 한국어 번역 생성 및 DB 반영
  - 1/4 (ids 2211-2835): 이전 세션 완료
  - 2/4 (ids 2836-3460): 625개 — `hsk6_data_2.sql` + `append_hsk6_2.py`
  - 3/4 (ids 3461-4085): 625개 — `hsk6_data_3.sql` + `append_hsk6_3.py`
  - 4/4 (ids 4086-4710): 625개 — `hsk6_data_4.sql` + `append_hsk6_4.py`
  - `meaning` 컬럼에 저장 (초기 `korean` 컬럼명 오류 → `sed`로 수정)
  - 전체 HSK 6급 2500개 모두 filled 확인

### 변경된 파일
- `backend/hsk6_data_2.sql` — HSK 6급 2/4 배치 625개
- `backend/hsk6_data_3.sql` — HSK 6급 3/4 배치 625개
- `backend/hsk6_data_4.sql` — HSK 6급 4/4 배치 625개
- `backend/append_hsk6_2.py` — 2/4 뒷부분 312개 추가 스크립트
- `backend/append_hsk6_3.py` — 3/4 뒷부분 312개 추가 스크립트
- `backend/append_hsk6_4.py` — 4/4 뒷부분 312개 추가 스크립트

### 다음 세션
- 플래시카드 FSRS 시스템 구현 시작
- 푸시 알림(APScheduler + Web Push) 연동

---

## 2026-04-08 (세션 4)
### 완료
- HSK 4급 단어 601개 예문 + 한국어 뜻 + 병음 생성 및 DB 반영
  - `backend/hsk4_data.sql` (581개) + `backend/hsk4_data_fix.sql` (나머지 20개)
  - 포맷: `UPDATE words SET meaning=..., example_zh=..., example_ko=... WHERE id=N`
  - 일상 회화 중심 예문, HSK 4급 수준에 맞게 작성

### 변경된 파일
- `backend/hsk4_data.sql` — HSK 4급 단어 581개 데이터
- `backend/hsk4_data_fix.sql` — 나머지 20개 (id 891-910) 보완

### 다음 세션
- 2단계: 플래시카드 FSRS + 푸시 알림 시작
- HSK 5, 6급 예문 생성 (필요시)

---

## 2026-04-08 (세션 3)
### 완료
- Done List UI 개선: 오늘/이전 그룹핑, 완료 시간 표시, 뜻밖의 완료(urgency=low) ✨ 강조
- 로컬 캘린더 뷰 구현: 월별 그리드, 날짜별 완료 dot, 날짜 클릭 시 태스크 목록 표시
- 백엔드 `/tasks/history?year=&month=` 엔드포인트 추가
- 사이드바(PC) + 하단 네비(모바일) 에 캘린더 링크 추가

### 변경된 파일
- `backend/routers/tasks.py` — `/history` 엔드포인트 추가
- `frontend/src/lib/api.ts` — `api.tasks.history()` 추가
- `frontend/src/components/DoneList.tsx` — 신규: 오늘/이전 그룹, 완료시간, 뜻밖의 완료 강조
- `frontend/src/app/calendar/page.tsx` — 신규: 월별 캘린더 뷰
- `frontend/src/app/layout.tsx` — 사이드바에 캘린더 링크 추가
- `frontend/src/app/page.tsx` — DoneList 컴포넌트 연결, 하단 네비에 캘린더 추가

### 다음 세션
- 1단계 완료 → 2단계: 플래시카드 FSRS + 푸시 알림 시작
- recraft/ideogram 이미지 파라미터 오류 수정 (선택)

## 2026-04-08 (세션 2)
### 완료
- Replicate API로 단어 이미지 생성 테스트 스크립트 작성 (`test_images.py`)
- flux-dev, flux-schnell 결과 확인 (마음에 안 들어 스타일 변경)
- 새 스타일 4종 시도: flux-pro(flat illustration), recraft(vector), ideogram, sd3.5(pixar)
- flux-pro, sd3.5 결과 저장 완료 (recraft/ideogram는 API 파라미터 오류로 실패)

### 변경된 파일
- `backend/test_images.py` — 모델 4종 교체, 플래시카드용 단순 프롬프트로 변경, rate limit 딜레이 추가

### 다음 세션
- recraft/ideogram 파라미터 오류 수정 (`vector_illustration` → `digital_illustration/2d_art_poster`, `RESOLUTION_1024_1024` → `1024x1024`)
- 마음에 드는 스타일 확정 후 단어별 이미지 생성 파이프라인 연결
- 1단계 본 개발: Done List UI + 로컬 캘린더 뷰

## 2026-04-08
### 완료
- 프로젝트 기획 확정 (기술 스택, 개발 순서, AI 코치 규칙)
- `CLAUDE.md` 초안 작성
- `CHANGELOG.md` 초안 작성

### 변경된 파일
- `CLAUDE.md` — 최초 생성

### 다음 세션
- 1단계: Done List UI + 로컬 캘린더 뷰 개발 시작
- Next.js 프로젝트 초기 세팅 (`/frontend`)
- FastAPI 기본 구조 세팅 (`/backend`)
