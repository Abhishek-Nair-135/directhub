import {
    CircularProgress,
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
import { useCallback } from "react";
import { Link } from "react-router-dom";

const PaginatedTable = ({
    loading,
    data,
    page,
    rowsPerPage,
    columns,
    order,
    sortHandler,
    handleChangePage,
    handleChangeRowsPerPage,
}) => {
    const generateTableRows = useCallback(() => {
        const rows = [];

        for (let dataItems of data) {
            const cells = [];
            for (let column of columns) {
                let cellElem;
                if (dataItems[column.name].type === "number" || dataItems[column.name].type === "string") {
                    cellElem = <p>{dataItems[column.name].data}</p>;
                } else if (dataItems[column.name].type === "link") {
                    cellElem = <Link to={`${dataItems.number}`}>{dataItems[column.name].data}</Link>;
                } else if (dataItems[column.name].type === "url") {
                    cellElem = <img src={dataItems[column.name].data} />;
                }
                cells.push(<TableCell align={column.align}>{cellElem}</TableCell>);
            }
            rows.push(<TableRow>{cells}</TableRow>);
        }

        return rows;
    }, [...data, ...columns]);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="data list">
                <TableHead>
                    {columns.map((col) => (
                        <TableCell align={col.align}>
                            {col.sortable ? (
                                <TableSortLabel active={col.sortable} direction={order} onClick={sortHandler}>
                                    {col.name}
                                </TableSortLabel>
                            ) : (
                                col.name
                            )}
                        </TableCell>
                    ))}
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                                <CircularProgress />
                            </TableCell>
                        </TableRow>
                    ) : (
                        <>
                            {generateTableRows()}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                            colSpan={columns.length}
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
