import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import hexoid from "hexoid";

const RADIUS = 5;

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
            r={RADIUS}
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
        y: cy,
        key: hexoid(25)()
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

// people tend to move around
// this step makes that happen
function peopleMove(population) {
    const random = d3.randomUniform(-1, 1);

    return population.map(p => ({
        ...p,
        x: p.x + random(),
        y: p.y + random()
    }));
}

// when people collide, they transfer viruses
function peopleCollisions(population) {
    // we only care about infected people
    const infected = population.filter(p => p.infected);

    // find people in vicinity of infected people
    const collisions = infected.map(person => {
        // subdivides whole space to find nearest candidates
        const subdvidedSpace = d3
            .quadtree()
            .extent([
                [-1, -1],
                [RADIUS * 2, RADIUS * 2]
            ])
            .x(d => d.x)
            .y(d => d.y)
            .addAll(
                // everyone not infected and not current lookup
                population
                    .filter(p => !p.infected)
                    .filter(p => p.key !== person.key)
            );

        // person within RADIUS*2 of lookup position
        const candidate = subdvidedSpace.find(person.x, person.y, RADIUS * 2);

        return candidate ? candidate : null;
    });

    return collisions.filter(p => p !== null);
}

// takes a population and list of contacts with infected folks
// decides who got infected
function infectPeople(population, contacts) {
    const contactKeys = contacts.map(p => p.key);

    return population.map(p => {
        if (contactKeys.includes(p.key)) {
            // this person came into contact with an infected fellow
            return {
                ...p,
                infected: true
            };
        } else {
            return p;
        }
    });
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
    // controls when the simulation is running
    const [simulating, setSimulating] = useState(false);

    function startSimulation() {
        // avoid changing values directly
        const nextPopulation = [...population];

        // infect a random person
        const person =
            nextPopulation[Math.floor(Math.random() * nextPopulation.length)];

        person.infected = true;

        setPopulation(nextPopulation);
        setSimulating(true);
    }

    function iteratePopulation() {
        setPopulation(population => {
            // calculate the next state of our population on each tick
            let nextPopulation = [...population]; // avoid changin stuff directly

            nextPopulation = peopleMove(nextPopulation);
            nextPopulation = infectPeople(
                nextPopulation,
                peopleCollisions(nextPopulation)
            );

            return nextPopulation;
        });
    }

    // runs the simulation loop
    useEffect(() => {
        if (simulating) {
            const t = d3.timer(iteratePopulation);

            // stop timer when cleaning up
            return t.stop;
        }
    }, [simulating]);

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
                {population.find(p => p.infected) ? null : (
                    <button onClick={startSimulation}>Infect a Person</button>
                )}
            </div>
        </>
    );
};
