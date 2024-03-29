import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PaginatedTable from "../../components/PaginatedTable/PaginatedTable";
import { octokit } from "../../utils/octokit";
import styles from "./PullRequests.module.css";
import { findRelativeTime } from "../../utils/common";

const PullRequests = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [pulls, setPulls] = useState([]);
    const [order, setOrder] = useState("asc");
    const [status, setStatus] = useState("all");
    const [tableColumns] = useState([
        { name: "Name", sortable: false, align: "left" },
        { name: "Opened", sortable: false, align: "right" },
        { name: "Assignee", sortable: false, align: "right" },
        { name: "No of Comments", sortable: true, align: "right" },
    ]);

    const { owner, repo } = useParams();

    async function fetchPulls() {
        setLoading(true);
        try {
            const response = await octokit.rest.pulls.list({
                owner,
                repo,
                per_page: rowsPerPage,
                page: page + 1,
                state: status,
                sort: "popularity",
                order,
            });

            if (response.data.length > 0) {
                const transformedData = [];
                response.data.forEach((issue) => {
                    const dataObj = {};
                    dataObj["number"] = issue.number;
                    dataObj["Name"] = { data: issue.title, type: "link" };
                    dataObj["Opened"] = { data: findRelativeTime(issue.created_at), type: "string" };
                    dataObj["Assignee"] = { data: `${issue.assignee?.avatar_url}&s=20`, type: "url" };
                    dataObj["No of Comments"] = { data: issue?.comments, type: "number" };
                    transformedData.push(dataObj);
                });

                setPulls(transformedData);
            } else {
                throw new Error("No data found");
            }

        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setError(false);
        fetchPulls();
    }, [page, rowsPerPage, status, order]);

    const handleChangePage = (e) => {
        setPage(e.target.value);
    };

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handlePopularitySort = () => {
        setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    return (
        <div className={styles.pulls}>
            <h2>Pulls</h2>
            <div className={styles.pulls_section}>
                <div className={styles.pulls_section__filters}>
                    <FormControl className={styles.status}>
                        <InputLabel id="status-select-label">Status</InputLabel>
                        <Select
                            labelId="status-select-label"
                            id="status-select"
                            value={status}
                            label="Status"
                            onChange={handleStatusChange}
                        >
                            <MenuItem value={"all"}>All</MenuItem>
                            <MenuItem value={"open"}>Open</MenuItem>
                            <MenuItem value={"closed"}>Closed</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                {error ? (
                    <p style={{ textAlign: "center" }}>No Data found</p>
                ) : (
                    <PaginatedTable
                        loading={loading}
                        data={pulls}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        columns={tableColumns}
                        sortHandler={handlePopularitySort}
                        order={order}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                )}
            </div>
        </div>
    );
};

export default PullRequests;
