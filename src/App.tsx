import { useState } from "react";
import "./App.css";

function App() {
    const [pacman, setPacman] = useState<{ x: number; y: number; direction: "NORTH" | "SOUTH" | "EAST" | "WEST" }>({
        x: 0,
        y: 0,
        direction: "EAST"
    });

    const [pacmanSpawned, setPacmanSpawned] = useState(false);
    const [actions, setActions] = useState<string[]>([]);

    function place(x: number, y: number, direction: "NORTH" | "SOUTH" | "EAST" | "WEST") {
        if (x < 0 || y < 0 || x > 4 || y > 4) {
            return;
        }
        pacman.x = x;
        pacman.y = y;
        pacman.direction = direction;
        setActions([...actions, `PLACE ${x},${y},${direction}`]);
    }

    function move() {
        switch (pacman.direction) {
            case "SOUTH":
                if (pacman.y > 0) {
                    pacman.y--;
                    setActions([...actions, "MOVE SOUTH"]);
                }
                break;
            case "NORTH":
                if (pacman.y < 4) {
                    pacman.y++;
                    setActions([...actions, "MOVE NORTH"]);
                }
                break;
            case "WEST":
                if (pacman.x > 0) {
                    pacman.x--;
                    setActions([...actions, "MOVE WEST"]);
                }
                break;
            case "EAST":
                if (pacman.x < 4) {
                    pacman.x++;
                    setActions([...actions, "MOVE EAST"]);
                }
                break;
        }
    }

    function rotate(direction: "left" | "right") {
        switch (pacman.direction) {
            case "NORTH":
                pacman.direction = direction === "left" ? "WEST" : "EAST";
                setActions([...actions, `ROTATE ${direction.toUpperCase()}`]);
                break;
            case "SOUTH":
                pacman.direction = direction === "left" ? "EAST" : "WEST";
                setActions([...actions, `ROTATE ${direction.toUpperCase()}`]);
                break;
            case "WEST":
                pacman.direction = direction === "left" ? "SOUTH" : "NORTH";
                setActions([...actions, `ROTATE ${direction.toUpperCase()}`]);
                break;
            case "EAST":
                pacman.direction = direction === "left" ? "NORTH" : "SOUTH";
                setActions([...actions, `ROTATE ${direction.toUpperCase()}`]);
                break;
        }
    }

    function handleCommand(input: string) {
        const [command, ...args] = input.split(" ");
        switch (command) {
            case "PLACE":
                const [x, y, direction] = args[0].split(",");
                place(parseInt(x), parseInt(y), direction as "NORTH" | "SOUTH" | "EAST" | "WEST");
                setPacmanSpawned(true);
                break;
            case "MOVE":
                if (pacmanSpawned) move();
                break;
            case "LEFT":
                if (pacmanSpawned) rotate("left");
                break;
            case "RIGHT":
                if (pacmanSpawned) rotate("right");
                break;
            case "REPORT":
                if (pacmanSpawned) {
                    setActions([...actions, `REPORT ${pacman.x},${pacman.y},${pacman.direction}`]);
                }
                break;
        }
        setPacman({ ...pacman });
    }

    return (
        <div className="App">
            <div className="grid">
                {[...Array(5)].map((_, x) => {
                    return [...Array(5)].map((_, y) => <div className="cell" style={{ gridRow: y + 1, gridColumn: x + 1 }} key={`${x}-${y}`}></div>);
                })}
                {!pacmanSpawned ? (
                    ""
                ) : (
                    <div className={`pacman ${pacman.direction}`} style={{ gridRow: 4 - pacman.y + 1, gridColumn: pacman.x + 1 }}>
                        <div className="mouth"></div>
                    </div>
                )}
            </div>
            <div className="controls">
                <input
                    type="text"
                    placeholder="Enter command"
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            handleCommand(e.currentTarget.value);
                            e.currentTarget.value = "";
                        }
                    }}
                />
            </div>
            <div className="actions">
                {actions.map((action, i) => (
                    <div key={i}>{action}</div>
                ))}
            </div>
        </div>
    );
}

export default App;
