import Game from "./components/Game";

function App() {
  return (
    <div className="w-screen h-screen p-2 flex flex-col items-center overflow-hidden">
      <h1 className="text-center font-bold py-2 text-2xl">React 2048</h1>
      <Game />
    </div>
  );
}

export default App;
