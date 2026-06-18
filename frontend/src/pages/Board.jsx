import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Board() {

  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("To Do");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {

      const response = await axios.get(
        `http://127.0.0.1:8000/tasks/${id}`
      );

      setTasks(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async () => {

    if (title.trim() === "") {
      alert("Enter task title");
      return;
    }

    try {

      await axios.post(
        "http://127.0.0.1:8000/tasks",
        {
          board_id: id,
          title: title,
          status: status
        }
      );

      setTitle("");
      setStatus("To Do");

      setShowModal(false);

      fetchTasks();

    } catch (error) {
      console.log(error);
    }
  };

  const todoTasks = tasks.filter(
    (task) => task.status === "To Do"
  );

  const progressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  );

  const doneTasks = tasks.filter(
    (task) => task.status === "Done"
  );

  return (
    <div
      style={{
        background: "#f4f7fc",
        minHeight: "100vh",
        padding: "30px"
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px"
        }}
      >
        <h1>Board</h1>

        <button
          className="auth-btn"
          style={{ width: "200px" }}
          onClick={() => setShowModal(true)}
        >
          Create Task
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px"
        }}
      >

        {/* TO DO */}

        <div
          style={{
            flex: 1,
            background: "white",
            padding: "15px",
            borderRadius: "12px"
          }}
        >
          <h2>To Do</h2>

          {todoTasks.map((task) => (

            <div
              key={task.id}
              style={{
                background: "#f1f5f9",
                padding: "10px",
                marginTop: "10px",
                borderRadius: "8px"
              }}
            >
              {task.title}
            </div>

          ))}

        </div>

        {/* IN PROGRESS */}

        <div
          style={{
            flex: 1,
            background: "white",
            padding: "15px",
            borderRadius: "12px"
          }}
        >
          <h2>In Progress</h2>

          {progressTasks.map((task) => (

            <div
              key={task.id}
              style={{
                background: "#f1f5f9",
                padding: "10px",
                marginTop: "10px",
                borderRadius: "8px"
              }}
            >
              {task.title}
            </div>

          ))}

        </div>

        {/* DONE */}

        <div
          style={{
            flex: 1,
            background: "white",
            padding: "15px",
            borderRadius: "12px"
          }}
        >
          <h2>Done</h2>

          {doneTasks.map((task) => (

            <div
              key={task.id}
              style={{
                background: "#f1f5f9",
                padding: "10px",
                marginTop: "10px",
                borderRadius: "8px"
              }}
            >
              {task.title}
            </div>

          ))}

        </div>

      </div>

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>Create Task</h2>

            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "10px",
                marginBottom: "20px"
              }}
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>

            <div className="modal-buttons">

              <button
                className="auth-btn"
                onClick={createTask}
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

export default Board;