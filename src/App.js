import React from "react";
import "./App.css";

const Person = ({ x, y, infected, dead, recovered }) => {
    // I really should've used styled components :P
    let strokeColor = "rgb(146, 120, 226)";
    let fillColor = "white";

    if (infected) {
        strokeColor = "rgb(246, 102, 64)";
        fillColor = "rgb(246, 102, 64)";
    } else if (dead) {
        strokeColor = "rgba(0, 0, 0, .5)";
    } else if (recovered) {
        strokeColor = "rgb(146, 119, 227)";
    }

    return (
        <circle
            cx={x}
            cy={y}
            r="5"
            style={{ fill: fillColor, stroke: strokeColor, strokeWidth: 2 }}
        ></circle>
    );
};

function App() {
    return (
        <div className="App">
            <h1>Visualizing the spread of viruses in a population</h1>
            <svg
                style={{
                    width: "100vw",
                    height: "100vh"
                }}
            >
                <Person x={100} y={100} />
            </svg>
        </div>
    );
}

export default App;
