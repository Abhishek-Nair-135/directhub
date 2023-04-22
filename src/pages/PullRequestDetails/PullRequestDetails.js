import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { octokit } from "../../utils/octokit";
import Details from "../../components/Details/Details";
import styles from "./PullRequestDetails.module.css"

const PullRequestDetails = () => {
    const { owner, repo, pull_number } = useParams();
    const [pullData, setPullData] = useState(null);
    const [pullComments, setPullComments] = useState([]);

    async function fetchPullRequestDetails() {
        const response = await octokit.rest.pulls.get({
            owner,
            repo,
            pull_number,
        });

        setPullData(response.data);
    }

    async function fetchComments() {
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
    }

    useEffect(() => {
        fetchComments();
        fetchPullRequestDetails();
    }, [owner, repo, pull_number]);

    return (
        <div className={styles.pull_details}>
            <h1>Pull Request Details</h1>
            <Details data={pullData} comments={pullComments} />
        </div>
    );
};

export default PullRequestDetails;
