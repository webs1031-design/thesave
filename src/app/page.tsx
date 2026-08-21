const services = [
  {
    number: "01",
    title: "상가 철거",
    description:
      "음식점, 카페, 학원, 병원, 사무실 등 업종과 현장 구조에 맞춰 철거 범위를 확인하고 작업을 진행합니다.",
    tags: ["상가철거", "매장철거", "점포철거"],
  },
  {
    number: "02",
    title: "폐업 철거",
    description:
      "폐업 일정과 임대차 조건을 고려하여 필요한 철거 범위와 원상복구 항목을 확인합니다.",
    tags: ["폐업철거", "철거견적", "원상복구"],
  },
  {
    number: "03",
    title: "부분 철거",
    description:
      "전체 철거가 아닌 천장, 바닥, 벽체, 가벽, 집기 등 필요한 부분만 선택적으로 철거합니다.",
    tags: ["부분철거", "내부철거", "인테리어철거"],
  },
  {
    number: "04",
    title: "원상복구",
    description:
      "임대차 계약 조건과 현장 상태를 확인한 뒤 필요한 철거 및 원상복구 공정을 안내합니다.",
    tags: ["상가원상복구", "사무실원상복구", "매장원상복구"],
  },
];

const process = [
  {
    step: "01",
    title: "상담 접수",
    description:
      "현장 지역, 업종, 평수와 필요한 철거 내용을 알려주세요.",
  },
  {
    step: "02",
    title: "현장 확인",
    description:
      "철거 범위와 폐기물, 장비 진입 여부 등 현장 조건을 확인합니다.",
  },
  {
    step: "03",
    title: "견적 안내",
    description:
      "확인된 작업 범위를 기준으로 철거 비용과 진행 일정을 안내합니다.",
  },
  {
    step: "04",
    title: "철거 진행",
    description:
      "안전 기준에 맞춰 철거부터 폐기물 정리, 원상복구까지 진행합니다.",
  },
];

const regions = [
  "서울",
  "인천",
  "수원",
  "성남",
  "용인",
  "화성",
  "평택",
  "천안",
  "아산",
  "청주",
  "대전",
  "세종",
];

export default function Home() {
  return (
    <main>
      {/* HEADER */}
      <header className="site-header">
        <div className="container header-inner">
          <a className="logo" href="#top" aria-label="더세이브 철거 홈">
            <span className="logo-mark">THE</span>
            <span className="logo-text">SAVE</span>
            <span className="logo-sub">DEMOLITION</span>
          </a>

          <nav className="desktop-nav" aria-label="주요 메뉴">
            <a href="#service">철거 서비스</a>
            <a href="#why">더세이브</a>
            <a href="#process">진행 절차</a>
            <a href="#region">지역 철거</a>
          </nav>

          <a className="header-cta" href="#contact">
            무료 견적 신청
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="hero-grid" />

        <div className="container hero-inner">
          <div className="hero-content">
            <p className="eyebrow">
              <span className="eyebrow-dot" />
              THE SAVE DEMOLITION
            </p>

            <h1>
              복잡한 철거,
              <br />
              <span>더세이브가</span>
              <br />
              제대로 시작합니다.
            </h1>

            <p className="hero-description">
              상가철거부터 폐업철거, 부분철거, 원상복구까지.
              <br className="desktop-only" />
              현장 상황에 필요한 철거 범위를 확인하고 합리적인 방향을
              안내합니다.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#contact">
                무료 견적 받아보기
                <span>→</span>
              </a>

              <a className="button button-outline" href="#service">
                서비스 알아보기
              </a>
            </div>

            <div className="hero-points">
              <div>
                <strong>전국</strong>
                <span>지역 상담</span>
              </div>
              <div>
                <strong>1:1</strong>
                <span>현장 맞춤 상담</span>
              </div>
              <div>
                <strong>ONE-STOP</strong>
                <span>철거 · 원상복구</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-number">01</div>

            <div className="hero-visual-card">
              <span>DEMOLITION</span>
              <strong>
                철거의 시작부터
                <br />
                마무리까지.
              </strong>
              <div className="yellow-line" />
            </div>

            <div className="hero-circle hero-circle-one" />
            <div className="hero-circle hero-circle-two" />

            <div className="hero-label">
              <span>THE SAVE</span>
              <span>2026</span>
            </div>
          </div>
        </div>

        <div className="hero-bottom-bar">
          <div className="container hero-bottom-inner">
            <span>SCROLL TO EXPLORE</span>
            <div />
            <span>상가 · 폐업 · 부분 · 원상복구</span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="section intro-section">
        <div className="container">
          <div className="intro-heading">
            <div>
              <p className="section-kicker">THE SAVE STANDARD</p>
              <h2>
                철거는 단순히
                <br />
                부수는 일이 아닙니다.
              </h2>
            </div>

            <div className="intro-copy">
              <p>
                같은 평수의 매장이라도 천장 구조, 바닥 상태, 폐기물 양,
                장비 진입 여부에 따라 철거 방식과 비용은 달라집니다.
              </p>
              <p>
                더세이브는 현장의 조건을 먼저 확인하고 필요한 작업 범위를
                기준으로 철거 방향을 안내합니다.
              </p>
            </div>
          </div>

          <div className="trust-grid">
            <article className="trust-card trust-card-dark">
              <span>01</span>
              <strong>현장 중심 견적</strong>
              <p>
                단순 평수만으로 판단하지 않고 현장 조건과 실제 작업 범위를
                기준으로 확인합니다.
              </p>
            </article>

            <article className="trust-card">
              <span>02</span>
              <strong>철거부터 원상복구까지</strong>
              <p>
                철거 이후 필요한 정리 및 원상복구까지 한 번에 상담할 수
                있습니다.
              </p>
            </article>

            <article className="trust-card trust-card-yellow">
              <span>03</span>
              <strong>지역별 상담</strong>
              <p>
                전국 주요 지역의 철거 정보를 확인하고 지역별 상담을 요청할
                수 있습니다.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* SERVICE */}
      <section className="section dark-section" id="service">
        <div className="container">
          <div className="section-title-row">
            <div>
              <p className="section-kicker yellow-text">SERVICE</p>
              <h2>
                필요한 철거만
                <br />
                정확하게.
              </h2>
            </div>

            <p className="section-description">
              업종과 공간에 따라 철거 범위는 달라집니다.
              <br />
              더세이브는 현장별 필요한 작업을 확인합니다.
            </p>
          </div>

          <div className="service-list">
            {services.map((service) => (
              <article className="service-item" key={service.number}>
                <span className="service-number">{service.number}</span>

                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <div className="service-tags">
                  {service.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <span className="service-arrow">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="section why-section" id="why">
        <div className="container">
          <p className="section-kicker">WHY THE SAVE</p>

          <div className="why-title">
            <h2>
              견적보다 먼저
              <br />
              <span>확인해야 할 것.</span>
            </h2>

            <p>
              철거 비용은 현장마다 다릅니다.
              <br />
              중요한 것은 어떤 항목이 견적에 포함되어 있는지입니다.
            </p>
          </div>

          <div className="why-grid">
            <div className="why-main-card">
              <div className="why-card-number">01</div>

              <div>
                <p className="why-label">CHECK THE SITE</p>
                <h3>
                  작업 전
                  <br />
                  현장 조건 확인
                </h3>
              </div>

              <div className="why-symbol">+</div>
            </div>

            <div className="why-side">
              <article>
                <span>02</span>
                <h3>철거 범위 확인</h3>
                <p>
                  천장, 벽체, 바닥, 집기 등 실제 철거가 필요한 항목을
                  구분합니다.
                </p>
              </article>

              <article>
                <span>03</span>
                <h3>폐기물 확인</h3>
                <p>
                  폐기물 종류와 예상 물량, 반출 동선에 따라 필요한 작업을
                  확인합니다.
                </p>
              </article>

              <article>
                <span>04</span>
                <h3>원상복구 범위 확인</h3>
                <p>
                  임대인 요구사항과 계약 내용을 기준으로 복구 범위를
                  확인합니다.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section process-section" id="process">
        <div className="container">
          <div className="section-title-row">
            <div>
              <p className="section-kicker">PROCESS</p>
              <h2>
                상담부터 철거까지
                <br />
                어렵지 않게.
              </h2>
            </div>

            <p className="section-description dark-description">
              철거가 처음이어도 괜찮습니다.
              <br />
              필요한 내용을 순서대로 확인해드립니다.
            </p>
          </div>

          <div className="process-grid">
            {process.map((item) => (
              <article className="process-card" key={item.step}>
                <div className="process-top">
                  <span>STEP</span>
                  <strong>{item.step}</strong>
                </div>

                <div className="process-icon">
                  <span>{item.step}</span>
                </div>

                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* REGION */}
      <section className="section region-section" id="region">
        <div className="container">
          <div className="region-header">
            <div>
              <p className="section-kicker yellow-text">REGIONAL SERVICE</p>
              <h2>
                우리 지역 철거,
                <br />
                지역별로 확인하세요.
              </h2>
            </div>

            <p>
              지역별 철거 정보 페이지를 순차적으로 제공합니다.
              <br />
              원하는 지역의 철거 정보를 확인해보세요.
            </p>
          </div>

          <div className="region-grid">
            {regions.map((region) => (
              <a href="#contact" className="region-link" key={region}>
                <span>{region}</span>
                <strong>{region} 철거</strong>
                <span className="region-arrow">→</span>
              </a>
            ))}
          </div>

          <p className="region-notice">
            * 지역별 상세 페이지는 이후 SEO 구조에 맞춰 연결됩니다.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <div className="container contact-grid">
          <div className="contact-copy">
            <p className="section-kicker">FREE ESTIMATE</p>

            <h2>
              철거 견적,
              <br />
              어렵게 알아보지 마세요.
            </h2>

            <p>
              지역과 업종, 예상 평수 정도만 알려주셔도
              <br />
              상담을 시작할 수 있습니다.
            </p>

            <div className="contact-small">
              THE SAVE
              <br />
              DEMOLITION SERVICE
            </div>
          </div>

          <div className="estimate-card">
            <div className="estimate-title">
              <span>무료 견적 상담</span>
              <strong>01</strong>
            </div>

            <div className="form-row">
              <label htmlFor="name">이름</label>
              <input id="name" type="text" placeholder="성함을 입력해주세요" />
            </div>

            <div className="form-row">
              <label htmlFor="phone">연락처</label>
              <input
                id="phone"
                type="tel"
                placeholder="연락처를 입력해주세요"
              />
            </div>

            <div className="form-row">
              <label htmlFor="region-input">철거 지역</label>
              <input
                id="region-input"
                type="text"
                placeholder="예: 천안시 서북구"
              />
            </div>

            <div className="form-row">
              <label htmlFor="business">업종 / 공간</label>
              <input
                id="business"
                type="text"
                placeholder="예: 음식점 / 약 30평"
              />
            </div>

            <button className="submit-button" type="button">
              무료 견적 신청하기
              <span>→</span>
            </button>

            <p className="form-notice">
              상담 접수 기능은 Supabase 연결 후 활성화됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-logo">
              <strong>THE SAVE</strong>
              <span>DEMOLITION</span>
            </div>

            <div className="footer-links">
              <a href="#service">철거 서비스</a>
              <a href="#process">진행 절차</a>
              <a href="#region">지역 철거 정보</a>
              <a href="#contact">무료 견적</a>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              <p>
                사업자 정보 · 주소 · 고객센터 정보는 실제 정보 확인 후
                입력합니다.
              </p>
              <p>© THE SAVE. All rights reserved.</p>
            </div>

            <a href="#top">TOP ↑</a>
          </div>
        </div>
      </footer>

      <a className="floating-contact" href="#contact">
        <span>무료</span>
        <strong>견적</strong>
      </a>
    </main>
  );
}