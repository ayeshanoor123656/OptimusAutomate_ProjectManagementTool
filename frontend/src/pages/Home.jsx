import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🗂️",
      title: "Kanban Boards",
      desc: "Visualise work across To Do, In Progress, and Done columns. Drag tasks between stages in one gesture.",
    },
    {
      icon: "👥",
      title: "Team Assignment",
      desc: "Assign any task to any team member instantly. Everyone sees exactly what they own.",
    },
    {
      icon: "💬",
      title: "Inline Comments",
      desc: "Leave notes directly on tasks — no external chat needed. Context lives where the work lives.",
    },
    {
      icon: "📊",
      title: "Live Stats",
      desc: "Dashboard counters update in real time. Know your completion rate at a glance.",
    },
    {
      icon: "📅",
      title: "Due Dates",
      desc: "Set deadlines on every task so nothing slips through the cracks.",
    },
    {
      icon: "⚡",
      title: "Fast & Lightweight",
      desc: "Built with React and FastAPI — snappy responses, no bloat.",
    },
  ];

  const steps = [
    { n: "01", title: "Create a board", desc: "Group your project work into a dedicated board in seconds." },
    { n: "02", title: "Add tasks",       desc: "Break work down into tasks, assign them, and set due dates." },
    { n: "03", title: "Track progress",  desc: "Drag tasks across columns as work moves forward." },
  ];

  return (
    <div style={{ fontFamily: "var(--font-ui)", background: "var(--canvas)", minHeight: "100vh", color: "var(--navy)" }}>

      {/* ── Nav ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 60px",
        background: "var(--white)",
        borderBottom: "1px solid var(--slate-200)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg, var(--indigo), var(--indigo-dark))",
            borderRadius: "var(--radius-md)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
            boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
          }}>⚡</div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, letterSpacing: "-0.4px" }}>
            TaskFlow
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "9px 20px", background: "transparent",
              border: "1.5px solid var(--slate-200)", borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-ui)", fontSize: 13.5, fontWeight: 600,
              color: "var(--navy-700)", cursor: "pointer",
              transition: "all 160ms",
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = "var(--indigo)"}
            onMouseOut={e => e.currentTarget.style.borderColor = "var(--slate-200)"}
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="btn-primary"
            style={{ padding: "9px 20px" }}
          >
            Get started free
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(160deg, var(--navy) 0%, #1e1b4b 60%, #0f172a 100%)",
        padding: "100px 60px 90px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background glow blobs */}
        <div style={{
          position: "absolute", width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
          top: -200, left: "50%", transform: "translateX(-50%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)",
          bottom: -150, right: 60, pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 20, padding: "5px 14px",
            fontSize: 12.5, fontWeight: 600, color: "#a5b4fc",
            marginBottom: 28, letterSpacing: 0.5,
          }}>
            ✦ Simple project management for teams
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            marginBottom: 24,
          }}>
            Ship projects faster<br />
            <span style={{ color: "#818cf8" }}>with your whole team</span>
          </h1>

          <p style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "#94a3b8",
            lineHeight: 1.65,
            marginBottom: 40,
            maxWidth: 540,
            margin: "0 auto 40px",
          }}>
            TaskFlow gives every team a Kanban board, task assignments, comments, and live stats — all in one clean workspace.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/register")}
              className="btn-primary"
              style={{ padding: "14px 32px", fontSize: 15, borderRadius: 10 }}
            >
              Start for free →
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "14px 32px", fontSize: 15, fontWeight: 600,
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(255,255,255,0.15)",
                borderRadius: 10, color: "white", cursor: "pointer",
                fontFamily: "var(--font-ui)",
                transition: "all 160ms",
              }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
            >
              Sign in
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{
        background: "var(--white)",
        borderBottom: "1px solid var(--slate-200)",
        padding: "28px 60px",
        display: "flex",
        justifyContent: "center",
        gap: "60px",
        flexWrap: "wrap",
      }}>
        {[
          { value: "100%", label: "Free to use" },
          { value: "3",    label: "Kanban columns" },
          { value: "∞",    label: "Boards & tasks" },
          { value: "⚡",    label: "FastAPI backend" },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: 28, fontWeight: 800,
              color: "var(--indigo)", letterSpacing: "-1px",
            }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--navy-600)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "80px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: "var(--indigo)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>
            Everything you need
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 800, letterSpacing: "-1px",
            color: "var(--navy)",
          }}>
            Built for real teams
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              background: "var(--white)",
              border: "1px solid var(--slate-200)",
              borderRadius: "var(--radius-lg)",
              padding: "26px 24px",
              boxShadow: "var(--shadow-card)",
              transition: "all 160ms",
            }}
              onMouseOver={e => {
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.boxShadow = "var(--shadow-card)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: 44, height: 44,
                background: "var(--indigo-soft)",
                borderRadius: "var(--radius-md)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, marginBottom: 14,
              }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "var(--navy-600)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{
        background: "var(--navy)",
        padding: "80px 60px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: "#818cf8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>
            How it works
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 4vw, 38px)",
            fontWeight: 800, letterSpacing: "-1px",
            color: "white", marginBottom: 52,
          }}>
            Up and running in minutes
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 28 }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 42, fontWeight: 800,
                  color: "rgba(129,140,248,0.25)",
                  lineHeight: 1, marginBottom: 14,
                }}>{s.n}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, color: "#94a3b8", lineHeight: 1.6 }}>{s.desc}</p>
                {i < steps.length - 1 && (
                  <div style={{ marginTop: 20, color: "rgba(129,140,248,0.4)", fontSize: 22 }}>↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: "80px 60px",
        textAlign: "center",
        background: "var(--indigo-soft)",
        borderTop: "1px solid rgba(99,102,241,0.15)",
      }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 4vw, 40px)",
          fontWeight: 800, letterSpacing: "-1px",
          color: "var(--navy)", marginBottom: 14,
        }}>
          Ready to get organised?
        </h2>
        <p style={{ fontSize: 15, color: "var(--navy-600)", marginBottom: 36 }}>
          Create your account and your first board in under a minute.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="btn-primary"
          style={{ padding: "14px 36px", fontSize: 15, borderRadius: 10 }}
        >
          Create free account →
        </button>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: "var(--navy)",
        padding: "24px 60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>⚡</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "white", fontSize: 15 }}>TaskFlow</span>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--slate-400)" }}>
          Built with React + FastAPI
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          <span
            onClick={() => navigate("/login")}
            style={{ fontSize: 13, color: "var(--slate-400)", cursor: "pointer", transition: "color 160ms" }}
            onMouseOver={e => e.currentTarget.style.color = "white"}
            onMouseOut={e => e.currentTarget.style.color = "var(--slate-400)"}
          >Sign in</span>
          <span
            onClick={() => navigate("/register")}
            style={{ fontSize: 13, color: "var(--slate-400)", cursor: "pointer", transition: "color 160ms" }}
            onMouseOver={e => e.currentTarget.style.color = "white"}
            onMouseOut={e => e.currentTarget.style.color = "var(--slate-400)"}
          >Register</span>
        </div>
      </footer>

    </div>
  );
}

export default Home;