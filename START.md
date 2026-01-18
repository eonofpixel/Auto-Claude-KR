# Auto-Claude-KR 시작 가이드

> 다른 컴퓨터에서 프로젝트를 설정하고 실행하는 방법입니다.

## 요구사항

| 항목 | 버전 | 확인 명령어 |
|------|------|-------------|
| Node.js | >= 24.0.0 | `node -v` |
| npm | >= 10.0.0 | `npm -v` |
| Python | >= 3.12 | `python --version` |
| Git | 최신 | `git --version` |

---

## 1. 저장소 클론

```bash
git clone https://github.com/eonofpixel/Auto-Claude-KR.git
cd Auto-Claude-KR
```

---

## 2. Upstream 설정 (원본 추적용)

원본 Auto-Claude와 동기화를 위해 upstream을 설정합니다.

```bash
git remote add upstream https://github.com/AndyMik90/Auto-Claude.git
git fetch upstream
```

**확인:**
```bash
git remote -v
# origin    https://github.com/eonofpixel/Auto-Claude-KR.git (fetch)
# origin    https://github.com/eonofpixel/Auto-Claude-KR.git (push)
# upstream  https://github.com/AndyMik90/Auto-Claude.git (fetch)
# upstream  https://github.com/AndyMik90/Auto-Claude.git (push)
```

---

## 3. 의존성 설치

### 방법 A: 전체 설치 (권장)

```bash
npm run install:all
```

### 방법 B: 개별 설치

```bash
# Frontend
cd apps/frontend
npm install

# Backend (uv 사용)
cd ../backend
uv venv
uv pip install -r requirements.txt
```

> **참고:** `uv`가 없다면 `pip install uv`로 설치

---

## 4. 환경 설정

### Backend .env 파일 생성

```bash
cp apps/backend/.env.example apps/backend/.env
```

### Claude OAuth 토큰 설정

```bash
claude setup-token
```

발급받은 토큰을 `apps/backend/.env`에 추가:

```env
CLAUDE_CODE_OAUTH_TOKEN=your-token-here
```

---

## 5. 실행

### 개발 모드

```bash
# 루트에서
npm run dev

# 또는 프론트엔드 폴더에서
cd apps/frontend
npm run dev
```

### 프로덕션 빌드

```bash
cd apps/frontend
npm run package        # 현재 OS용 빌드
npm run package:win    # Windows용
npm run package:mac    # macOS용
npm run package:linux  # Linux용
```

---

## IDE별 설정

### VS Code

1. 프로젝트 폴더 열기: `File > Open Folder > Auto-Claude-KR`

2. 권장 확장 설치:
   - ESLint
   - Prettier
   - Python
   - TypeScript

3. 터미널에서 실행:
   ```bash
   npm run dev
   ```

### Cursor

1. 프로젝트 폴더 열기: `File > Open Folder > Auto-Claude-KR`

2. 터미널 열기: `Ctrl + `` ` ``

3. 실행:
   ```bash
   npm run dev
   ```

### WebStorm / IntelliJ

1. `File > Open > Auto-Claude-KR` 폴더 선택

2. Node.js 인터프리터 설정:
   - `Settings > Languages & Frameworks > Node.js`
   - Node 경로 지정

3. npm 스크립트 실행:
   - `package.json` 우클릭 > `Show npm Scripts`
   - `dev` 더블클릭

### PyCharm (Backend 전용)

1. `apps/backend` 폴더를 프로젝트로 열기

2. Python 인터프리터 설정:
   - `Settings > Project > Python Interpreter`
   - `.venv` 폴더의 Python 선택

3. 실행:
   ```bash
   python run.py --list
   ```

---

## Claude Code (CLI)에서 시작

```bash
# 프로젝트 폴더로 이동
cd Auto-Claude-KR

# Claude Code 실행
claude

# 또는 특정 작업과 함께
claude "프로젝트 구조 설명해줘"
```

---

## 문제 해결

### Node.js 버전 오류

```bash
# nvm 사용 시
nvm install 24
nvm use 24
```

### Python 가상환경 문제

```bash
cd apps/backend
rm -rf .venv
uv venv
uv pip install -r requirements.txt
```

### npm 설치 오류

```bash
# 캐시 정리 후 재설치
npm cache clean --force
rm -rf node_modules
npm install
```

### Windows에서 node-pty 빌드 오류

Visual Studio Build Tools 필요:
```bash
npm install -g windows-build-tools
```

---

## 유용한 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 모드 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run test` | 테스트 실행 |
| `npm run lint` | 린트 검사 |
| `git fetch upstream` | 원본 최신 가져오기 |
| `git log upstream/develop --oneline -10` | 원본 새 커밋 확인 |

---

## 관련 문서

- [CLAUDE.md](./CLAUDE.md) - 프로젝트 개발 가이드
- [UPSTREAM_SYNC.md](./UPSTREAM_SYNC.md) - 원본과의 동기화 추적
- [README.md](./README.md) - 프로젝트 소개
