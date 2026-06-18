import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import {
  DndContext,
  useDraggable,
  useDroppable
} from "@dnd-kit/core";

function DraggableTask({ task, deleteTask }) {

  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: task.id,
      data: {
        task
      }
    });

  const style = {
    background: "#f1f5f9",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    cursor: "grab",
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <strong>{task.title}</strong>

        <button
          onClick={() => deleteTask(task.id)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "red"
          }}
        >
          ❌
        </button>
      </div>

      <div
        style={{
          marginTop: "8px",
          fontSize: "13px",
          color: "#475569"
        }}
      >
        {task.description}
      </div>

      <div
        style={{
          marginTop: "8px",
          fontSize: "13px",
          color: "#64748b"
        }}
      >
        📅 {task.due_date}
      </div>

    </div>
  );
}

function Column({ id, title, tasks, deleteTask }) {

  const { setNodeRef } = useDroppable({
    id
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        background: "white",
        padding: "15px",
        borderRadius: "12px",
        minHeight: "500px"
      }}
    >
      <h2>{title}</h2>

      {tasks.map((task) => (
        <DraggableTask
          key={task.id}
          task={task}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
}

function Board() {

  const { id } = useParams();

  const [tasks, setTasks] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [dueDate, setDueDate] = useState("");

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

    try {

      await axios.post(
        "http://127.0.0.1:8000/tasks",
        {
          board_id: id,
          title,
          description,
          status,
          due_date: dueDate
        }
      );

      setShowModal(false);

      setTitle("");
      setDescription("");
      setStatus("To Do");
      setDueDate("");

      fetchTasks();

    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (taskId) => {

    try {

      await axios.delete(
        `http://127.0.0.1:8000/tasks/${taskId}`
      );

      fetchTasks();

    } catch (error) {
      console.log(error);
    }
  };

  const updateTaskStatus = async (
    taskId,
    newStatus
  ) => {

    try {

      await axios.put(
        `http://127.0.0.1:8000/tasks/${taskId}`,
        {
          status: newStatus
        }
      );

      fetchTasks();

    } catch (error) {
      console.log(error);
    }
  };

  const handleDragEnd = (event) => {

    const { active, over } = event;

    if (!over) return;

    updateTaskStatus(
      active.id,
      over.id
    );
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

      <DndContext
        onDragEnd={handleDragEnd}
      >

        <div
          style={{
            display: "flex",
            gap: "20px"
          }}
        >

          <Column
            id="To Do"
            title="To Do"
            tasks={todoTasks}
            deleteTask={deleteTask}
          />

          <Column
            id="In Progress"
            title="In Progress"
            tasks={progressTasks}
            deleteTask={deleteTask}
          />

          <Column
            id="Done"
            title="Done"
            tasks={doneTasks}
            deleteTask={deleteTask}
          />

        </div>

      </DndContext>

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

            <textarea
              placeholder="Task Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              style={{
                width: "100%",
                height: "100px",
                padding: "12px",
                marginTop: "10px",
                marginBottom: "10px"
              }}
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "10px"
              }}
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
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