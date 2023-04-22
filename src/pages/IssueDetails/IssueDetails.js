import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { octokit } from "../../utils/octokit";
import Details from "../../components/Details/Details";
import styles from "./IssuesDetails.module.css";

const IssueDetails = () => {
    const { owner, repo, issue_number } = useParams();
    const [issueData, setIssueData] = useState(null);
    const [issueComments, setIssueComments] = useState([]);

    async function fetchIssueDetails() {
        const response = await octokit.rest.issues.get({
            owner,
            repo,
            issue_number,
        });

        setIssueData(response.data);
    }

    async function fetchComments() {
        const response = await octokit.rest.issues.listComments({
            owner,
            repo,
            issue_number,
        });

        setIssueComments(response.data);
    }

    useEffect(() => {
        fetchComments();
        fetchIssueDetails();
    }, [owner, repo, issue_number]);

    return (
        <div className={styles.issue_details}>
            <h1>Issue Details</h1>
            <Details data={issueData} comments={issueComments} />
        </div>
    );
};

export default IssueDetails;
