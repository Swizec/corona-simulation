import React from "react";
import "./App.css";

import { Population } from "./Population";

function App() {
    const query = new URLSearchParams(window.location.search);

    return (
        <div className="App">
            <h1>
                {query.get("title") ||
                    "Visualizing the spread of viruses in a population"}
            </h1>
            <Population
                cx={400}
                cy={200}
                width={400}
                height={300}
                defaultMortality={query.get("mortality") || 4}
                defaultVirality={query.get("virality") || 50}
                defaultLengthOfInfection={query.get("lengthOfInfection") || 40}
                defaultSocialDistancing={query.get("socialDistancing") || 0}
                defaultReinfectability={query.get("reinfectability") || 30}
            />
        </div>
    );
}

export default App;
