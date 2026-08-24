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

const seoulRegions = [
  "강남구",
  "강동구",
  "강북구",
  "강서구",
  "관악구",
  "광진구",
  "구로구",
  "금천구",
  "노원구",
  "도봉구",
  "동대문구",
  "동작구",
  "마포구",
  "서대문구",
  "서초구",
  "성동구",
  "성북구",
  "송파구",
  "양천구",
  "영등포구",
  "용산구",
  "은평구",
  "종로구",
  "중구",
  "중랑구",
];

const gyeonggiRegions = [
  "가평군",
  "고양시",
  "과천시",
  "광명시",
  "광주시",
  "구리시",
  "군포시",
  "김포시",
  "남양주시",
  "동두천시",
  "부천시",
  "성남시",
  "수원시",
  "시흥시",
  "안산시",
  "안성시",
  "안양시",
  "양주시",
  "양평군",
  "여주시",
  "연천군",
  "오산시",
  "용인시",
  "의왕시",
  "의정부시",
  "이천시",
  "파주시",
  "평택시",
  "포천시",
  "하남시",
  "화성시",
];

const incheonRegions = [
  "계양구",
  "남동구",
  "동구",
  "미추홀구",
  "부평구",
  "서구",
  "연수구",
  "중구",
  "강화군",
  "옹진군",
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

          <a className="header-cta" href="tel:01022698352">
            무료 견적 신청
          </a>
        </div>
      </header>

      {/* HERO */}
      <section
        id="top"
        style={{
          position: "relative",
          minHeight: "760px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundImage: "url('/hero-demolition.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,.88), rgba(0,0,0,.60), rgba(0,0,0,.72))",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.12,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            paddingTop: "100px",
            paddingBottom: "100px",
          }}
        >
          <div style={{ maxWidth: "920px" }}>
            <p
              style={{
                marginBottom: "24px",
                color: "#ffd600",
                fontSize: "14px",
                fontWeight: 900,
                letterSpacing: "0.28em",
              }}
            >
              THE SAVE DEMOLITION
            </p>

            <h1
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "clamp(50px, 7vw, 92px)",
                lineHeight: 1.04,
                fontWeight: 900,
                letterSpacing: "-0.065em",
              }}
            >
              철거,
              <br />
              잘못 선택하면
              <br />
              <span style={{ color: "#ffd600" }}>비용부터 달라집니다.</span>
            </h1>

            <p
              style={{
                marginTop: "34px",
                maxWidth: "760px",
                color: "#f1f1f1",
                fontSize: "clamp(18px, 2vw, 24px)",
                lineHeight: 1.8,
                fontWeight: 600,
              }}
            >
              더세이브 철거는 서울·경기·인천 지역의 상가철거, 점포철거,
              매장철거, 폐업철거, 부분철거와 원상복구를 진행합니다.
            </p>

            <p
              style={{
                marginTop: "14px",
                color: "#bbbbbb",
                fontSize: "17px",
                lineHeight: 1.8,
                fontWeight: 600,
              }}
            >
              현장 조건과 철거 범위를 먼저 확인하고 무료방문견적을
              안내해드립니다.
            </p>

            <a
              href="tel:01022698352"
              style={{
                display: "inline-block",
                marginTop: "38px",
                color: "#ffffff",
                fontSize: "clamp(38px, 5vw, 66px)",
                lineHeight: 1,
                fontWeight: 900,
                letterSpacing: "-0.045em",
                textDecoration: "none",
              }}
            >
              ☎ 010-2269-8352
            </a>

            <div
              style={{
                marginTop: "34px",
                display: "flex",
                flexWrap: "wrap",
                gap: "14px",
              }}
            >
              <a
                href="tel:01022698352"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 32px",
                  background: "#ffd600",
                  color: "#000000",
                  fontSize: "17px",
                  fontWeight: 900,
                  textDecoration: "none",
                }}
              >
                무료방문견적 전화하기
                <span style={{ marginLeft: "18px" }}>→</span>
              </a>

              <a
                href="#region"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 32px",
                  border: "1px solid rgba(255,255,255,.4)",
                  background: "rgba(0,0,0,.35)",
                  color: "#ffffff",
                  fontSize: "17px",
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                지역별 철거 보기
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            borderTop: "1px solid rgba(255,255,255,.2)",
            background: "rgba(0,0,0,.52)",
          }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              paddingTop: "20px",
              paddingBottom: "20px",
              color: "#dddddd",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            <span>SEOUL · GYEONGGI · INCHEON</span>
            <span>상가철거 · 매장철거 · 폐업철거 · 원상복구</span>
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
              <strong>서울 · 경기 · 인천</strong>
              <p>
                서울, 경기, 인천 지역의 철거 정보를 확인하고 지역별 상담을
                요청할 수 있습니다.
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
      <section
        id="region"
        style={{
          background: "#080808",
          padding: "100px 0",
          color: "#ffffff",
        }}
      >
        <div className="container">
          <p
            style={{
              marginBottom: "18px",
              color: "#ffd600",
              fontSize: "13px",
              fontWeight: 900,
              letterSpacing: "0.25em",
            }}
          >
            REGIONAL SERVICE
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: "clamp(40px,5vw,68px)",
              lineHeight: 1.04,
              fontWeight: 900,
              letterSpacing: "-0.055em",
            }}
          >
            우리 지역 철거,
            <br />
            지역별로 확인하세요.
          </h2>

          <p
            style={{
              marginTop: "25px",
              color: "#aaaaaa",
              fontSize: "17px",
              lineHeight: 1.8,
            }}
          >
            서울 · 경기 · 인천을 선택하면 해당 지역의 시·구별 철거
            페이지를 확인할 수 있습니다.
          </p>

          <div
            style={{
              marginTop: "60px",
              borderTop: "1px solid #333333",
            }}
          >
            {/* 서울 */}
            <details>
              <summary
                style={{
                  cursor: "pointer",
                  listStyle: "none",
                  padding: "35px 10px",
                  borderBottom: "1px solid #333333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "clamp(28px,4vw,50px)",
                  fontWeight: 900,
                }}
              >
                <span>서울 철거</span>
                <span style={{ color: "#ffd600" }}>+</span>
              </summary>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(180px,1fr))",
                  gap: "1px",
                  background: "#333333",
                }}
              >
                {seoulRegions.map((region) => (
                  <a
                    key={region}
                    href={`/서울/${region}`}
                    style={{
                      minHeight: "130px",
                      padding: "24px",
                      background: "#111111",
                      color: "#ffffff",
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        color: "#777777",
                        fontSize: "12px",
                      }}
                    >
                      서울
                    </span>

                    <strong style={{ fontSize: "20px" }}>
                      {region} 철거업체
                    </strong>

                    <span style={{ color: "#ffd600" }}>→</span>
                  </a>
                ))}
              </div>
            </details>

            {/* 경기 */}
            <details>
              <summary
                style={{
                  cursor: "pointer",
                  listStyle: "none",
                  padding: "35px 10px",
                  borderBottom: "1px solid #333333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "clamp(28px,4vw,50px)",
                  fontWeight: 900,
                }}
              >
                <span>경기 철거</span>
                <span style={{ color: "#ffd600" }}>+</span>
              </summary>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(180px,1fr))",
                  gap: "1px",
                  background: "#333333",
                }}
              >
                {gyeonggiRegions.map((region) => (
                  <a
                    key={region}
                    href={`/경기/${region}`}
                    style={{
                      minHeight: "130px",
                      padding: "24px",
                      background: "#111111",
                      color: "#ffffff",
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        color: "#777777",
                        fontSize: "12px",
                      }}
                    >
                      경기
                    </span>

                    <strong style={{ fontSize: "20px" }}>
                      {region} 철거업체
                    </strong>

                    <span style={{ color: "#ffd600" }}>→</span>
                  </a>
                ))}
              </div>
            </details>

            {/* 인천 */}
            <details>
              <summary
                style={{
                  cursor: "pointer",
                  listStyle: "none",
                  padding: "35px 10px",
                  borderBottom: "1px solid #333333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "clamp(28px,4vw,50px)",
                  fontWeight: 900,
                }}
              >
                <span>인천 철거</span>
                <span style={{ color: "#ffd600" }}>+</span>
              </summary>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(180px,1fr))",
                  gap: "1px",
                  background: "#333333",
                }}
              >
                {incheonRegions.map((region) => (
                  <a
                    key={region}
                    href={`/인천/${region}`}
                    style={{
                      minHeight: "130px",
                      padding: "24px",
                      background: "#111111",
                      color: "#ffffff",
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        color: "#777777",
                        fontSize: "12px",
                      }}
                    >
                      인천
                    </span>

                    <strong style={{ fontSize: "20px" }}>
                      {region} 철거업체
                    </strong>

                    <span style={{ color: "#ffd600" }}>→</span>
                  </a>
                ))}
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div
            style={{
              minHeight: "580px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <p className="section-kicker">FREE ESTIMATE</p>

            <h2
              style={{
                marginTop: "20px",
                fontSize: "clamp(48px,7vw,92px)",
                lineHeight: 0.95,
                fontWeight: 900,
                letterSpacing: "-0.06em",
              }}
            >
              무료방문견적
            </h2>

            <p
              style={{
                marginTop: "28px",
                fontSize: "18px",
                fontWeight: 600,
                lineHeight: 1.8,
              }}
            >
              상가철거 · 매장철거 · 점포철거 · 폐업철거 · 원상복구
              <br />
              철거 상담이 필요하시면 편하게 전화주세요.
            </p>

            <a
              href="tel:01022698352"
              aria-label="010-2269-8352 무료 철거 견적 전화 상담"
              style={{
                display: "inline-block",
                marginTop: "38px",
                color: "#000000",
                fontSize: "clamp(42px,6vw,80px)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.05em",
                textDecoration: "none",
              }}
            >
              010-2269-8352
            </a>

            <a
              href="tel:01022698352"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "18px",
                marginTop: "32px",
                padding: "20px 40px",
                background: "#080808",
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: 900,
                textDecoration: "none",
              }}
            >
              전화 상담하기
              <span style={{ color: "#ffd600" }}>→</span>
            </a>

            <div className="contact-small" style={{ marginTop: "45px" }}>
              THE SAVE
              <br />
              DEMOLITION SERVICE
            </div>
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
              <a href="tel:01022698352">무료 견적</a>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              <p>서울 · 경기 · 인천 철거 전문 더세이브</p>
              <p>© THE SAVE. All rights reserved.</p>
            </div>

            <a href="#top">TOP ↑</a>
          </div>
        </div>
      </footer>

      {/* FLOATING PHONE BUTTON */}
      <a
        className="floating-contact"
        href="tel:01022698352"
        aria-label="무료 철거 견적 전화 상담"
      >
        <span>전화</span>
        <strong>견적</strong>
      </a>
    </main>
  );
}