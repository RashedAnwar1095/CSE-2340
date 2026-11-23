import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { Gamepad2, Plus, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Options for the two dropdowns, and the style of the small status label
const platforms = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"];
const statuses = ["Playing", "Completed", "On Hold", "Plan to Play"];
const statusStyle = "w-fit rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300";

function App() {
  const [games, setGames] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); // true after saved games are read

  // Load the saved games one time, when the app starts
  useEffect(() => {
    const savedGames = localStorage.getItem("gamevault-games");
    if (savedGames) setGames(JSON.parse(savedGames));
    setIsLoaded(true);
  }, []);

  // Save the games every time the list changes
  useEffect(() => {
    if (isLoaded) localStorage.setItem("gamevault-games", JSON.stringify(games));
  }, [games, isLoaded]);

  if (!isLoaded) return <p className="p-10 text-center">Loading...</p>;

  return (
    <Routes>
      <Route path="/" element={<LibraryPage games={games} />} />
      <Route path="/add" element={<AddGamePage setGames={setGames} />} />
      <Route path="/game/:id" element={<GameDetailsPage games={games} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// PAGE 1: Library (home)
function LibraryPage({ games }) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-violet-400">
            <Gamepad2 size={25} />
            <span className="text-sm font-bold tracking-widest">MY COLLECTION</span>
          </div>
          <h1 className="mt-2 text-4xl font-extrabold">MyGameList</h1>
          <p className="mt-1 text-muted-foreground">Keep all your video games in one place.</p>
        </div>
        <Button size="lg" onClick={() => navigate("/add")}>
          <Plus size={17} /> Add Game
        </Button>
      </div>

      <Card className="mt-8 border-0 bg-linear-to-r from-[#0f1535] to-violet-800 text-white">
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase">Total Games</p>
            <p className="text-4xl font-bold">{games.length}</p>
          </div>
          <Library size={45} className="text-violet-300" />
        </CardContent>
      </Card>

      {games.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">No games yet. Click "Add Game" to add your first one!</p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <Card
            key={game.id}
            onClick={() => navigate("/game/" + game.id)}
            className="cursor-pointer gap-4 transition hover:-translate-y-1 hover:border-violet-500"
          >
            <CardHeader>
              <span className={statusStyle}>{game.status}</span>
              <CardTitle className="mt-2 text-xl">{game.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p><b className="text-foreground">Genre:</b> {game.genre}</p>
              <p><b className="text-foreground">Platform:</b> {game.platform}</p>
            </CardContent>
            <CardFooter className="border-t pt-4 text-sm font-medium text-violet-400">View Game Details →</CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// PAGE 2: Add Game form
function AddGamePage({ setGames }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("PC");
  const [releaseYear, setReleaseYear] = useState("");
  const [status, setStatus] = useState("Playing");

  function handleSubmit(event) {
    event.preventDefault(); // stop the page from reloading
    const newGame = { id: Date.now().toString(), title, genre, platform, releaseYear, status };
    setGames((oldGames) => [...oldGames, newGame]); // old games + the new game
    navigate("/");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add Game</CardTitle>
          <CardDescription>Fill in the details of your game.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Game Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Genre (e.g. RPG)" required value={genre} onChange={(e) => setGenre(e.target.value)} />
            <Input type="number" min="1970" max="2100" placeholder="Release Year" required value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} />

            <div className="space-y-2">
              <label htmlFor="platform" className="text-sm font-medium">Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger id="platform"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {platforms.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Playing Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statuses.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">Add Game</Button>
              <Button type="button" variant="outline" onClick={() => navigate("/")}>Back to Library</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// PAGE 3: Game Details
function GameDetailsPage({ games }) {
  const navigate = useNavigate();
  const { id } = useParams(); // the id from the address, like /game/123
  const game = games.find((item) => item.id === id);

  // If no game matches the address, go back to the library
  if (!game) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Card>
        <CardHeader>
          <span className={statusStyle}>{game.status}</span>
          <CardTitle className="mt-2 text-3xl">{game.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p><b>Genre:</b> {game.genre}</p>
          <p><b>Platform:</b> {game.platform}</p>
          <p><b>Release Year:</b> {game.releaseYear}</p>
          <p><b>Playing Status:</b> {game.status}</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>Back to Library</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;