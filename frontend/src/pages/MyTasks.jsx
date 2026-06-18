import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function getStatusClass(status) {
  if (status === "Done") return "done";
  if (status === "In Progress") return "inprog";
  return "todo";
}

function getStatusLabel(status) {
  if (status === "Done") return "✓ Done";
  if (status === "In Progress") return "◐ In Progress";
  return "○ To Do";
}

function MyTasks() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `https://optimusautomate-projectmanagementtool.onrender.com/mytasks/${userName}`
      );
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">⚡</div>
          <span className="sidebar-logo-text">TaskFlow</span>
        </div>

        <p className="sidebar-section-label">Menu</p>

        <ul className="sidebar-nav">
          <li onClick={() => navigate("/dashboard")}>
            <span className="nav-icon">🏠</span> Dashboard
          </li>
          <li className="active">
            <span className="nav-icon">📝</span> My Tasks
          </li>

          <div style={{ flex: 1 }} />

          <li className="logout" onClick={logout}>
            <span className="nav-icon">🚪</span> Logout
          </li>
        </ul>

        <div className="sidebar-footer">
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 10px",
          }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#6366F1,#818cf8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: 13,
              flexShrink: 0,
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {userName}
              </div>
              <div style={{ fontSize: 11, color: "var(--slate-400)" }}>Member</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <h1>My Tasks</h1>
            <p>All tasks assigned to you across every board</p>
          </div>
          <div style={{
            background: "var(--indigo-soft)",
            color: "var(--indigo-dark)",
            fontWeight: 700,
            fontSize: 13,
            padding: "6px 14px",
            borderRadius: 20,
          }}>
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="page-body">
          {loading ? (
            <div className="empty-state">
              <div className="empty-icon">⏳</div>
              <div className="empty-title">Loading tasks…</div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <div className="empty-title">You're all caught up!</div>
              <div className="empty-sub">No tasks assigned to you right now</div>
            </div>
          ) : (
            <div className="mytasks-grid">
              {tasks.map((task) => {
                const sc = getStatusClass(task.status);
                return (
                  <div key={task.id} className="mytask-card">
                    <div className={`mytask-status-bar ${sc}`} />
                    <div className="mytask-body">
                      <div className="mytask-title">{task.title}</div>
                      {task.description && (
                        <div className="mytask-desc">{task.description}</div>
                      )}
                      <div className="mytask-meta">
                        <span className={`status-pill ${sc}`}>
                          {getStatusLabel(task.status)}
                        </span>
                        {task.due_date && (
                          <span className="task-badge date">📅 {task.due_date}</span>
                        )}
                        {task.assigned_to && (
                          <span className="task-badge user">👤 {task.assigned_to}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyTasks;