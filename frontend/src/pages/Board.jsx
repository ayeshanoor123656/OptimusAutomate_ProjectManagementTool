import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

/* ─── Drag Handle Icon ─────────────────────────────────────── */
function GripIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <circle cx="3" cy="3" r="1.2" />
      <circle cx="9" cy="3" r="1.2" />
      <circle cx="3" cy="6" r="1.2" />
      <circle cx="9" cy="6" r="1.2" />
      <circle cx="3" cy="9" r="1.2" />
      <circle cx="9" cy="9" r="1.2" />
    </svg>
  );
}

/* ─── Priority Color Helper ─────────────────────────────────── */
const priorityColor = (priority) => {
  switch (priority) {
    case "Critical": return "#dc2626";
    case "High":     return "#f97316";
    case "Medium":   return "#eab308";
    default:         return "#22c55e";
  }
};

/* ─── Draggable Task Card ───────────────────────────────────── */
function DraggableTask({ task, deleteTask, addComment }) {
  const [comment, setComment] = useState("");

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id, data: { task } });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 999 : undefined,
    position: isDragging ? "relative" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card${isDragging ? " dragging" : ""}`}
    >
      {/* Drag handle */}
      <div className="drag-handle" {...listeners} {...attributes}>
        <GripIcon />
        <span>Drag</span>
      </div>

      {/* Header */}
      <div className="task-header">
        <span className="task-title">{task.title}</span>
        <button className="task-delete" onClick={() => deleteTask(task.id)} title="Delete task">
          ✕
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      {/* Meta badges */}
      <div className="task-meta">
        {task.assigned_to && (
          <span className="task-badge user">👤 {task.assigned_to}</span>
        )}
        {task.due_date && (
          <span className="task-badge date">📅 {task.due_date}</span>
        )}
      </div>

      {/* Priority & Estimated */}
      {task.priority && (
        <p>
          <span
            style={{
              background: priorityColor(task.priority),
              color: "white",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "bold"
            }}
          >
            {task.priority}
          </span>
        </p>
      )}
      {task.estimated_days && (
        <p>
          <strong>Estimated:</strong> {task.estimated_days} days
        </p>
      )}

      {/* Comments */}
      <div className="task-comments">
        <div className="comments-label">Comments</div>

        {task.comments && task.comments.length > 0 ? (
          task.comments.map((item, index) => (
            <div key={index} className="comment-item">
              {item}
            </div>
          ))
        ) : (
          <div className="no-comments">No comments yet</div>
        )}

        <div className="comment-input-row">
          <input
            type="text"
            className="comment-input"
            placeholder="Add a comment…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && comment.trim()) {
                addComment(task.id, comment);
                setComment("");
              }
            }}
          />
          <button
            className="comment-submit"
            onClick={() => {
              addComment(task.id, comment);
              setComment("");
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Column ────────────────────────────────────────────────── */
const COLUMN_META = {
  "To Do":       { dot: "todo",   label: "To Do" },
  "In Progress": { dot: "inprog", label: "In Progress" },
  "Done":        { dot: "done",   label: "Done" },
};

function Column({ id, tasks, deleteTask, addComment }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const meta = COLUMN_META[id];

  return (
    <div
      className="kanban-column"
      style={{
        outline: isOver ? "2px solid var(--indigo)" : undefined,
        outlineOffset: "2px",
        transition: "outline 120ms",
      }}
    >
      <div className="column-header">
        <div className="column-header-left">
          <div className={`column-dot ${meta.dot}`} />
          <span className="column-title">{meta.label}</span>
        </div>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div className="column-body" ref={setNodeRef}>
        {tasks.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px 12px",
              color: "var(--slate-400)",
              fontSize: 12,
              border: "1.5px dashed var(--slate-200)",
              borderRadius: "var(--radius-md)",
            }}
          >
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <DraggableTask
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              addComment={addComment}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Board Page ────────────────────────────────────────────── */
function Board() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("To Do");
  const [dueDate, setDueDate] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedSubtasks, setGeneratedSubtasks] = useState([]);
  const [generatingSubtasks, setGeneratingSubtasks] = useState(false);
  const [priority, setPriority] = useState("Medium");
  const [estimatedDays, setEstimatedDays] = useState(1);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`https://optimusautomate-projectmanagementtool.onrender.com/tasks/${id}`);
      setTasks(response.data);
    } catch (error) { console.log(error); }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `https://optimusautomate-projectmanagementtool.onrender.com/boards/${id}/members`
      );
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const generateDescription = async () => {
    if (!title.trim()) {
      alert("Enter task title first");
      return;
    }

    try {
      setGenerating(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/ai/generate-description",
        {
          title: title
        }
      );

      setDescription(response.data.description);

    } catch (error) {
      console.log(error);
    } finally {
      setGenerating(false);
    }
  };

  const generateSubtasks = async () => {
    if (!title.trim()) {
      alert("Enter task title first");
      return;
    }

    try {
      setGeneratingSubtasks(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/ai/generate-subtasks",
        {
          title: title
        }
      );

      setGeneratedSubtasks(
        response.data.subtasks
      );

    } catch (error) {
      console.log(error);
    } finally {
      setGeneratingSubtasks(false);
    }
  };

  const createAISubtasks = async () => {
    try {
      for (const task of generatedSubtasks) {
        await axios.post(
          "https://optimusautomate-projectmanagementtool.onrender.com/tasks",
          {
            board_id: id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            estimated_days: task.estimated_days,
            assigned_to: "",
            status: "To Do",
            due_date: "",
            comments: []
          }
        );
      }

      alert("AI subtasks created successfully!");

      fetchTasks();

      setGeneratedSubtasks([]);

    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async () => {
    if (!title.trim()) return;
    setCreating(true);
    try {
      await axios.post("https://optimusautomate-projectmanagementtool.onrender.com/tasks", {
        board_id: id,
        title,
        description,
        assigned_to: assignedTo,
        status,
        due_date: dueDate,
        priority,
        estimated_days: estimatedDays,
        comments: []
      });
      setShowModal(false);
      setTitle(""); setDescription(""); setAssignedTo("");
      setStatus("To Do"); setDueDate("");
      setPriority("Medium"); setEstimatedDays(1);
      fetchTasks();
    } catch (error) { console.log(error); }
    finally { setCreating(false); }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`https://optimusautomate-projectmanagementtool.onrender.com/tasks/${taskId}`);
      fetchTasks();
    } catch (error) { console.log(error); }
  };

  const addComment = async (taskId, comment) => {
    if (!comment.trim()) return;
    try {
      await axios.put(`https://optimusautomate-projectmanagementtool.onrender.com/tasks/comment/${taskId}`, { comment });
      fetchTasks();
    } catch (error) { console.log(error); }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`https://optimusautomate-projectmanagementtool.onrender.com/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (error) { console.log(error); }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    updateTaskStatus(active.id, over.id);
  };

  const getByStatus = (s) => tasks.filter((t) => t.status === s);

  return (
    <div className="board-page">
      {/* Topbar */}
      <div className="board-topbar">
        <div className="board-topbar-left">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ←
          </button>
          <h1 className="board-title">Board</h1>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Task
        </button>
      </div>

      {/* Kanban Area */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="board-columns-area">
          {["To Do", "In Progress", "Done"].map((col) => (
            <Column
              key={col}
              id={col}
              tasks={getByStatus(col)}
              deleteTask={deleteTask}
              addComment={addComment}
            />
          ))}
        </div>
      </DndContext>

      {/* Create Task Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <span className="modal-title">Add Task</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-field">
              <label>Task title</label>

              <input
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />

              <button
                type="button"
                onClick={generateDescription}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  cursor: "pointer"
                }}
              >
                {generating
                  ? "Generating..."
                  : "✨ Generate Description"}
              </button>

              <button
                type="button"
                onClick={generateSubtasks}
              >
                {generatingSubtasks
                  ? "Generating..."
                  : "✨ Generate Subtasks"}
              </button>
            </div>

            <div className="modal-field">
              <label>Description</label>
              <textarea
                placeholder="Add more details (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {generatedSubtasks.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h4>AI Generated Subtasks</h4>

                {generatedSubtasks.map((task, index) => (
                  <div
                    key={index}
                    className="ai-card"
                  >
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <b>Priority:</b> {task.priority}
                    <br/>
                    <b>Estimated:</b> {task.estimated_days} days
                  </div>
                ))}
              </div>
            )}

            {generatedSubtasks.length > 0 && (
              <button
                onClick={createAISubtasks}
                style={{ marginTop: "15px" }}
              >
                🚀 Create AI Subtasks
              </button>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="modal-field">
                <label>Assign to</label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-field">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>
              </div>
            </div>

            <div className="modal-field">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="modal-field">
              <label>Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label>Estimated Days</label>
              <input
                type="number"
                min="1"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(Number(e.target.value))}
              />
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={createTask}
                disabled={creating}
              >
                {creating ? "Adding…" : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Board;