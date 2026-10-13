# LUMEN — 카페24 반응형 스킨 디자인 스펙 (공통 기준)

## 컨셉
- 이름: **LUMEN** (루멘) — 미니멀 패션·라이프스타일 반응형 스킨
- 타깃: 의류/잡화/리빙 1인~소규모 브랜드 쇼핑몰
- 키워드: 여백, 큰 이미지, 세리프 포인트 타이포, 빠른 로딩

## 토큰
| 토큰 | 값 |
|---|---|
| --c-ink | #141414 |
| --c-sub | #6B6B6B |
| --c-line | #E6E4E0 |
| --c-bg | #FFFFFF |
| --c-bg-soft | #F6F4F0 |
| --c-accent | #B5532F (테라코타, 세일/배지/포인트) |
| --font-base | "Pretendard", -apple-system, "Apple SD Gothic Neo", sans-serif |
| --font-display | "Cormorant Garamond", "Noto Serif KR", serif (영문 헤드라인 전용) |
| --container | 1320px, 좌우 패딩 20px(모바일) / 40px(PC) |
| radius | 0 (각진 미니멀), 버튼만 2px |
| breakpoint | mobile < 768 ≤ tablet < 1024 ≤ desktop |

## 공통 컴포넌트
- 헤더: 상단 공지 띠배너(닫기) → 로고 중앙 / 좌측 카테고리 / 우측 검색·로그인·장바구니(수량 배지). 스크롤 시 sticky + 축소.
- 모바일: 햄버거 → 좌측 슬라이드 드로어(카테고리 아코디언), 하단 고정 탭바(홈/카테고리/검색/마이/장바구니)
- 메인: 풀폭 비주얼 슬라이더 → 카테고리 바로가기 → NEW ARRIVALS(4열/모바일 2열) → 배너 2분할 → BEST(탭) → 룩북/에디토리얼 → 인스타그램 그리드 → 뉴스레터
- 상품카드: 4:5 비율 이미지, hover 시 두번째 이미지, 상품명, 할인율(accent)+판매가+소비자가(취소선), 컬러칩, NEW/BEST/SALE 배지
- 상세: 좌 갤러리(썸네일) / 우 sticky 구매박스, 하단 탭(상세정보/구매안내/리뷰/Q&A), 모바일 하단 고정 구매버튼
- 푸터: 회사정보(카페24 변수), CS, 은행정보, SNS

## 커스터마이징 포인트(구매자용)
- 색상/폰트는 `css/lumen.variables.css` 한 파일에서 변경
- 메인 배너/섹션 on/off는 `index.html` 주석 블록 단위
