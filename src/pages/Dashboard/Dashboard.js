import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import { octokit, user } from "../../utils/octokit";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
    const [reposList, setReposList] = useState([]);
    const [currentRepo, setCurrentRepo] = useState("");
    const [issues, setIssues] = useState([]);
    const [pullRequests, setPullRequests] = useState([]);

    async function fetchRepos() {
        const repos = await octokit.rest.repos.listForAuthenticatedUser();
        const list = repos?.data?.map((repo) => ({ name: repo?.name, full_name: repo?.full_name }));

        setReposList(list);
        setCurrentRepo(list[0]?.name);
    }

    async function fetchIssues() {
        const response = await octokit.rest.issues.listForRepo({
            owner: user,
            repo: currentRepo,
            per_page: 5,
            page: 1,
            pulls: false,
        });

        setIssues(response.data);

        //   console.log("reaponse", response);
    }

    async function fetchPRs() {
        const response = await octokit.rest.pulls.list({
            owner: user,
            repo: currentRepo,
            per_page: 5,
            page: 1,
        });

        setPullRequests(response.data);

        //   console.log("PR reaponse", response);
    }

    useEffect(() => {
        fetchRepos();
    }, []);

    useEffect(() => {
        fetchPRs();
        fetchIssues();
    }, [currentRepo]);

    const handleRepoChange = (event) => {
        setCurrentRepo(event.target.value);
    };

    return (
        <div className={styles.dashboard}>
            <h1>Directhub - Dashboard</h1>
            {reposList.length > 0 && (
                <Box className={styles.repo_select}>
                    <FormControl>
                        <InputLabel id="repo-select-label">Select Repository</InputLabel>
                        <Select
                            labelId="repo-select-label"
                            id="repo-select"
                            value={currentRepo}
                            label="Select Repository"
                            onChange={handleRepoChange}
                        >
                            {reposList.map((repo) => (
                                <MenuItem value={repo.name}>{repo.full_name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            )}

            <div className={styles.info_cards}>
                <DashboardCard title="Issues" data={issues} viewAllPath={`/issues/${user}/${currentRepo}`} />
                <DashboardCard
                    title="Pull Requests"
                    data={pullRequests}
                    viewAllPath={`/pulls/${user}/${currentRepo}`}
                />
            </div>
        </div>
    );
};

export default Dashboard;
