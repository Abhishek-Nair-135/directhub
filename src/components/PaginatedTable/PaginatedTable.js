import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
} from "@mui/material";
import { Link } from "react-router-dom";

const PaginatedTable = ({
    data,
    page,
    rowsPerPage,
    sortByPopularity,
    order,
    sortHandler,
    handleChangePage,
    handleChangeRowsPerPage,
}) => {
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="data list">
                <TableHead>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Assignee</TableCell>
                    <TableCell align="right">
                        {" "}
                        {sortByPopularity ? (
                            <TableSortLabel active={sortByPopularity} direction={order} onClick={sortHandler}>
                                No. of Comments
                            </TableSortLabel>
                        ) : (
                            "No. of Comments"
                        )}
                    </TableCell>
                </TableHead>
                <TableBody>
                    {data.length > 0 &&
                        data.map((row) => (
                            <TableRow key={row.title}>
                                <TableCell component="th" scope="row">
                                    <Link to={`${row.number}`}>{row.title}</Link>
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {row.assignee?.avatar_url ? (
                                        <img src={`${row.assignee.avatar_url}&s=20`} />
                                    ) : (
                                        row.assignee.avatar_url.login
                                    )}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {row.comments}
                                </TableCell>
                            </TableRow>
                        ))}

                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                            colSpan={3}
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                    "aria-label": "rows per page",
                                },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
};

export default PaginatedTable;
