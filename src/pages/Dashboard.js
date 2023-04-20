import { useEffect, useState } from "react";
import octokit from "../utils/octokit";
import { Button, Card, CardActions, CardContent, CardHeader } from "@mui/material";
import { findRelativeTime } from "../utils/common";

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [pullRequests, setPullRequests] = useState([]);

  useEffect(() => {
    async function fetchIssues() {
      const response = await octokit.rest.issues.list({
        per_page: 5,
        page: 1,
        pulls: false,
      });

      setIssues(response.data);

      //   console.log("reaponse", response);
    }

    async function fetchPRs() {
      const response = await octokit.rest.pulls.list({
        owner: "Abhishek-Nair-135",
        repo: "stock-market-backend",
        per_page: 5,
        page: 1,
      });

      setPullRequests(response.data);

      //   console.log("PR reaponse", response);
    }

    fetchPRs();
    fetchIssues();
  }, []);
  return (
    <div>
      <h1>Directhub - Dashboard</h1>
      <div>
        <Card>
          <CardHeader title="Issues" />
          <CardContent>
            {issues.length > 0 &&
              issues.map((issue) => (
                <div>
                  <div>{issue.title}</div>
                  <div>{findRelativeTime(issue.created_at)}</div>
                </div>
              ))}
          </CardContent>
          <CardActions>
            <Button>View All</Button>
          </CardActions>
        </Card>
        <Card>
          <CardHeader title="Pull Requests" />
          <CardContent>
            {pullRequests.length > 0 &&
              pullRequests.map((pullRequest) => (
                <div>
                  <div>{pullRequest.title}</div>
                  <div>{findRelativeTime(pullRequest.created_at)}</div>
                </div>
              ))}
          </CardContent>
          <CardActions>
            <Button>View All</Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
