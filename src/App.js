import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PullRequests from "./pages/PullRequests";
import Issues from "./pages/Issues";
import Details from "./pages/Details";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/">
                    <Route index element={<Dashboard />} />
                    <Route path="issues">
                        <Route index element={<Issues />} />
                        <Route path=":owner/:repo/:number" element={<Details page="issues" />} />
                    </Route>
                    <Route path="pulls">
                        <Route index element={<PullRequests />} />
                        <Route path=":owner/:repo/:number" element={<Details page="pulls" />} />
                    </Route>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
