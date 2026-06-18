import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [boardName, setBoardName] = useState("");

  const [stats, setStats] = useState({
    totalBoards: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });

  useEffect(() => {
    fetchBoards();
    fetchStats();
  }, []);

  const fetchBoards = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/boards"
      );

      setBoards(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchStats = async () => {

    try {

      const boardResponse = await axios.get(
        "http://127.0.0.1:8000/boards/count"
      );

      const statsResponse = await axios.get(
        "http://127.0.0.1:8000/stats"
      );

      setStats({
        totalBoards: boardResponse.data.total_boards,
        totalTasks: statsResponse.data.total_tasks,
        completedTasks: statsResponse.data.completed_tasks,
        pendingTasks: statsResponse.data.pending_tasks
      });

    } catch (error) {
      console.log(error);
    }
  };

  const createBoard = async () => {

    if (boardName.trim() === "") {
      alert("Please enter a board name");
      return;
    }

    try {

      await axios.post(
        "http://127.0.0.1:8000/boards",
        {
          name: boardName
        }
      );

      setBoardName("");
      setShowModal(false);

      fetchBoards();
      fetchStats();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard">

      <div className="sidebar">

        <h2>TaskFlow</h2>

        <ul>
          <li>Dashboard</li>
          <li>Boards</li>
          <li>Tasks</li>
          <li>Team</li>
          <li>Settings</li>
        </ul>

      </div>

      <div className="main-content">

        <div className="topbar">

          <h1>Dashboard</h1>

          <button
            className="auth-btn"
            onClick={() => setShowModal(true)}
          >
            Create Board
          </button>

        </div>

        {/* Statistics */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}
        >

          <div className="board-card">
            <h3>Total Boards</h3>
            <h1>{stats.totalBoards}</h1>
          </div>

          <div className="board-card">
            <h3>Total Tasks</h3>
            <h1>{stats.totalTasks}</h1>
          </div>

          <div className="board-card">
            <h3>Completed Tasks</h3>
            <h1>{stats.completedTasks}</h1>
          </div>

          <div className="board-card">
            <h3>Pending Tasks</h3>
            <h1>{stats.pendingTasks}</h1>
          </div>

        </div>

        <h2
          style={{
            marginBottom: "20px"
          }}
        >
          Project Boards
        </h2>

        <div className="board-grid">

          {boards.map((board) => (

            <div
              key={board.id}
              className="board-card"
              onClick={() =>
                navigate(`/board/${board.id}`)
              }
              style={{
                cursor: "pointer"
              }}
            >
              <h3>{board.name}</h3>
              <p>Click to Open Board</p>
            </div>

          ))}

        </div>

      </div>

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>Create Board</h2>

            <input
              type="text"
              placeholder="Board Name"
              value={boardName}
              onChange={(e) =>
                setBoardName(e.target.value)
              }
            />

            <div className="modal-buttons">

              <button
                className="auth-btn"
                onClick={createBoard}
              >
                Create
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;