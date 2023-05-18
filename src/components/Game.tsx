import { useEffect, useRef } from "react";

const Game = () => {
  const el = useRef<HTMLDivElement>(null);
  let score = 0;

  const cellv: number[] = [];

  const renderList: {
    start: number;
    end: number;
    value: number;
    double: boolean;
  }[] = [];

  const moveCells = (direction: string): boolean => {
    const dirmap: number[][] = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];
    let moveable = false;

    const attempMove = (ci: number, cj: number, dir: number[]) => {
      let double = false;

      if (cellv[ci * 4 + cj] !== 0) {
        let ni = ci;
        let nj = cj;

        while (true) {
          let ti = ni + dir[0],
            tj = nj + dir[1];

          if (ti < 0 || ti >= 4 || tj < 0 || tj >= 4) break;

          if (cellv[ti * 4 + tj] !== 0) {
            if (cellv[ci * 4 + cj] == cellv[ti * 4 + tj]) {
              double = true;
              ni = ti;
              nj = tj;
              break;
            }
            break;
          }
          ni = ti;
          nj = tj;
        }

        const startIndex = ci * 4 + cj;
        const endIndex = ni * 4 + nj;

        if (double) {
          cellv[endIndex] *= 2;
          renderList.push({
            start: startIndex,
            end: endIndex,
            value: cellv[startIndex],
            double: true,
          });

          score += cellv[endIndex];
          el.current!.firstElementChild!.nextElementSibling!.innerHTML =
            "Score: " + score;
        } else {
          cellv[endIndex] = cellv[startIndex];
          renderList.push({
            start: startIndex,
            end: endIndex,
            value: cellv[startIndex],
            double: false,
          });
        }
        if (startIndex !== endIndex) {
          cellv[startIndex] = 0;
          moveable = true;
        }
      }
    };

    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) {
        switch (direction) {
          case "ArrowUp":
            attempMove(i, j, dirmap[0]);
            break;
          case "ArrowRight":
            attempMove(j, 3 - i, dirmap[1]);
            break;
          case "ArrowDown":
            attempMove(3 - i, j, dirmap[2]);
            break;
          case "ArrowLeft":
            attempMove(j, i, dirmap[3]);
            break;
        }
      }
    return moveable;
  };

  const renderCells = () => {
    const cells = el.current!.lastChild!;

    cells.textContent = "";

    renderList.forEach((it) => {
      const theCell = document.createElement("div") as HTMLDivElement;
      theCell.className =
        "cursor-pointer transition-all rounded-lg duration-300 text-center text-4xl text-rose-800 flex items-center justify-center font-bold box-border w-24 h-24 border-2 bg-amber-500 absolute";
      theCell.innerHTML = it.value.toString();

      if (it.start == -1) theCell.style.transform = `translate(-200px, -200px)`;
      else
        theCell.style.transform = `translate(${(it.start % 4) * 96}px, ${
          Math.floor(it.start / 4) * 96
        }px)`;

      setTimeout(() => {
        theCell.style.transform = `translate(${(it.end % 4) * 96}px, ${
          Math.floor(it.end / 4) * 96
        }px)`;
        if (it.double) theCell.innerHTML = (it.value * 2).toString();
      }, 100);
      cells.appendChild(theCell);
    });
  };

  const generatCell = () => {
    let cellIndex;
    while (true) {
      cellIndex = Math.floor(Math.random() * 16);
      if (cellv[cellIndex] == 0) break;
    }
    cellv[cellIndex] = 2;
    renderList.push({ start: -1, end: cellIndex, value: 2, double: false });
  };

  useEffect(() => {
    const grid = el.current!.firstChild;

    // Reset score
    score = 0;

    for (let i = 0; i < 16; i++) {
      const gridCell = document.createElement("div") as HTMLDivElement;
      gridCell.className =
        "box-border w-24 h-24 border-2 border-rose-800 bg-rose-500 absolute";
      gridCell.style.transform = `translate(${(i % 4) * 96}px, ${
        Math.floor(i / 4) * 96
      }px)`;
      grid?.appendChild(gridCell);
    }

    for (let i = 0; i < 16; i++) cellv[i] = 0;

    renderList.splice(0);
    generatCell();
    generatCell();

    renderCells();
  }, []);

  document.body.onkeydown = (e: KeyboardEvent) => {
    if (e.key.indexOf("Arrow") >= 0) {
      renderList.splice(0);
      if (moveCells(e.key)) {
        generatCell();
        renderCells();
      }
    }
  };

  return (
    <div className="w-96 h-96 relative" ref={el}>
      <div className="grid"></div>
      <div className="fixed font-semibold top-2 right-2">Score: 0</div>
      <div className="cells"></div>
    </div>
  );
};

export default Game;
