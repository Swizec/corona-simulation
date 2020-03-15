import React from "react";
import "./App.css";

import { Population } from "./Population";

function App() {
    return (
        <div className="App">
            <h1>Visualizing the spread of viruses in a population</h1>
            <Population cx={400} cy={200} width={400} height={300} />
        </div>
    );
}

export default App;
