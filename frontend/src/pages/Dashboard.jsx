import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ── Inline style tokens ── */
const T = {
  navy:        "#0F172A",
  navy800:     "#1E293B",
  navy700:     "#334155",
  navy600:     "#475569",
  slate400:    "#94A3B8",
  slate200:    "#E2E8F0",
  slate100:    "#F1F5F9",
  canvas:      "#F8FAFC",
  white:       "#FFFFFF",
  indigo:      "#6366F1",
  indigoDark:  "#4F46E5",
  indigoSoft:  "#EEF2FF",
  emerald:     "#10B981",
  emeraldSoft: "#D1FAE5",
  amber:       "#F59E0B",
  amberSoft:   "#FEF3C7",
  rose:        "#F43F5E",
  roseSoft:    "#FFE4E6",
};

function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";

  const [boards, setBoards]       = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [boardName, setBoardName] = useState("");
  // Step 1: new states
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [generatedInviteCode, setGeneratedInviteCode] = useState("");
  const [stats, setStats] = useState({
    totalBoards: 0, totalTasks: 0, completedTasks: 0, pendingTasks: 0,
  });

  useEffect(() => { fetchBoards(); fetchStats(); }, []);

  const fetchBoards = async () => {
    try {
      const res = await axios.get("https://optimusautomate-projectmanagementtool.onrender.com/boards");
      setBoards(res.data);
    } catch (e) { console.log(e); }
  };

  const fetchStats = async () => {
    try {
      const boardRes = await axios.get("https://optimusautomate-projectmanagementtool.onrender.com/boards/count");
      const statsRes = await axios.get("https://optimusautomate-projectmanagementtool.onrender.com/stats");
      console.log("boards/count response:", boardRes.data);
      console.log("stats response:", statsRes.data);
      setStats({
        totalBoards:    boardRes.data.total_boards,
        totalTasks:     statsRes.data.total_tasks,
        completedTasks: statsRes.data.completed_tasks,
        pendingTasks:   statsRes.data.pending_tasks,
      });
    } catch (e) {
      console.warn("Stats endpoints failed, computing from tasks:", e.message);
      try {
        const boardsRes = await axios.get("https://optimusautomate-projectmanagementtool.onrender.com/boards");
        const allBoards = boardsRes.data;
        let allTasks = [];
        for (const board of allBoards) {
          try {
            const tasksRes = await axios.get(`https://optimusautomate-projectmanagementtool.onrender.com/tasks/${board.id}`);
            allTasks = allTasks.concat(tasksRes.data);
          } catch (_) {}
        }
        setStats({
          totalBoards:    allBoards.length,
          totalTasks:     allTasks.length,
          completedTasks: allTasks.filter(t => t.status === "Done").length,
          pendingTasks:   allTasks.filter(t => t.status !== "Done").length,
        });
      } catch (e2) {
        console.error("Fallback stats also failed:", e2);
      }
    }
  };

  // Step 2: updated createBoard
  const createBoard = async () => {
    if (boardName.trim() === "") {
      alert("Please enter a board name");
      return;
    }
    try {
      const response = await axios.post(
        "https://optimusautomate-projectmanagementtool.onrender.com/boards",
        { name: boardName }
      );
     
console.log("FULL RESPONSE:", response);
console.log("DATA:", response.data);

alert(JSON.stringify(response.data));
      setGeneratedInviteCode(response.data.invite_code);
      alert("Board Created!\nInvite Code: " + response.data.invite_code);
      setBoardName("");
      setShowModal(false);
      fetchBoards();
      fetchStats();
    } catch (error) {
      console.log(error);
    }
  };

  // Step 3: joinBoard function
  const joinBoard = async () => {
    const username = localStorage.getItem("userName");
    try {
      const response = await axios.post(
        "https://optimusautomate-projectmanagementtool.onrender.com/boards/join",
        { invite_code: inviteCode, username }
      );
      alert(response.data.message);
      setInviteCode("");
      setShowJoinModal(false);
      fetchBoards();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("userName");
    navigate("/login");
  };

  /* ── Stat card definitions ── */
  const statCards = [
    { label: "Total Boards",    value: stats.totalBoards,    icon: "📋", bg: T.indigoSoft,  iconColor: T.indigo   },
    { label: "Total Tasks",     value: stats.totalTasks,     icon: "✅", bg: T.emeraldSoft, iconColor: T.emerald  },
    { label: "Completed Tasks", value: stats.completedTasks, icon: "🎯", bg: T.amberSoft,   iconColor: T.amber    },
    { label: "Pending Tasks",   value: stats.pendingTasks,   icon: "⏳", bg: T.roseSoft,    iconColor: T.rose     },
  ];

  /* ── Nav items ── */
  const navItems = [
    { icon: "🏠", label: "Dashboard", active: true,  action: null },
    { icon: "📝", label: "My Tasks",  active: false, action: () => navigate("/mytasks") },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", background: T.canvas }}>

      {/* ════════ SIDEBAR ════════ */}
      <aside style={{
        width: 240, minHeight: "100vh", background: T.navy,
        display: "flex", flexDirection: "column",
        padding: "24px 14px", flexShrink: 0,
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", marginBottom: 32 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: "linear-gradient(135deg,#6366F1,#818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, flexShrink: 0,
            boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
          }}>⚡</div>
          <span style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", fontSize: 19, fontWeight: 800, color: T.white, letterSpacing: "-0.4px" }}>
            TaskFlow
          </span>
        </div>

        {/* Section label */}
        <p style={{ fontSize: 10.5, fontWeight: 700, color: T.slate400, letterSpacing: "1px", textTransform: "uppercase", padding: "0 10px", marginBottom: 8 }}>
          Menu
        </p>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={item.action || undefined}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10,
                fontSize: 13.5, fontWeight: 500,
                color: item.active ? T.white : T.slate400,
                background: item.active ? "rgba(99,102,241,0.2)" : "transparent",
                cursor: item.action ? "pointer" : "default",
                transition: "all 150ms",
                userSelect: "none",
              }}
              onMouseEnter={e => { if (!item.active) { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = T.white; }}}
              onMouseLeave={e => { if (!item.active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.slate400; }}}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Logout */}
          <div
            onClick={logout}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10,
              fontSize: 13.5, fontWeight: 500,
              color: "#FDA4AF", cursor: "pointer",
              transition: "all 150ms", userSelect: "none",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(244,63,94,0.12)"; e.currentTarget.style.color = "#FB7185"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#FDA4AF"; }}
          >
            <span style={{ fontSize: 16 }}>🚪</span> Logout
          </div>
        </nav>

        {/* User footer */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14, marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px" }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg,#6366F1,#818cf8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: T.white, fontWeight: 700, fontSize: 14, flexShrink: 0,
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {userName}
              </div>
              <div style={{ fontSize: 11, color: T.slate400 }}>Member</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ════════ MAIN ════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Topbar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 32px",
          background: T.white,
          borderBottom: `1px solid ${T.slate200}`,
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", fontSize: 20, fontWeight: 700, color: T.navy, letterSpacing: "-0.4px", margin: 0 }}>
              Dashboard
            </h1>
            <p style={{ fontSize: 13, color: T.navy600, marginTop: 2 }}>Welcome back, {userName}!</p>
          </div>

          {/* Step 4: replaced single button with Join Board + New Board */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setShowJoinModal(true)}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "none",
                background: "#10B981",
                color: "white",
                cursor: "pointer",
              }}
            >
              Join Board
            </button>
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "10px 18px",
                background: "linear-gradient(135deg,#6366F1,#4F46E5)",
                color: T.white, border: "none", borderRadius: 10,
                fontFamily: "'Inter',system-ui,sans-serif",
                fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                boxShadow: "0 3px 10px rgba(99,102,241,0.35)",
                transition: "all 150ms",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(99,102,241,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(99,102,241,0.35)"; }}
            >
              + New Board
            </button>
          </div>
        </div>

        {/* Page body */}
        <div style={{ padding: "28px 32px", flex: 1 }}>

          {/* ── Stats ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16, marginBottom: 32,
          }}>
            {statCards.map((s) => (
              <div key={s.label} style={{
                background: T.white,
                border: `1px solid ${T.slate200}`,
                borderRadius: 14, padding: "18px 20px",
                display: "flex", alignItems: "center", gap: 14,
                boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
                transition: "all 150ms",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,23,42,0.10)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";   e.currentTarget.style.boxShadow = "0 1px 4px rgba(15,23,42,0.06)"; }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: s.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.navy600, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", fontSize: 28, fontWeight: 800, color: T.navy, lineHeight: 1, letterSpacing: "-1px" }}>
                    {s.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Boards section header ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", fontSize: 16, fontWeight: 700, color: T.navy, letterSpacing: "-0.3px", margin: 0 }}>
              Project Boards
            </h2>
            <span style={{ fontSize: 13, color: T.navy600 }}>
              {boards.length} board{boards.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* ── Boards grid ── */}
          {boards.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 24px", color: T.slate400, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <div style={{ fontWeight: 600, color: T.navy600, marginBottom: 4 }}>No boards yet</div>
              <div style={{ fontSize: 13 }}>Create your first board to get started</div>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
              gap: 16,
            }}>
              {boards.map((board) => (
                <div
                  key={board.id}
                  onClick={() => navigate(`/board/${board.id}`)}
                  style={{
                    background: T.white,
                    border: `1px solid ${T.slate200}`,
                    borderRadius: 14, padding: "20px 22px",
                    cursor: "pointer",
                    boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
                    transition: "all 150ms",
                    position: "relative", overflow: "hidden",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,23,42,0.12)";
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.querySelector(".top-bar").style.opacity = "1";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 1px 4px rgba(15,23,42,0.06)";
                    e.currentTarget.style.borderColor = T.slate200;
                    e.currentTarget.querySelector(".top-bar").style.opacity = "0";
                  }}
                >
                  {/* Hover top bar */}
                  <div className="top-bar" style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: "linear-gradient(90deg,#6366F1,#818cf8)",
                    opacity: 0, transition: "opacity 150ms",
                  }} />
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: T.indigoSoft,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, marginBottom: 12,
                  }}>📋</div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", fontSize: 15, fontWeight: 700, color: T.navy, marginBottom: 4 }}>
                    {board.name}
                  </h3>
                  <p style={{ fontSize: 12.5, color: T.slate400 }}>Click to open board</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ════════ Step 5: JOIN BOARD MODAL ════════ */}
      {showJoinModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 200,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "28px",
              borderRadius: "10px",
              width: "400px",
              boxShadow: "0 20px 60px rgba(15,23,42,0.2)",
            }}
          >
            <h2 style={{ margin: "0 0 16px", fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", fontSize: 18, fontWeight: 700, color: T.navy }}>
              Join Board
            </h2>
            <input
              type="text"
              placeholder="Invite Code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 13px",
                border: `1.5px solid ${T.slate200}`,
                borderRadius: 10,
                fontFamily: "'Inter',system-ui,sans-serif",
                fontSize: 14,
                color: T.navy,
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowJoinModal(false)}
                style={{
                  padding: "10px 18px",
                  background: T.white,
                  border: `1.5px solid ${T.slate200}`,
                  borderRadius: 10,
                  fontFamily: "'Inter',system-ui,sans-serif",
                  fontSize: 13.5, fontWeight: 600,
                  color: T.navy700, cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={joinBoard}
                style={{
                  padding: "10px 20px",
                  background: "#10B981",
                  border: "none",
                  borderRadius: 10,
                  fontFamily: "'Inter',system-ui,sans-serif",
                  fontSize: 13.5, fontWeight: 600,
                  color: "white", cursor: "pointer",
                }}
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ CREATE BOARD MODAL ════════ */}
      {showModal && (
        <div
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(15,23,42,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 200, padding: 20,
          }}
        >
          <div style={{
            background: T.white, borderRadius: 18,
            padding: "28px 28px 24px",
            width: "100%", maxWidth: 420,
            boxShadow: "0 20px 60px rgba(15,23,42,0.2)",
          }}>
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", fontSize: 18, fontWeight: 700, color: T.navy }}>
                Create Board
              </span>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: T.slate100, border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: T.navy700, fontSize: 15,
                }}
              >✕</button>
            </div>

            {/* Input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: T.navy700, marginBottom: 6 }}>
                Board name
              </label>
              <input
                type="text"
                placeholder="e.g. Website Redesign"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createBoard()}
                autoFocus
                style={{
                  width: "100%", padding: "10px 13px",
                  border: `1.5px solid ${T.slate200}`,
                  borderRadius: 10, outline: "none",
                  fontFamily: "'Inter',system-ui,sans-serif",
                  fontSize: 14, color: T.navy,
                  boxSizing: "border-box",
                  transition: "border-color 150ms",
                }}
                onFocus={e => e.target.style.borderColor = T.indigo}
                onBlur={e => e.target.style.borderColor = T.slate200}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px 18px",
                  background: T.white, border: `1.5px solid ${T.slate200}`,
                  borderRadius: 10, fontFamily: "'Inter',system-ui,sans-serif",
                  fontSize: 13.5, fontWeight: 600, color: T.navy700, cursor: "pointer",
                }}
              >Cancel</button>
              <button
                onClick={createBoard}
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(135deg,#6366F1,#4F46E5)",
                  border: "none", borderRadius: 10,
                  fontFamily: "'Inter',system-ui,sans-serif",
                  fontSize: 13.5, fontWeight: 600, color: T.white, cursor: "pointer",
                  boxShadow: "0 3px 10px rgba(99,102,241,0.35)",
                }}
              >Create</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;