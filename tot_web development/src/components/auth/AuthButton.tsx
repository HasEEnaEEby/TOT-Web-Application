import { motion, PanInfo } from "framer-motion";

const App = () => {
  // Drag event handler
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    console.log("Drag event:", event);
    console.log("Drag position:", info.point); // Log the drag position
  };

  const handleDragStart = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    console.log("Drag started:", info.point);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    console.log("Drag ended:", info.point);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <motion.button
        drag
        whileDrag={{ scale: 1.1 }} 
        onDrag={handleDrag}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Drag Me
      </motion.button>
    </div>
  );
};

export default App;
