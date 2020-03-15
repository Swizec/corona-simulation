import React, { useState } from "react";
import * as d3 from "d3";

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

// generates a population oriented around (cx, cy)
// fits into width and height
function createRow({ cx, cy, width }) {
    // fit as many as possible into a row
    const N = Math.floor(width / 15);

    // point scale positions a row for us
    const xScale = d3
        .scalePoint()
        .domain(d3.range(0, N))
        .range([cx - width / 2, cx + width / 2]);

    const row = d3.range(0, N).map(i => ({
        x: xScale(i),
        y: cy
    }));

    return row;
}

function createPopulation({ cx, cy, width, height }) {
    const Nrows = Math.ceil(height / 15);

    const yScale = d3
        .scalePoint()
        .domain(d3.range(0, Nrows))
        .range([cy - height / 2, cy + height / 2]);

    // figure out how to make this create a circle
    const widthScale = d3
        .scaleLinear()
        .domain([0, Nrows / 2, Nrows])
        .range([15, width, 15]);

    const rows = d3
        .range(0, Nrows)
        .map(i => createRow({ cx, cy: yScale(i), width: widthScale(i) }));

    return rows.reduce((population, row) => [...population, ...row]);
}

function usePopulation({ cx, cy, width, height }) {
    const [population, setPopulation] = useState(
        createPopulation({
            cx: width / 2,
            cy: height / 2,
            width: width - 15,
            height: height - 15
        })
    );

    function startSimulation() {
        // avoid changing values directly
        const nextPopulation = [...population];

        // infect a random person
        const person =
            nextPopulation[Math.floor(Math.random() * nextPopulation.length)];

        person.infected = true;

        setPopulation(nextPopulation);
    }

    return { population, startSimulation };
}

export const Population = ({ cx, cy, width, height }) => {
    const { population, startSimulation } = usePopulation({
        cx,
        cy,
        width,
        height
    });

    return (
        <>
            <svg
                style={{
                    width,
                    height
                }}
            >
                {population.map(p => (
                    <Person {...p} />
                ))}
            </svg>
            <div>
                <button onClick={startSimulation}>Infect a Person</button>
            </div>
        </>
    );
};
