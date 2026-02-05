import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CashAppLanding = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cards = [
    { name: "Glitter", gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6347 100%)" },
    { name: "Black", gradient: "linear-gradient(135deg, #1a1a1a 0%, #333 100%)" },
    { name: "Pink", gradient: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)" },
    { name: "White", gradient: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)" },
    { name: "Glow", gradient: "linear-gradient(135deg, #00D632 0%, #00ff88 50%, #00D632 100%)" },
    { name: "Mood", gradient: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const [activeFeature, setActiveFeature] = useState(0);
  const accessCashFeatures = [
    { title: "Get free overdraft coverage up to $200", icon: "shield" },
    { title: "Borrow up to $500 with no credit check", icon: "dollar" },
    { title: "Pay over time at top brands with Afterpay", icon: "clock" },
    { title: "Get your paycheck up to 2 days early", icon: "zap" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % accessCashFeatures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#000000",
      color: "#ffffff",
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      overflowX: "hidden",
    }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .nav-link:hover { color: #00D632 !important; }
        .cta-button:hover { transform: scale(1.02); background-color: #00bf2d !important; }
        .card-hover:hover { transform: translateY(-5px) rotate(-5deg) !important; }
        .feature-card:hover { border-color: #00D632 !important; }
        .social-icon:hover { color: #00D632 !important; }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-button { display: block !important; }
          .two-col-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .three-col-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .section-padding { padding: 60px 20px !important; }
          .hero-section { padding: 100px 20px 60px !important; min-height: auto !important; }
          .reverse-mobile { direction: rtl; }
          .reverse-mobile > * { direction: ltr; }
          .phone-mockup { height: 300px !important; }
          .savings-visual { height: 250px !important; }

          /* Reduce card stack width on mobile */
          .card-hover {
            width: 200px !important;
            height: 126px !important;
          }

          /* Cards container on mobile */
          .cards-container {
            min-height: 300px !important;
          }

          /* Smaller orb on mobile */
          .hero-orb {
            width: 150px !important;
            height: 150px !important;
            font-size: 32px !important;
          }

          /* Better button sizing on mobile */
          .cta-button {
            width: 100%;
            max-width: 300px;
            padding: 14px 24px !important;
            font-size: 14px !important;
            min-height: 44px;
          }

          /* Adjust feature cards for mobile */
          .feature-card {
            min-width: 100% !important;
            max-width: 100% !important;
            padding: 20px 24px !important;
          }

          /* Text alignment for mobile */
          .mobile-center { text-align: center !important; }

          /* Header adjustments for mobile */
          header > div {
            padding: 12px 16px !important;
          }

          /* Better mobile menu spacing */
          .mobile-menu {
            max-height: calc(100vh - 60px);
            overflow-y: auto;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-button { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#00D632"/>
              <path d="M20.5 10.5L17.5 10.5L18.5 8L14 8L11 16L14 16L11.5 24L21 14L17 14L20.5 10.5Z" fill="black"/>
            </svg>
          </div>

          {/* Nav Links - Desktop */}
          <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <Link to="/cashapp/dashboard" className="nav-link" style={{ color: "#888", fontSize: "14px", fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}>Dashboard</Link>
            <a href="#" className="nav-link" style={{ color: "#888", fontSize: "14px", fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}>Card</a>
            <a href="#" className="nav-link" style={{ color: "#888", fontSize: "14px", fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}>Send</a>
            <a href="#" className="nav-link" style={{ color: "#888", fontSize: "14px", fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}>Savings</a>
            <Link to="/cashapp/settings" className="nav-link" style={{ color: "#888", fontSize: "14px", fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}>Settings</Link>
          </nav>

           {/* Auth Buttons - Desktop */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link to="/cashapp/register" style={{ color: "#fff", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>Sign up</Link>
            <Link to="/cashapp/login" style={{ color: "#888", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>Log in</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "24px",
              cursor: "pointer",
              padding: "8px",
            }}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu" style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.98)",
            backdropFilter: "blur(20px)",
            padding: "24px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <Link to="/cashapp/dashboard" className="nav-link" style={{ color: "#888", fontSize: "16px", fontWeight: 500, textDecoration: "none", padding: "8px 0" }}>Dashboard</Link>
              <a href="#" className="nav-link" style={{ color: "#888", fontSize: "16px", fontWeight: 500, textDecoration: "none", padding: "8px 0" }}>Card</a>
              <a href="#" className="nav-link" style={{ color: "#888", fontSize: "16px", fontWeight: 500, textDecoration: "none", padding: "8px 0" }}>Send</a>
              <a href="#" className="nav-link" style={{ color: "#888", fontSize: "16px", fontWeight: 500, textDecoration: "none", padding: "8px 0" }}>Savings</a>
              <Link to="/cashapp/settings" className="nav-link" style={{ color: "#888", fontSize: "16px", fontWeight: 500, textDecoration: "none", padding: "8px 0" }}>Settings</Link>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", margin: "16px 0" }}/>
              <Link to="/cashapp/register" style={{ color: "#fff", fontSize: "16px", fontWeight: 500, textDecoration: "none", padding: "8px 0" }}>Sign up</Link>
              <Link to="/cashapp/login" style={{ color: "#888", fontSize: "16px", fontWeight: 500, textDecoration: "none", padding: "8px 0" }}>Log in</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section - Cash App Green */}
      <section className="hero-section" style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Animated Background */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(0,214,50,0.15) 0%, transparent 50%)",
        }}/>
        
        <div style={{
          maxWidth: "1000px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}>
          {/* Video/Animation placeholder - green glowing orb */}
          <div className="hero-orb" style={{
            width: "200px",
            height: "200px",
            margin: "0 auto 48px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00D632 0%, #00ff88 50%, #00D632 100%)",
            backgroundSize: "200% 200%",
            animation: "gradientShift 3s ease infinite",
            boxShadow: "0 0 80px rgba(0,214,50,0.5), 0 0 120px rgba(0,214,50,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ fontSize: "48px", fontWeight: 800, color: "#000" }}>3.25%</span>
          </div>

          <h1 style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "24px",
            animation: "fadeInUp 0.8s ease",
          }}>
            Earn, save, and do more with{" "}
            <span style={{ color: "#00D632" }}>Cash App Green</span>
          </h1>

          <p style={{
            fontSize: "clamp(16px, 2vw, 18px)",
            color: "#888",
            maxWidth: "700px",
            margin: "0 auto 40px",
            lineHeight: 1.6,
            animation: "fadeInUp 0.8s ease 0.1s both",
            padding: "0 20px",
          }}>
            It's easier than ever to earn our best benefits yet—higher Borrow limits, up to 3.25% savings interest, free overdraft coverage, and free withdrawals from 40k in-network ATMs.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", animation: "fadeInUp 0.8s ease 0.2s both", alignItems: "center" }}>
            <button className="cta-button" style={{
              padding: "16px 32px",
              backgroundColor: "#00D632",
              color: "#000",
              border: "none",
              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}>
              Learn about Green
            </button>
            <span style={{ color: "#666", fontSize: "12px", alignSelf: "center", textAlign: "center", width: "100%", maxWidth: "300px" }}>*See legal disclaimers</span>
          </div>
        </div>
      </section>

      {/* Cash App Card Section */}
      <section className="section-padding" style={{
        padding: "120px 24px",
        backgroundColor: "#0a0a0a",
      }}>
        <div className="two-col-grid" style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
        }}>
          {/* Cards Display */}
          <div className="cards-container" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            position: "relative",
          }}>
            {cards.map((card, index) => (
              <div
                key={card.name}
                className="card-hover"
                style={{
                  position: "absolute",
                  width: "280px",
                  height: "176px",
                  borderRadius: "16px",
                  background: card.gradient,
                  transform: `translateX(${(index - currentCardIndex) * 30}px) rotate(-5deg) scale(${index === currentCardIndex ? 1 : 0.9})`,
                  opacity: Math.abs(index - currentCardIndex) > 2 ? 0 : 1 - Math.abs(index - currentCardIndex) * 0.3,
                  transition: "all 0.5s ease",
                  zIndex: cards.length - Math.abs(index - currentCardIndex),
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                  animation: index === currentCardIndex ? "cardFloat 3s ease infinite" : "none",
                }}>
                {/* Card chip */}
                <div style={{
                  position: "absolute",
                  top: "24px",
                  left: "24px",
                  width: "40px",
                  height: "30px",
                  borderRadius: "4px",
                  background: "linear-gradient(135deg, #c9b037 0%, #a89b2e 100%)",
                }}/>
                {/* Cash App logo on card */}
                <div style={{
                  position: "absolute",
                  bottom: "24px",
                  right: "24px",
                }}>
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                    <path d="M20.5 10.5L17.5 10.5L18.5 8L14 8L11 16L14 16L11.5 24L21 14L17 14L20.5 10.5Z" fill={card.name === "White" ? "#000" : "#fff"} fillOpacity="0.8"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Content */}
          <div>
            <h2 style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "32px",
            }}>
              Cash App Card is the debit card that works for you
            </h2>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                "No hidden or monthly fees ever",
                "Weekly custom cash back offers",
                "Real-time transaction alerts",
                "Card designs you can fully personalize"
              ].map((item, i) => (
                <li key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                  fontSize: "16px",
                  color: "#ccc",
                }}>
                  <span style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#00D632",
                    flexShrink: 0,
                  }}/>
                  {item}
                </li>
              ))}
            </ul>

            <button className="cta-button" style={{
              marginTop: "32px",
              padding: "16px 32px",
              backgroundColor: "#00D632",
              color: "#000",
              border: "none",
              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}>
              Meet Cash App Card
            </button>
          </div>
        </div>
      </section>

      {/* Access Cash Section */}
      <section className="section-padding" style={{
        padding: "120px 24px",
        backgroundColor: "#000",
      }}>
        <div style={{
          maxWidth: "1000px",
          margin: "0 auto",
          textAlign: "center",
        }}>
          <h2 style={{
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 700,
            marginBottom: "16px",
          }}>
            Access cash when you need it
          </h2>
          <p style={{
            fontSize: "18px",
            color: "#888",
            marginBottom: "60px",
          }}>
            Explore our flexible ways to bridge the gap between payday and bill pay.
          </p>

          {/* Feature Carousel */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "40px",
          }}>
            {accessCashFeatures.map((feature, index) => (
              <div
                key={index}
                onClick={() => setActiveFeature(index)}
                className="feature-card"
                style={{
                  padding: "24px 32px",
                  backgroundColor: index === activeFeature ? "rgba(0,214,50,0.1)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${index === activeFeature ? "#00D632" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "16px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  flex: "1",
                  minWidth: "200px",
                  maxWidth: "280px",
                }}>
                <p style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: index === activeFeature ? "#fff" : "#888",
                  margin: 0,
                }}>
                  {feature.title}
                </p>
              </div>
            ))}
          </div>

          <button className="cta-button" style={{
            padding: "16px 32px",
            backgroundColor: "#00D632",
            color: "#000",
            border: "none",
            borderRadius: "30px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}>
            Learn more
          </button>

          <p style={{ color: "#666", fontSize: "12px", marginTop: "16px" }}>*See legal disclaimers</p>
        </div>
      </section>

      {/* What's New Section */}
      <section className="section-padding" style={{
        padding: "120px 24px",
        backgroundColor: "#0a0a0a",
      }}>
        <div className="two-col-grid" style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
        }}>
          {/* Animation placeholder */}
          <div className="phone-mockup" style={{
            height: "500px",
            borderRadius: "24px",
            background: "linear-gradient(180deg, rgba(0,214,50,0.2) 0%, rgba(0,0,0,0) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              width: "200px",
              height: "400px",
              backgroundColor: "#111",
              borderRadius: "40px",
              border: "3px solid #333",
              position: "relative",
              boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
            }}>
              {/* Phone notch */}
              <div style={{
                position: "absolute",
                top: "12px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                height: "24px",
                backgroundColor: "#000",
                borderRadius: "12px",
              }}/>
              {/* Screen content */}
              <div style={{
                position: "absolute",
                top: "50px",
                left: "10px",
                right: "10px",
                bottom: "20px",
                backgroundColor: "#000",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
              }}>
                <div style={{ color: "#00D632", fontSize: "24px", fontWeight: 700 }}>$1,234.56</div>
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "#00D632",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "24px",
            }}>
              See what's new on Cash App
            </h2>
            <p style={{
              fontSize: "18px",
              color: "#888",
              lineHeight: 1.6,
              marginBottom: "32px",
            }}>
              Sending money was just the beginning. We're building new ways for you to pay, get rewarded, and easily manage or grow your cash on your terms.
            </p>
            <button className="cta-button" style={{
              padding: "16px 32px",
              backgroundColor: "#00D632",
              color: "#000",
              border: "none",
              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}>
              See what's new
            </button>
          </div>
        </div>
      </section>

      {/* Savings Section */}
      <section className="section-padding" style={{
        padding: "120px 24px",
        backgroundColor: "#000",
      }}>
        <div className="two-col-grid" style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
        }}>
          {/* Content */}
          <div>
            <h2 style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "24px",
            }}>
              Make your money go even further
            </h2>
            <p style={{
              fontSize: "18px",
              color: "#888",
              lineHeight: 1.6,
              marginBottom: "32px",
            }}>
              We make it easy to save and grow your money with up to 3.25% interest, automatic savings tools, and the ability to turn spare change into stocks or bitcoin.
            </p>
            <button className="cta-button" style={{
              padding: "16px 32px",
              backgroundColor: "#00D632",
              color: "#000",
              border: "none",
              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}>
              Learn how to save and grow
            </button>
          </div>

          {/* Savings visual */}
          <div className="savings-visual" style={{
            height: "400px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, rgba(0,214,50,0.1) 0%, rgba(0,0,0,0) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}>
            <div style={{
              textAlign: "center",
            }}>
              <div style={{
                fontSize: "clamp(48px, 10vw, 80px)",
                fontWeight: 800,
                color: "#00D632",
                textShadow: "0 0 40px rgba(0,214,50,0.5)",
              }}>
                3.25%
              </div>
              <div style={{ color: "#888", fontSize: "clamp(16px, 2vw, 18px)", marginTop: "8px" }}>APY savings interest</div>
            </div>
          </div>
        </div>
      </section>

      {/* Send Money Section */}
      <section className="section-padding" style={{
        padding: "120px 24px",
        backgroundColor: "#0a0a0a",
      }}>
        <div className="two-col-grid reverse-mobile" style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
        }}>
          {/* Visual */}
          <div style={{
            height: "400px",
            borderRadius: "24px",
            background: "linear-gradient(180deg, rgba(0,214,50,0.15) 0%, transparent 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
            }}>
              {/* User avatars with send animation */}
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
              }}>👤</div>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}>
                <div style={{ width: "40px", height: "4px", backgroundColor: "#00D632", borderRadius: "2px" }}/>
                <div style={{ width: "40px", height: "4px", backgroundColor: "#00D632", borderRadius: "2px", opacity: 0.7 }}/>
                <div style={{ width: "40px", height: "4px", backgroundColor: "#00D632", borderRadius: "2px", opacity: 0.4 }}/>
              </div>
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#00D632",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
              }}>💰</div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "32px",
            }}>
              Sending money is fast, free, and made for you
            </h2>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                "Personalize payments with stickers and text",
                "Collect money from a group with pools",
                "Sync your contacts to pay friends easily",
                "Send money confidently with Security Lock"
              ].map((item, i) => (
                <li key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                  fontSize: "16px",
                  color: "#ccc",
                }}>
                  <span style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#00D632",
                    flexShrink: 0,
                  }}/>
                  {item}
                </li>
              ))}
            </ul>

            <button className="cta-button" style={{
              marginTop: "32px",
              padding: "16px 32px",
              backgroundColor: "#00D632",
              color: "#000",
              border: "none",
              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}>
              Send money
            </button>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="section-padding" style={{
        padding: "120px 24px",
        backgroundColor: "#000",
      }}>
        <div className="two-col-grid" style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
        }}>
          {/* Content */}
          <div>
            <h2 style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "24px",
            }}>
              Security built into every swipe, tap, and send
            </h2>
            <p style={{
              fontSize: "18px",
              color: "#888",
              lineHeight: 1.6,
              marginBottom: "32px",
            }}>
              Since 2020, we've prevented $2 billion+ in scams—while protecting what matters with real-time monitoring, Zero Fraud Liability, and FDIC insurance, subject to terms.
            </p>
            <button className="cta-button" style={{
              padding: "16px 32px",
              backgroundColor: "#00D632",
              color: "#000",
              border: "none",
              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}>
              Learn about security
            </button>
          </div>

          {/* Security visual */}
          <div style={{
            height: "400px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, rgba(0,214,50,0.1) 0%, transparent 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: "#00D632",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 60px rgba(0,214,50,0.4)",
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v6c0 5.25 3.82 10.17 9 11.38 5.18-1.21 9-6.13 9-11.38V7l-9-5z" fill="#000"/>
                <path d="M10 12l2 2 4-4" stroke="#00D632" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="section-padding" style={{
        padding: "120px 24px",
        backgroundColor: "#0a0a0a",
        textAlign: "center",
      }}>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 700,
            marginBottom: "48px",
          }}>
            The money app <span style={{ color: "#00D632" }}>57 million+</span> people trust
          </h2>

          <blockquote style={{
            fontSize: "clamp(18px, 3vw, 24px)",
            fontStyle: "italic",
            color: "#ccc",
            marginBottom: "48px",
            lineHeight: 1.5,
            padding: "0 20px",
          }}>
            "Cash App makes it so easy to manage everything—I use it for saving, splitting bills, and getting paid. It's all-in-one."
          </blockquote>

          <button className="cta-button" style={{
            padding: "16px 32px",
            backgroundColor: "#00D632",
            color: "#000",
            border: "none",
            borderRadius: "30px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}>
            Read reviews
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding" style={{
        padding: "80px 24px",
        backgroundColor: "#000",
      }}>
        <div style={{
          maxWidth: "1000px",
          margin: "0 auto",
          textAlign: "center",
        }}>
          <h3 style={{
            fontSize: "24px",
            fontWeight: 600,
            marginBottom: "48px",
            color: "#888",
          }}>
            Cash App makes money simple
          </h3>

          <div className="three-col-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "48px",
          }}>
            <div>
              <div style={{ fontSize: "clamp(36px, 5vw, 48px)", fontWeight: 700, color: "#00D632" }}>5★</div>
              <div style={{ color: "#888", fontSize: "14px", marginTop: "8px" }}>Editor's Choice on the App Store</div>
            </div>
            <div>
              <div style={{ fontSize: "clamp(36px, 5vw, 48px)", fontWeight: 700, color: "#00D632" }}>9.9m+</div>
              <div style={{ color: "#888", fontSize: "14px", marginTop: "8px" }}>Apple App Store and Google Play reviews</div>
            </div>
            <div>
              <div style={{ fontSize: "clamp(36px, 5vw, 48px)", fontWeight: 700, color: "#00D632" }}>4.5★</div>
              <div style={{ color: "#888", fontSize: "14px", marginTop: "8px" }}>Rated Excellent on Trustpilot</div>
            </div>
          </div>
        </div>
      </section>

       {/* CTA Section */}
      <section className="section-padding" style={{
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <Link to="/cashapp/register" className="cta-button" style={{
          padding: "20px 48px",
          backgroundColor: "#00D632",
          color: "#000",
          border: "none",
          borderRadius: "30px",
          fontSize: "18px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          textDecoration: "none",
        }}>
          Sign up now
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "60px 24px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}>
          {/* Contact & Social */}
          <div className="three-col-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "48px",
            marginBottom: "48px",
          }}>
            <div className="mobile-center">
              <a href="tel:18009691940" style={{ color: "#fff", textDecoration: "none", fontSize: "18px", fontWeight: 600 }}>
                1 (800) 969-1940
              </a>
              <div style={{ color: "#888", fontSize: "14px", marginTop: "8px" }}>
                Available daily<br/>8AM to 9:30PM ET
              </div>
            </div>

            <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
              {["X", "IG", "TW", "TT"].map((social) => (
                <a key={social} href="#" className="social-icon" style={{
                  color: "#888",
                  fontSize: "14px",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}>
                  {social}
                </a>
              ))}
            </div>

            <div className="mobile-center" style={{ textAlign: "right" }}>
              <a href="#" style={{ color: "#fff", textDecoration: "none", fontSize: "18px", fontWeight: 600 }}>
                Chat with us
              </a>
              <div style={{ color: "#888", fontSize: "14px", marginTop: "8px" }}>
                Available 24/7 in<br/>your mobile app
              </div>
            </div>
          </div>

          {/* Links */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap",
            marginBottom: "48px",
          }}>
            {["Careers", "Press", "Help", "Status", "Legal", "Licenses", "Privacy Notice", "Your Privacy Choices"].map((link) => (
              <a key={link} href="#" className="nav-link" style={{
                color: "#888",
                fontSize: "14px",
                textDecoration: "none",
                transition: "color 0.2s",
              }}>
                {link}
              </a>
            ))}
          </div>

          {/* Legal Text */}
          <div style={{
            color: "#666",
            fontSize: "11px",
            lineHeight: 1.6,
            textAlign: "center",
            maxWidth: "900px",
            margin: "0 auto",
          }}>
            <p style={{ marginBottom: "16px" }}>
              Cash App is a financial services platform, and not an FDIC-insured bank. Prepaid debit cards issued by Sutton Bank, Member FDIC. Cash App Visa® Debit Flex Cards issued by Sutton Bank, Member FDIC, and The Bancorp Bank, N.A., pursuant to a license from Visa U.S.A. Inc.
            </p>
            <p style={{ marginBottom: "16px" }}>
              Brokerage services by Cash App Investing LLC, member FINRA/SIPC, and a subsidiary of Block, Inc.
            </p>
            <a href="#" style={{
              display: "inline-block",
              marginTop: "24px",
              padding: "12px 24px",
              backgroundColor: "#00D632",
              color: "#000",
              borderRadius: "20px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}>
              Download Cash App
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CashAppLanding;
