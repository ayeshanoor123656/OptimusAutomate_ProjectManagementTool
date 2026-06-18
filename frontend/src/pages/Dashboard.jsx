import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [boardName, setBoardName] = useState("");

  useEffect(() => {
    fetchBoards();
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

          <h1>Project Boards</h1>

          <button
            className="auth-btn"
            onClick={() => setShowModal(true)}
          >
            Create Board
          </button>

        </div>

        <div className="board-grid">

          {boards.map((board) => (

            <div
              key={board.id}
              className="board-card"
              onClick={() =>
                navigate(`/board/${board.id}`)
              }
            >
              <h3>{board.name}</h3>
              <p>Project Board</p>
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