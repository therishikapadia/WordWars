import Home from "./Components/Home/Home"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from "./Components/Other/Form";
import Type from "./Components/Other/Type";
import LeaderBoard from "./Components/Other/LeaderBoard";
import Result from "./Components/Other/Result";
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/auth" element={<Form />} />
        <Route path="/type" element={<Type />} />
        <Route path="/result" element={<Result />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
