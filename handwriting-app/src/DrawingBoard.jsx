import React, { useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

const DrawingBoard = () => {
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState("");

  const handleClear = () => {
    canvasRef.current.clearCanvas();
    setPrediction("");
  };

 const handlePredict = async () => {
  const dataUrl = await canvasRef.current.exportImage("png");
  const blob = await fetch(dataUrl).then((res) => res.blob());
  const formData = new FormData();
  formData.append("file", blob, "drawing.png");

  const res = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  setPrediction(data.predicted_text);
};


  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
      padding: "40px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      width: "100%"
    }}>
      <h2 style={{
        color: "#333",
        fontSize: "3rem",
        marginBottom: "40px",
        textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
        letterSpacing: "1px",
        width: "100%",
        textAlign: "center"
      }}>
        ✍️ Handwriting Recognition
      </h2>
      <div style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "25px",
        width: "100%"
      }}>
        <ReactSketchCanvas
          ref={canvasRef}
          width="100%"
          height="350px"
          strokeWidth={6}
          strokeColor="#333"
          backgroundColor="#f8f9fa"
          style={{
            border: "3px solid #e9ecef",
            borderRadius: "15px",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.1)",
            maxWidth: "800px",
            width: "100%"
          }}
        />
        <div style={{
          display: "flex",
          gap: "20px",
          width: "100%",
          justifyContent: "center"
        }}>
          <button
            onClick={handleClear}
            style={{
              padding: "15px 30px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "25px",
              fontSize: "1.1rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(220, 53, 69, 0.3)"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#c82333";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#dc3545";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Clear
          </button>
          <button
            onClick={handlePredict}
            style={{
              padding: "15px 30px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "25px",
              fontSize: "1.1rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#218838";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#28a745";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Predict
          </button>
        </div>
        {prediction && (
          <div style={{
            backgroundColor: "#ff9a9e",
            padding: "20px 40px",
            borderRadius: "50px",
            boxShadow: "0 5px 20px rgba(255, 154, 158, 0.3)",
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#721c24",
            textAlign: "center",
            width: "100%"
          }}>
            🧠 {prediction}
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawingBoard;