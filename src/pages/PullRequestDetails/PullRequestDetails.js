import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { octokit } from "../../utils/octokit";
import Details from "../../components/Details/Details";
import styles from "./PullRequestDetails.module.css";
import { CircularProgress } from "@mui/material";

const PullRequestDetails = () => {
    const { owner, repo, pull_number } = useParams();
    const [loading, setLoading] = useState({
        pull: false,
        comments: false,
    });
    const [error, setError] = useState({
        pull: false,
        comments: false,
    });
    const [pullData, setPullData] = useState(null);
    const [pullComments, setPullComments] = useState([]);

    async function fetchPullRequestDetails() {
        setLoading((prevLoading) => ({ ...prevLoading, pull: true }));

        try {
            const response = await octokit.rest.pulls.get({
                owner,
                repo,
                pull_number,
            });

            setPullData(response.data);
        } catch (error) {
            setError((prevError) => ({ ...prevError, pull: true }));
        } finally {
            setLoading((prevLoading) => ({ ...prevLoading, pull: false }));
        }
    }

    async function fetchComments() {
        setLoading((prevLoading) => ({ ...prevLoading, comments: true }));

        try {
            const response = await octokit.rest.issues.listComments({
                owner,
                repo,
                issue_number: pull_number,
                // sort: "created",
                // direction: "desc",
                per_page: 5,
                page: 1,
            });

            setPullComments(response.data);
        } catch (error) {
            setError((prevError) => ({ ...prevError, comments: true }));
        } finally {
            setLoading((prevLoading) => ({ ...prevLoading, comments: false }));
        }
    }

    useEffect(() => {
        fetchComments();
        fetchPullRequestDetails();
    }, [owner, repo, pull_number]);

    return (
        <div className={styles.pull_details}>
            <h1>Pull Request Details</h1>
            {loading.pull ? (
                <div style={{ width: "100%", textAlign: "center" }}>
                    <CircularProgress />
                </div>
            ) : (
                <Details loading={loading.comments} data={pullData} comments={pullComments} />
            )}
        </div>
    );
};

export default PullRequestDetails;
