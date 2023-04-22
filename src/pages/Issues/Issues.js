import { Avatar, Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PaginatedTable from "../../components/PaginatedTable/PaginatedTable";
import { octokit } from "../../utils/octokit";
import styles from "./Issues.module.css";

const Issues = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [issues, setIssues] = useState([]);
    const [labels, setLabels] = useState({});
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [status, setStatus] = useState("all");
    const { owner, repo } = useParams();

    async function fetchIssues() {
        const response = await octokit.rest.issues.list({
            per_page: rowsPerPage,
            page: page + 1,
            pulls: false,
            labels: selectedLabels.map((label) => labels[label].name).join(","),
            state: status,
        });

        setIssues(response.data);

        //   console.log("reaponse", response);
    }

    async function getLabels() {
        const response = await octokit.rest.issues.listLabelsForRepo({
            owner,
            repo,
        });
        const labelObj = {};
        response.data.forEach((labelInfo) => {
            labelObj[labelInfo.id] = labelInfo;
        });
        setLabels(labelObj);
    }

    useEffect(() => {
        fetchIssues();
    }, [page, rowsPerPage, selectedLabels, status]);

    useEffect(() => {
        getLabels();
    }, [owner, repo]);

    const handleChangePage = (e) => {
        setPage(e.target.value);
    };

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(e.target.value);
    };

    const handleLabelChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedLabels(typeof value === "string" ? value.split(",") : value);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    return (
        <div className={styles.issues}>
            <h2>Issues</h2>
            <div className={styles.issues_section}>
                <div className={styles.issues_section__filters}>
                    <FormControl sx={{ minWidth: 250 }}>
                        <InputLabel id="issue-label-select-chip-label">Labels</InputLabel>
                        <Select
                            labelId="issue-label-select-chip-label"
                            id="issue-label-select-chip"
                            multiple
                            value={selectedLabels}
                            onChange={handleLabelChange}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip
                                            key={value}
                                            label={labels[value].name}
                                            avatar={
                                                <Avatar sx={{ bgcolor: `#${labels[value].color}` }}>
                                                    <div></div>
                                                </Avatar>
                                            }
                                        />
                                    ))}
                                </Box>
                            )}
                        >
                            {Object.keys(labels).map((label) => (
                                <MenuItem key={label} value={label}>
                                    {`${labels[label].name}: ${labels[label].description}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                    data={issues}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </div>
        </div>
    );
};

export default Issues;
