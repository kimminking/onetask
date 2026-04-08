# CHANGELOG — onetask

---

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
