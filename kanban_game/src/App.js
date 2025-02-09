import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const roles = [
    { name: "Gestor de Entregas", good: "Quita tu bloqueo", bad: "Pon un bloqueos" },
    { name: "Coach de Mejora", good: "Adelanta una fase", bad: "Retrocede una fase" },
    { name: "Gestor de Peticiones", good: "Puede tirar 2 veces el traductor", bad: "Pierde un turno" },
    { name: "Equipos de Innovación", good: "Suma +1 al traductor", bad: "Resta -1 al traductor" },
    { name: "Asesores Externos", good: "Tira 2 y selecciona el mayor", bad: "Pierdes turno" }
];

const App = () => {
    const [diceResults, setDiceResults] = useState({ teamA: null, teamB: null });
    const [teams, setTeams] = useState({
        teamA: new Array(5).fill().map((_, i) => ({ name: `Tarea ${i + 1}`, status: "todo", blocked: false })),
        teamB: new Array(5).fill().map((_, i) => ({ name: `Tarea ${i + 1}`, status: "todo", blocked: false }))
    });
    const [selectedRoles, setSelectedRoles] = useState({ teamA: null, teamB: null });

    const rollDice = (team) => {
        const result = Math.floor(Math.random() * 6) + 1;
        setDiceResults((prev) => ({ ...prev, [team]: result }));
    };

    const pickRole = (team) => {
        const role = roles[Math.floor(Math.random() * roles.length)];
        const isGood = Math.random() > 0.5;
        setSelectedRoles((prev) => ({ ...prev, [team]: { ...role, type: isGood ? "good" : "bad" } }));
    };

    const toggleBlockStatus = (team, index) => {
        setTeams((prevTeams) => ({
            ...prevTeams,
            [team]: prevTeams[team].map((task, i) => i === index ? { ...task, blocked: !task.blocked } : task)
        }));
    };

    const changeTaskStatus = (team, index, direction) => {
        setTeams((prevTeams) => {
            const inProgressCount = prevTeams[team].filter(task => task.status === "inProgress").length;
            return {
                ...prevTeams,
                [team]: prevTeams[team].map((task, i) => {
                    if (i === index && !task.blocked) {
                        if (direction === "forward") {
                            if (task.status === "todo" && inProgressCount < 2) return { ...task, status: "inProgress" };
                            if (task.status === "inProgress") return { ...task, status: "done" };
                        } else if (direction === "backward") {
                            if (task.status === "done") return { ...task, status: "inProgress" };
                            if (task.status === "inProgress") return { ...task, status: "todo" };
                        }
                    }
                    return task;
                })
            };
        });
    };

    return (
        <div className="app-container text-center py-5">
            <h1 className="title">Flujo de la Fábrica de Innovación🎮</h1>
            <div className="row">
                <div className="col-md-6 border-start ">
                    <h2>Equipo A</h2>
                    {teams.teamA.map((task, index) => (
                        <div key={index} className={`p-3 border rounded shadow task-column text-center ${task.status === "inProgress" ? "bg-warning" : ""}`}>
                            <h3 className={`task-title ${task.status}`}>{task.name}</h3>
                            <p className="task-status">Estado: {task.status}</p>
                            <button className="btn btn-danger btn-sm m-1" onClick={() => toggleBlockStatus("teamA", index)}>{task.blocked ? "🔓 Desbloquear" : "🔒 Bloquear"}</button>
                            <button className="btn btn-primary btn-sm m-1" onClick={() => changeTaskStatus("teamA", index, "backward")} disabled={task.status === "todo" || task.blocked}>⬅ Retroceder</button>
                            <button className="btn btn-primary btn-sm m-1" onClick={() => changeTaskStatus("teamA", index, "forward")} disabled={task.status === "done" || (task.status === "todo" && teams.teamA.filter(task => task.status === "inProgress").length >= 2) || task.blocked}>➡ Avanzar</button>
                        </div>
                    ))}
                    <button className="btn btn-success mt-3" onClick={() => rollDice("teamA")}>⏰ Lanzar traductor</button>
                    {diceResults.teamA && <p className="dice-result mt-3 fw-bold">Resultado: ⏰ {diceResults.teamA}</p>}
                    <button className="btn btn-info mt-3" onClick={() => pickRole("teamA")}>🎭 Seleccionar Personaje</button>
                    {selectedRoles.teamA && (
                        <div className={`card mt-3 p-3 ${selectedRoles.teamA.type === "good" ? "bg-success text-white" : "bg-danger text-white"}`}>
                            <h4>{selectedRoles.teamA.name}</h4>
                            <p>{selectedRoles.teamA.type === "good" ? selectedRoles.teamA.good : selectedRoles.teamA.bad}</p>
                        </div>
                    )}
                </div>
                <div className="col-md-6  border-end">
                    <h2>Equipo B</h2>
                    {teams.teamB.map((task, index) => (
                        <div key={index} className={`p-3 border rounded shadow task-column text-center ${task.status === "inProgress" ? "bg-warning" : ""}`}>
                            <h3 className={`task-title ${task.status}`}>{task.name}</h3>
                            <p className="task-status">Estado: {task.status}</p>
                            <button className="btn btn-danger btn-sm m-1" onClick={() => toggleBlockStatus("teamB", index)}>{task.blocked ? "🔓 Desbloquear" : "🔒 Bloquear"}</button>
                            <button className="btn btn-primary btn-sm m-1" onClick={() => changeTaskStatus("teamB", index, "backward")} disabled={task.status === "todo" || task.blocked}>⬅ Retroceder</button>
                            <button className="btn btn-primary btn-sm m-1" onClick={() => changeTaskStatus("teamB", index, "forward")} disabled={task.status === "done" || (task.status === "todo" && teams.teamB.filter(task => task.status === "inProgress").length >= 2) || task.blocked}>➡ Avanzar</button>
                        </div>
                    ))}
                    <button className="btn btn-success mt-3" onClick={() => rollDice("teamB")}>⏰ Lanzar traductor</button>
                    {diceResults.teamB && <p className="dice-result mt-3 fw-bold">Resultado: ⏰ {diceResults.teamB}</p>}
                    <button className="btn btn-info mt-3" onClick={() => pickRole("teamB")}>🎭 Seleccionar Personaje</button>
                    {selectedRoles.teamB && (
                        <div className={`card mt-3 p-3 ${selectedRoles.teamB.type === "good" ? "bg-success text-white" : "bg-danger text-white"}`}>
                            <h4>{selectedRoles.teamB.name}</h4>
                            <p>{selectedRoles.teamB.type === "good" ? selectedRoles.teamB.good : selectedRoles.teamB.bad}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
