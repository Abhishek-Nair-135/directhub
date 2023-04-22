import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import PullRequests from "./pages/PullRequests/PullRequests";
import Issues from "./pages/Issues/Issues";
import IssueDetails from "./pages/IssueDetails/IssueDetails";
import PullRequestDetails from "./pages/PullRequestDetails/PullRequestDetails";
import NotFound from "./pages/404";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/">
                    <Route index element={<Dashboard />} />
                    <Route path="issues">
                        <Route path=":owner/:repo" element={<Issues />} />
                        <Route path=":owner/:repo/:issue_number" element={<IssueDetails />} />
                    </Route>
                    <Route path="pulls">
                        <Route path=":owner/:repo" element={<PullRequests />} />
                        <Route path=":owner/:repo/:pull_number" element={<PullRequestDetails />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
