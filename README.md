# 도도랩스 사이트 개선


공개 주소: https://yeju-rgb.github.io/dodolabs-site/

빌드 과정 없는 순수 정적 사이트입니다. 이 저장소의 파일을 그대로 웹서버 루트에 올리면 동작합니다.

## 구성
| 파일 | 내용 |
|---|---|
| `index.html` | 메인 (히어로 영상 · Who are we? · 서비스 · 몇대몇 · 웹 · 마케팅 · 게임 · 수치 · 프로세스 · 팀 · 푸터) |
| `company.html` | 회사 소개 |
| `mdm.html` | 몇대몇 서비스 |
| `team.html` | 팀 문화 |
| `contact.html` | 문의 (폼 화면만 있고 전송 연결 안 됨) |
| `dev.html` | 개발 중 안내 페이지 |
| `styles.css` | 전체 스타일 |
| `main.js` · `motion.js` · `depth.js` · `bg-lines.js` | 메인 인터랙션 · 서브페이지 스크롤 모션 · 깊이 효과 · 배경 라인 |
| `assets/` | 이미지 · 영상 (최대 파일 19MB) |

## 서버 요구사항
- 정적 호스팅이면 충분합니다 (Nginx, S3+CloudFront, GitHub Pages 등). 서버 로직 없음.
- mp4는 `Accept-Ranges`(부분 요청) 지원 서버 권장.
- 외부 로드는 Google Fonts(Inter, Noto Sans KR)뿐입니다.
- 상대경로(`./assets/...`)를 쓰므로 하위 경로 배포도 동작합니다.

## 배포 (GitHub Pages)
Settings → Pages → Source "Deploy from a branch", Branch `main` / `/(root)`. `main`에 push하면 1~2분 내 반영됩니다.

## 캐시
HTML에 `no-cache` 메타, CSS·JS·일부 에셋에 `?v=숫자` 쿼리가 붙어 있습니다. 운영 CDN 정책에 맞게 정리해도 됩니다.

## 미완성 · 확인 필요
- 문의 폼 전송 백엔드 미연결
- 게임 · 서비스 일부 카드 "Coming Soon"
- 모바일 레이아웃은 1차 범위 밖 (데스크톱 1440~1920px 기준, Safari · Chrome 확인)
