# Upstream Sync Log

> 이 문서는 원본 Auto-Claude와의 차이점을 추적합니다.
> **주의: 이 파일은 .gitignore에 추가되어 GitHub에 업로드되지 않습니다.**

## 기본 정보

| 항목 | 값 |
|------|-----|
| 원본 저장소 | https://github.com/AndyMik90/Auto-Claude |
| 포크 저장소 | https://github.com/eonofpixel/Auto-Claude-KR |
| 포크 기준 버전 | v2.7.4 |
| 현재 버전 | 1.0.0 |
| 마지막 동기화 | 2026-01-18 |

---

## 우리가 변경한 내용 (원본과 다른 점)

### 브랜딩 변경
- [x] productName: Auto-Claude → Auto-Claude-KR
- [x] appId: com.autoclaude.ui → com.eonofpixel.autoclaude-kr
- [x] 저장소 URL 변경

### 제거된 기능
- [x] GitHub 자동 업데이트 (electron-updater)
- [x] 베타 업데이트 채널
- [x] 업데이트 확인 버튼
- [x] 코드 서명 (macOS/Windows)
- [x] Apple Notarization
- [x] Azure Trusted Signing
- [x] AGPL-3.0 라이선스
- [x] GitHub 후원 (FUNDING.yml)

### 추가된 기능
- [x] 수동 파일 업데이트 (로컬 설치 파일 선택)
- [x] 한국어 i18n 지원 강화

### 수정된 파일 목록
- `apps/frontend/package.json` - 버전, 브랜딩, 빌드 설정
- `apps/frontend/src/main/app-updater.ts` - 수동 업데이트로 변경
- `apps/frontend/src/main/ipc-handlers/app-update-handlers.ts` - 간소화
- `apps/frontend/src/preload/api/app-update-api.ts` - 간소화
- `apps/frontend/src/shared/constants/ipc.ts` - 업데이트 채널 제거
- `apps/frontend/src/renderer/components/settings/AdvancedSettings.tsx` - UI 간소화
- `.github/workflows/release.yml` - 코드 서명 제거

---

## 원본 새 커밋 (검토 필요)

> `git fetch upstream && git log upstream/develop --oneline -20` 실행 후 업데이트

### 2026-01-18 확인

| 상태 | 커밋 | 설명 | 적용 여부 |
|------|------|------|----------|
| ⏳ | `0b2cf9b0` | ESLint → Biome 마이그레이션 | 검토 필요 |
| ⏳ | `4b740928` | API 401 토큰 복호화 버그 수정 | 검토 필요 |
| ⏳ | `e989300b` | Ultrathink 토큰 제한 버그 수정 | 검토 필요 |
| ⏳ | `f700b18d` | CodeQL 보안 수정 | 검토 필요 |
| ⏳ | `439ed86a` | 라이트 테마 prose-invert 수정 | 검토 필요 |
| ⏳ | `eb739afe` | 터미널 ESM/Sentry 호환성 | 검토 필요 |
| ⏳ | `b8655904` | planning→coding 재시도 로직 | 검토 필요 |
| ⏳ | `7cb9e0a3` | worktree 파일 누출 방지 | 검토 필요 |
| ⏳ | `3606a632` | Kanban 드래그 앤 드롭 | 검토 필요 |

**상태 범례:**
- ⏳ 검토 필요
- ✅ 적용 완료
- ❌ 적용 안함 (불필요/충돌)
- 🔄 부분 적용

---

## 동기화 히스토리

### 2026-01-18 - 초기 포크
- 원본 v2.7.4 기준으로 포크
- 브랜딩 변경 (Auto-Claude-KR)
- 업데이트 시스템 간소화
- 코드 서명 제거

---

## 명령어 참고

```bash
# 원본 최신 가져오기
git fetch upstream

# 새 커밋 확인
git log upstream/develop --oneline -20

# 특정 커밋 상세 보기
git show <commit-hash>

# 특정 커밋 적용
git cherry-pick <commit-hash>

# 특정 파일만 비교
git diff main upstream/develop -- <file-path>

# 충돌 시 중단
git cherry-pick --abort
```
