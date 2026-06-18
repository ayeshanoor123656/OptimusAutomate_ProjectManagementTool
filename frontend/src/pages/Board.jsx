import { useParams } from "react-router-dom";

function Board() {

  const { id } = useParams();

  return (

    <div
      style={{
        padding: "30px"
      }}
    >

      <h1>Board Details</h1>

      <p>
        Board ID: {id}
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px"
        }}
      >

        <div
          style={{
            width: "300px",
            background: "#f1f5f9",
            padding: "15px",
            borderRadius: "10px"
          }}
        >
          <h3>To Do</h3>
        </div>

        <div
          style={{
            width: "300px",
            background: "#f1f5f9",
            padding: "15px",
            borderRadius: "10px"
          }}
        >
          <h3>In Progress</h3>
        </div>

        <div
          style={{
            width: "300px",
            background: "#f1f5f9",
            padding: "15px",
            borderRadius: "10px"
          }}
        >
          <h3>Done</h3>
        </div>

      </div>

    </div>
  );
}

export default Board;