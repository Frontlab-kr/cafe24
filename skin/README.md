# LUMEN (루멘) — 카페24 반응형 스킨

미니멀 패션·라이프스타일 쇼핑몰을 위한 카페24 **스마트디자인(반응형)** 스킨입니다.
여백, 큰 이미지, 세리프 포인트 타이포, 빠른 로딩을 키워드로 설계했습니다.

- 대상: 의류 · 잡화 · 리빙 1인~소규모 브랜드
- 지원: 모바일(~767px) · 태블릿(768~1023px) · PC(1024px~) 반응형
- 의존성: 없음 (Vanilla JS). 웹폰트만 CDN 사용 — Pretendard(jsDelivr), Cormorant Garamond(Google Fonts)
- 디자인 미리보기: 저장소의 `preview/` 폴더 (카페24 없이 브라우저에서 바로 열림)

---

## 1. 파일 구조

```
skin/
├─ index.html                  메인 (섹션 8개, 주석 블록 단위 on/off)
├─ layout/basic/
│  ├─ layout.html              서브 페이지 공통 레이아웃 (CSS/JS 로드, @contents)
│  ├─ main.html                메인 전용 레이아웃 (body.lm-page-main)
│  ├─ header.html              띠배너 · 헤더 · 검색 · 모바일 드로어 · 하단 탭바
│  ├─ footer.html              사업자정보(Layout_footer) · 고객센터 · 계좌 · SNS · 맨 위로
│  └─ icons.html               SVG 아이콘 스프라이트 (<use href="#lm-i-이름">)
├─ product/
│  ├─ list.html                분류 목록 (하위분류 칩 · 정렬 · 그리드 · 페이징)
│  ├─ detail.html              상세 (갤러리 · sticky 구매박스 · 탭 · 리뷰/Q&A · 모바일 구매바)
│  └─ search.html              검색 결과
├─ order/
│  ├─ basket.html              장바구니 (상품 카드 + 결제 예정 금액 박스)
│  └─ orderform.html           주문서 (구조 + 스타일 훅 — 기본 스킨 병합용)
├─ member/
│  ├─ login.html               로그인 · 비회원 주문조회 · SNS 로그인
│  └─ join.html                회원가입 정보 입력
├─ myshop/index.html           마이쇼핑 (혜택 · 주문 현황 · 메뉴)
├─ board/free/list.html        게시판 목록 (자유게시판 board_no=5 기준)
├─ css/
│  ├─ lumen.variables.css      ★ 색상 · 폰트 · 간격 토큰 (커스터마이징은 여기서)
│  ├─ lumen.base.css           리셋 · 타이포 · 버튼 · 폼 · 접근성(포커스)
│  ├─ lumen.layout.css         띠배너 · 헤더 · GNB · 검색 · 드로어 · 탭바 · 푸터
│  ├─ lumen.components.css     상품카드 · 배지 · 컬러칩 · 슬라이더 · 탭 · 배너 · 페이징 등
│  └─ lumen.pages.css          목록 · 상세 · 장바구니 · 주문서 · 회원 · 마이쇼핑 · 게시판
└─ js/lumen.js                 sticky 헤더 · 드로어 · 슬라이더 · 탭 · 갤러리 · hover 이미지 ·
                               띠배너 닫기(localStorage) · 맨 위로 · 정렬 · 할인율 계산 등
```

모든 클래스는 `lm-` 접두사를 사용하므로 기본 스킨 CSS와 충돌하지 않습니다.

---

## 2. 설치 방법

### 2-1. 디자인 준비 (공통)
1. 카페24 관리자 › **디자인(PC/모바일)** › **디자인 보관함** 으로 이동합니다.
2. **디자인 추가** › 카페24 **기본 반응형 디자인**을 추가(복사)합니다.
   LUMEN은 기본 반응형 스킨의 파일 구조를 그대로 따르므로, 기본 스킨 위에 덮어쓰는 방식이 가장 안전합니다.
3. 추가한 디자인을 **대표 디자인으로 설정하기 전에** 아래 작업을 모두 마치고 미리보기로 확인하세요.

### 2-2. 방법 A — FTP 업로드 (권장)
1. 관리자 › 디자인 보관함에서 대상 디자인의 **스킨 번호**(예: `skin3`)를 확인합니다.
2. FTP 프로그램(FileZilla 등)으로 쇼핑몰 FTP에 접속합니다.
   접속 정보는 관리자 › 상점관리(또는 디자인) 메뉴의 **FTP 정보**에서 확인합니다.
3. `/skin3/` (확인한 번호) 폴더에 이 `skin/` 폴더의 **내용물**을 업로드합니다.
   - `css/`, `js/`, `layout/basic/icons.html` 은 **새 파일**이므로 그대로 추가됩니다.
   - 나머지 HTML 은 기본 스킨 파일을 **덮어씁니다** → 먼저 원본을 백업하세요.
4. 배너·로고 이미지는 `/web/upload/lumen/` 폴더를 만들어 업로드합니다 (아래 4장 참고).

### 2-3. 방법 B — 스마트디자인 편집기
1. 디자인 보관함 › 대상 디자인 › **편집** 으로 스마트디자인 편집기를 엽니다.
2. 왼쪽 파일 트리에서 `css` 폴더에 **새 파일**을 만들고 이름을 `lumen.variables.css` 등으로 지정한 뒤 내용을 붙여 넣습니다. (`js/lumen.js`, `layout/basic/icons.html` 도 동일)
3. 기존 HTML 파일(`index.html`, `layout/basic/layout.html` …)을 열어 LUMEN 파일 내용으로 교체하고 저장합니다.
4. 편집기 상단 **미리보기**로 PC/모바일 화면을 확인합니다.

---

## 3. 기본 스킨과 병합해야 하는 파일

카페24는 일부 페이지에서 **모듈 내부의 id · name · onclick 을 스크립트가 직접 참조**합니다.
이런 페이지는 LUMEN 파일로 통째로 교체하기보다, **기본 스킨의 동작 영역을 남기고 LUMEN 마크업으로 감싸는 병합**을 권장합니다.

| 파일 | 교체/병합 | 방법 |
|---|---|---|
| `layout/basic/layout.html`, `main.html`, `header.html`, `footer.html`, `icons.html` | **교체** | 그대로 덮어쓰기. 단, 기본 스킨 레이아웃에 있던 `<!--@js(...)-->` 중 앱/마케팅 스크립트가 있다면 옮겨 오세요. |
| `index.html`, `product/list.html`, `product/search.html` | **교체** | 그대로 사용. 메인진열 번호·분류 번호만 쇼핑몰에 맞게 수정. |
| `board/free/list.html`, `myshop/index.html`, `member/login.html` | **교체 후 확인** | 모듈명/변수가 스킨 버전마다 다를 수 있어 미리보기로 확인 (CHECK 목록 참고). |
| `product/detail.html` | **병합** | 옵션 표 · `#totalProducts` · `#totalPrice` · `product_action` 영역은 기본 스킨 것을 복사해 `[MERGE]` 위치에 붙여 넣기. 간편결제 버튼 영역도 기본 스킨에서 복사. |
| `order/basket.html` | **병합** | `Order_normnormal` 안의 상품 행 · 전체선택 체크박스 · 주문 버튼 onclick 을 기본 스킨 값으로 맞추기. |
| `order/orderform.html` | **병합(필수)** | 구조만 제공. 기본 스킨 주문서 본문을 `[MERGE-1~4]` 위치에 붙여 넣으면 LUMEN 스타일이 적용됩니다. |
| `member/join.html` | **병합** | 쇼핑몰의 회원가입 항목 설정에 따라 필드가 다르므로 기본 스킨 입력 행을 `lm-join__row` 로 감싸기. |

> 병합 시 원칙: **모듈 div, `{$form.*}`, `{$action_*}`, id/name/onclick 은 수정하지 말고**, 바깥에 `lm-` 클래스만 추가합니다.

---

## 4. 이미지 준비

`/web/upload/lumen/` 폴더(FTP)에 아래 파일명으로 올리면 별도 수정 없이 연결됩니다.

| 파일명 | 권장 크기 | 위치 |
|---|---|---|
| `main_visual_01.jpg`, `main_visual_02.jpg` | 1920×840 (16:7) | 메인 비주얼 PC |
| `main_visual_01_mo.jpg`, `main_visual_02_mo.jpg` | 1080×1350 (4:5) | 메인 비주얼 모바일 |
| `cate_01.jpg` ~ `cate_06.jpg` | 600×600 | 카테고리 바로가기 (원형) |
| `banner_split_01.jpg`, `banner_split_02.jpg` | 1200×1500 (4:5) | 배너 2분할 |
| `lookbook_01.jpg` (4:5), `lookbook_02.jpg` (3:4) | 1000px 이상 | 룩북 |
| `insta_01.jpg` ~ `insta_06.jpg` | 600×600 | 인스타그램 그리드 |

- **상품 이미지**는 4:5 비율(예: 800×1000)로 등록하면 가장 깔끔합니다.
- **상품 hover 이미지**: 목록에서 마우스를 올리면 **작은목록이미지**(`{$image_small}`)로 교체됩니다.
  상품 등록 시 작은목록이미지에 착용컷/디테일컷을 넣어 두세요. (대표 이미지와 같으면 교체하지 않음)
- 메인 비주얼 위 문구는 흰색이므로 **어두운 톤 이미지**를 권장합니다.

---

## 5. 커스터마이징

### 색상 · 폰트
`css/lumen.variables.css` 한 파일만 수정합니다.

```css
--c-ink: #141414;      /* 기본 텍스트 · 버튼 */
--c-accent: #B5532F;   /* 세일 · 배지 · 할인율 (테라코타) */
--c-bg-soft: #F6F4F0;  /* 섹션 배경 */
--font-base: "Pretendard", ...;
--font-display: "Cormorant Garamond", ...;  /* 영문 헤드라인 전용 */
--grid-cols: 2;        /* 목록 열 수 (모바일 2 / 태블릿 3 / PC 4 — 하단 미디어쿼리) */
```

### 메인 섹션 켜기/끄기
`index.html` 은 `[SECTION nn] START` ~ `[SECTION nn] END` 주석으로 구분되어 있습니다.
- 잠시 끄기: 해당 `<section>` 태그에 `hidden` 속성 추가
- 완전 삭제: START ~ END 블록 통째로 삭제
- 섹션 안에 카페24 설정 주석(`<!-- $count = 8 -->`)이 있으므로 **블록 전체를 다시 주석으로 감싸지 마세요.**

### 메인 상품 진열
| 섹션 | 모듈 | 관리자 설정 |
|---|---|---|
| NEW ARRIVALS | `product_listmain_1` | 상품 › 메인진열 관리 › 메인진열 1 |
| BEST 탭 1 | `product_listmain_2` | 메인진열 2 |
| BEST 탭 2 | `product_listmain_3` | 메인진열 3 (없으면 진열 추가) |
| BEST 탭 3 | `product_listmain_4` | 메인진열 4 (없으면 진열 추가) |

진열 개수는 각 모듈 안의 `$count = 8` 값을 바꿉니다.

### 상단 띠배너
`layout/basic/header.html` 맨 위 블록. 문구 수정 후 `data-lm-topbanner` 값을 바꾸면(예: `notice-02`) 이전에 닫은 고객에게도 다시 노출됩니다. 닫힘 상태는 브라우저 localStorage에 저장되며, 사용 불가 환경(시크릿 모드 등)에서도 오류 없이 동작합니다.

### 상품 목록 가격 표시
가격 영역은 카페24 **상품 정보 표시 설정**(`product_ListItem`)을 그대로 사용합니다.
관리자 › 상품 › 상품 보기 설정 › 상품 정보 표시 설정에서 **판매가 → 소비자가** 순으로 표시하면 LUMEN 디자인(판매가 굵게 · 소비자가 취소선)에 맞춰집니다.
할인율(테라코타 %)은 `lumen.js` 가 판매가/소비자가 값으로 계산해 앞에 붙입니다.

---

## 6. CHECK 목록 (적용 전 반드시 확인)

카페24 모듈/변수 이름은 스킨 버전·쇼핑몰 설정에 따라 다를 수 있습니다.
소스 안에 `<!-- CHECK: ... -->` 로 표시한 곳을, **샘플 쇼핑몰 편집기의 기본 반응형 스킨 같은 파일**과 대조해 주세요.
(편집기에서 `CHECK:` 로 검색하면 모두 찾을 수 있습니다.)

**레이아웃**
- [ ] `header.html` — `Layout_category` 의 `{$param}`, `{$name_or_img_tag}`, `{$cate_no}` 변수
- [ ] `header.html` — `Layout_stateLogon` 로그아웃 링크 `{$action_logout}`, 회원명 `{$name}`
- [ ] `header.html` — `Layout_SearchHeader` 내부 (기본 스킨은 `{$form.keyword}`, `{$action_search_submit}` 사용 가능)
- [ ] `header.html` — `Layout_orderBasketcount` 의 `{$basket_count}`
- [ ] `footer.html` — `Layout_footer` 변수(`{$company_name}`, `{$president_name}`, `{$company_regno}`, `{$network_regno}`, `{$phone}`, `{$mall_addr1}`, `{$cpo_name}`, `{$cpo_email}`, `{$mall_name}`) 및 사업자정보확인 `{$action_regno_info}`
- [ ] `lumen.js` — 하위 분류 JSON(`/exec/front/Product/SubCategory`)의 필드명(`cate_no`, `parent_cate_no`, `name`, `design_page_url`, `param`)

**상품**
- [ ] 목록 공통 — `{$link_product_detail}`, `{$image_medium}`, `{$image_small}`, `{$wish_icon}`, `{$basket_icon}`, `{$color_chip}`, `{$product_price}`, `{$product_custom}`
- [ ] `product/list.html` — `product_headcategory`, `product_displaycategory`, `product_listrecommend`, `product_normalmenu`(`{$prd_count}`), `product_normalpaging`
- [ ] `product/list.html` — 정렬 `sort_method` 번호(5/6/1/2/7)
- [ ] `product/search.html` — `product_search`, `product_searchresult`, `{$search_count}`, 결과 없음 처리, `product_searchpaging`
- [ ] `product/detail.html` — `{$big_img}`/`BigImage`, `product_addimage`(`{$image_big}`), 상세 아이콘·영문명·요약설명 변수, 옵션(`product_option`, `{$form.option_value}`), `#totalProducts`, `product_action`(`{$action_buy}`, `{$action_basket}`, `{$action_wishlist}`), 쿠폰 다운로드, 상품정보고시, `{$product_detail}`, 구매안내 변수, `board_productlist_4/6`, `product_relation`

**주문 · 회원 · 게시판**
- [ ] `order/basket.html` — `Order_BasketPackage`, `Order_empty`, `Order_normnormal`, `Order_list`, `Order_totalsummary`, `Order_totalorder` 및 `{$action_*}` 이름
- [ ] `order/orderform.html` — 최상위 모듈명 및 기본 스킨 본문 병합
- [ ] `member/login.html` — `member_login` 의 `{$form.*}`, `{$action_func_login}`, SNS 로그인 onclick, 비회원 주문조회 모듈명
- [ ] `member/join.html` — `member_join` 필드명, 가입 실행 onclick
- [ ] `myshop/index.html` — `myshop_asyncbenefit`, `myshop_bankbook`, `myshop_orderstate` 및 카운트 변수
- [ ] `board/free/list.html` — 게시판 번호(5)와 `board_*_5` 모듈명, `{$hit_count}`, `{$write_url}`

---

## 7. 접근성 · 성능

- 본문 바로가기 링크, 모든 아이콘 버튼 `aria-label`, 슬라이더 일시정지 버튼, 탭 키보드 이동(←/→/Home/End)
- 드로어 열림 시 포커스 가두기 · Esc 닫기, 키보드 포커스 링(`:focus-visible`)
- `prefers-reduced-motion` 사용자에게는 자동 재생·애니메이션 최소화
- 이미지 `loading="lazy"`, 아이콘은 인라인 SVG 스프라이트(추가 요청 없음), 외부 라이브러리 없음

## 8. 브라우저 지원
최신 Chrome · Safari(iOS 15+) · Edge · Firefox · 삼성 인터넷. Internet Explorer 는 지원하지 않습니다.

## 9. 폰트 라이선스
- Pretendard — SIL Open Font License 1.1
- Cormorant Garamond — SIL Open Font License 1.1

웹폰트를 불러오지 못하는 환경에서는 시스템 폰트(Apple SD Gothic Neo, 맑은 고딕, Noto Sans KR / Georgia)로 자연스럽게 대체됩니다.
