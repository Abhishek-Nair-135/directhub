import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PaginatedTable from "../../components/PaginatedTable/PaginatedTable";
import { octokit } from "../../utils/octokit";
import styles from "./PullRequests.module.css";

const PullRequests = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [pulls, setPulls] = useState([]);
    const [order, setOrder] = useState("asc");
    const [status, setStatus] = useState("all");
    const { owner, repo } = useParams();

    async function fetchPulls() {
        const response = await octokit.rest.pulls.list({
            owner,
            repo,
            per_page: rowsPerPage,
            page: page + 1,
            state: status,
            sort: "popularity",
            order,
        });

        setPulls(response.data);

        //   console.log("reaponse", response);
    }

    useEffect(() => {
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
                    <FormControl>
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
                <PaginatedTable
                    data={pulls}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    sortByPopularity={true}
                    sortHandler={handlePopularitySort}
                    order={order}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </div>
        </div>
    );
};

export default PullRequests;
