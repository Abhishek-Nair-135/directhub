import { Avatar, Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PaginatedTable from "../../components/PaginatedTable/PaginatedTable";
import CancelIcon from "@mui/icons-material/Cancel";
import { octokit } from "../../utils/octokit";
import styles from "./Issues.module.css";
import { findRelativeTime } from "../../utils/common";

const Issues = () => {
    const [error, setError] = useState({
        issues: false,
        labels: false,
    });
    const [loading, setLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [issues, setIssues] = useState([]);
    const [labels, setLabels] = useState({});
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [status, setStatus] = useState("all");
    const [tableColumns] = useState([
        { name: "Name", sortable: false, align: "left" },
        { name: "Opened", sortable: false, align: "right" },
        { name: "Assignee", sortable: false, align: "right" },
        { name: "No of Comments", sortable: false, align: "right" },
    ]);

    const { owner, repo } = useParams();

    async function fetchIssues() {
        setLoading(true);
        try {
            const response = await octokit.rest.issues.listForRepo({
                owner,
                repo,
                per_page: rowsPerPage,
                page: page + 1,
                pulls: false,
                labels: selectedLabels.map((label) => labels[label].name).join(","),
                state: status,
            });

            if (response.data.length > 0) {
                const transformedData = [];
                response.data.forEach((issue) => {
                    const dataObj = {};
                    dataObj["number"] = issue.number;
                    dataObj["Name"] = { data: issue.title, type: "link" };
                    dataObj["Opened"] = { data: findRelativeTime(issue.created_at), type: "string" };
                    dataObj["Assignee"] = { data: `${issue.assignee?.avatar_url}&s=20`, type: "url" };
                    dataObj["No of Comments"] = { data: issue.comments, type: "number" };
                    transformedData.push(dataObj);
                });

                setIssues(transformedData);
            } else {
                throw new Error("No data found");
            }
        } catch (error) {
            setError((prevErrors) => ({ ...prevErrors, issues: true }));
        } finally {
            setLoading(false);
        }
    }

    async function getLabels() {
        try {
            const response = await octokit.rest.issues.listLabelsForRepo({
                owner,
                repo,
            });
            const labelObj = {};

            response?.data?.forEach((labelInfo) => {
                labelObj[labelInfo.id] = labelInfo;
            });
            setLabels(labelObj);
        } catch (error) {
            setError((prevErrors) => ({ ...prevErrors, labels: true }));
        }
    }

    useEffect(() => {
        resetErrors();
        fetchIssues();
    }, [page, rowsPerPage, ...selectedLabels, status]);

    useEffect(() => {
        resetErrors();
        getLabels();
    }, [owner, repo]);

    const resetErrors = () => {
        setError({
            issues: false,
            labels: false,
        });
    };

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

    const handleLabelDelete = (e, value) => {
        setSelectedLabels((prevLabels) => prevLabels.filter((label) => label !== value));
    };

    return (
        <div className={styles.issues}>
            <h2>Issues</h2>
            <div className={styles.issues_section}>
                <div className={styles.issues_section__filters}>
                    {error.labels ? (
                        <div>Error loading labels, please refresh the page</div>
                    ) : (
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
                                                onDelete={(e) => handleLabelDelete(e, value)}
                                                deleteIcon={
                                                    <CancelIcon onMouseDown={(event) => event.stopPropagation()} />
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
                    )}
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
                {error.issues ? (
                    <p style={{ textAlign: "center" }}>No Data found</p>
                ) : (
                    <PaginatedTable
                        loading={loading}
                        data={issues}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        columns={tableColumns}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                )}
            </div>
        </div>
    );
};

export default Issues;
