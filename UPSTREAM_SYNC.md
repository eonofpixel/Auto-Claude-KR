# Upstream Sync Log

> 원본 Auto-Claude와의 차이점을 추적하는 문서입니다.

## 기본 정보

| 항목 | 값 |
|------|-----|
| 원본 저장소 | https://github.com/AndyMik90/Auto-Claude |
| 포크 저장소 | https://github.com/eonofpixel/Auto-Claude-KR |
| 포크 기준 버전 | v2.7.4 |
| 현재 버전 | 1.0.0 |
| 마지막 동기화 확인 | 2026-01-19 |

---

## 현재 차이 요약

**총 346개 파일, +20,985줄 / -16,376줄 차이**

### 원본에 있고 우리에게 없는 것

| 카테고리 | 파일/기능 | 설명 |
|----------|-----------|------|
| 라이선스 | `LICENSE` | AGPL-3.0 (661줄) |
| 후원 | `.github/FUNDING.yml` | GitHub 스폰서 설정 |
| 코드 서명 | `finalize-macos-notarization` | Apple 공증 |
| 코드 서명 | `submit-macos-notarization` | Apple 공증 제출 |
| CI/CD | `release.yml` 업데이트 | +388줄 (서명/공증 포함) |
| 보안 문서 | `PROMPT_INJECTION_DEFENSE.md` | 프롬프트 인젝션 방어 |
| 보안 문서 | `SECURITY_COMMANDS.md` | 보안 명령어 문서 |
| 설계 문서 | `DOCKER_NATIVE_DESIGN.md` | Docker 네이티브 설계 |
| 백엔드 | `auth.py` 대폭 수정 | +305줄 (토큰 관리 개선) |
| 백엔드 | `INVESTIGATION.md` | 조사 문서 |
| 린터 | Biome 마이그레이션 | ESLint → Biome |
| 테스트 | 새 테스트 파일들 | `test_auth.py`, `test_client.py`, `test_git_executable.py` |

### 우리만 가진 것

| 파일/기능 | 설명 |
|-----------|------|
| `UPSTREAM_SYNC.md` | 이 동기화 추적 문서 |
| 수동 업데이트 시스템 | 파일 선택 방식 업데이트 |
| 한국어 i18n 강화 | 추가 번역 |
| 브랜딩 | Auto-Claude-KR |

---

## 우리가 변경한 내용

### 브랜딩 변경
- [x] productName: `Auto-Claude` → `Auto-Claude-KR`
- [x] appId: `com.autoclaude.ui` → `com.eonofpixel.autoclaude-kr`
- [x] version: `2.7.4` → `1.0.0`
- [x] 저장소 URL: `eonofpixel/Auto-Claude-KR`

### 제거된 기능
- [x] GitHub 자동 업데이트 (electron-updater)
- [x] 베타 업데이트 채널
- [x] 업데이트 확인 버튼
- [x] macOS 코드 서명 (CSC_LINK)
- [x] macOS Notarization
- [x] Windows Azure Trusted Signing
- [x] AGPL-3.0 라이선스 파일
- [x] GitHub 후원 설정 (FUNDING.yml)

### 추가된 기능
- [x] 수동 파일 업데이트 (로컬 설치 파일 선택)
- [x] 한국어 i18n 지원 강화

### 수정된 파일 목록
```
apps/frontend/package.json              - 버전, 브랜딩, 빌드 설정
apps/frontend/src/main/app-updater.ts   - 수동 업데이트로 전체 재작성
apps/frontend/src/main/ipc-handlers/app-update-handlers.ts - 간소화
apps/frontend/src/preload/api/app-update-api.ts - 간소화
apps/frontend/src/shared/constants/ipc.ts - 업데이트 채널 제거
apps/frontend/src/renderer/components/settings/AdvancedSettings.tsx - UI 간소화
.github/workflows/release.yml           - 코드 서명 단계 제거
```

---

## 원본 새 커밋 (검토 필요)

> 마지막 확인: 2026-01-18

### 중요도 높음 (버그 수정)

| 상태 | 커밋 | 설명 | PR |
|------|------|------|-----|
| ✅ | `4b740928` | **API 401 수정** - 토큰 복호화 버그 | #1283 |
| ✅ | `e989300b` | **Ultrathink 토큰 제한 버그 수정** | #1284 |
| ⏳ | `f700b18d` | CodeQL 보안 수정 | #1286 |
| ✅ | `44304a61` | Planning 단계 잘못된 멈춤 감지 수정 | #1236 |
| ✅ | `90204469` | Windows 좀비 프로세스 축적 방지 | #1259 |
| ✅ | `cb786cac` | Windows pywin32 DLL 로딩 실패 수정 | #1244 |

### 중요도 중간 (기능 개선)

| 상태 | 커밋 | 설명 | PR |
|------|------|------|-----|
| ⏳ | `0b2cf9b0` | ESLint → Biome 마이그레이션 | #1289 |
| ⏳ | `3606a632` | **Kanban 드래그 앤 드롭 정렬** | #1217 |
| ⏳ | `8833feb2` | Worktree 일괄 삭제 기능 | #1208 |
| ⏳ | `715202b8` | Human Review 일괄 선택 & PR 생성 | #1248 |
| ⏳ | `87c84073` | PR 상세 뷰에 브랜치 업데이트 버튼 | #1242 |

### 중요도 낮음 (UI/UX 개선)

| 상태 | 커밋 | 설명 | PR |
|------|------|------|-----|
| ⏳ | `439ed86a` | 라이트 테마 prose-invert 수정 | #1160 |
| ⏳ | `eb739afe` | 터미널 ESM/Sentry 호환성 | #1275 |
| ⏳ | `b8655904` | planning→coding 재시도 로직 | #1276 |
| ⏳ | `7cb9e0a3` | worktree 파일 누출 방지 | #1267 |
| ⏳ | `75a3684c` | 터미널 렌더링/지속성/링크 수정 | #1215 |
| ⏳ | `193d2ed9` | 프로젝트 전환 시 터미널 출력 멈춤 수정 | #1241 |

**상태 범례:**
- ⏳ 검토 필요
- ✅ 적용 완료
- ❌ 적용 안함 (불필요/충돌)
- 🔄 부분 적용

---

## 동기화 히스토리

### 2026-01-19 - 주요 버그 수정 적용
- `4b740928` cherry-pick: API 401 토큰 복호화 버그 수정
- `e989300b` cherry-pick: Ultrathink 토큰 제한 버그 수정
- `90204469` cherry-pick: Windows 좀비 프로세스 축적 방지 (app-updater.ts 충돌은 우리 버전 유지)
- `44304a61` cherry-pick: Planning 단계 잘못된 멈춤 감지 수정

### 2026-01-18 - pywin32 수정 적용
- `cb786cac` cherry-pick: Windows pywin32 DLL 로딩 실패 수정

### 2026-01-18 - 초기 포크
- 원본 v2.7.4 기준으로 포크
- 브랜딩 변경 (Auto-Claude-KR v1.0.0)
- 업데이트 시스템 수동 방식으로 변경
- 코드 서명 제거
- 라이선스/후원 제거

---

## 명령어 참고

```bash
# 원본 최신 가져오기
git fetch upstream

# 새 커밋 확인
git log upstream/develop --oneline -20

# 전체 차이 통계
git diff main upstream/develop --stat

# 특정 파일 차이 보기
git diff main upstream/develop -- <file-path>

# 특정 커밋 상세 보기
git show <commit-hash>

# 특정 커밋 적용
git cherry-pick <commit-hash>

# 충돌 시 중단
git cherry-pick --abort

# 특정 기간 커밋만 보기
git log upstream/develop --oneline --since="1 week ago"
```

---

## 적용 권장 순서

1. **버그 수정 먼저**: `4b740928`, `e989300b`, `90204469`
2. **보안 수정**: `f700b18d`
3. **기능 개선**: `3606a632` (Kanban), `8833feb2` (Worktree)
4. **나머지 선택적 적용**
