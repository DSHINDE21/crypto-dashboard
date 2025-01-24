import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
} from '@mui/material';

type DataTableProps = {
  data: any[];
  columns: ColumnDef<any, any>[];
  isLoading: boolean;
};
// TODO: Disble sortBy
const DataTable: React.FC<DataTableProps> = ({ data, columns, isLoading }) => {
  const [columnFilters, setColumnFilters] = React.useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-2" style={{ backgroundColor: '#f5f5f5' }}>
      {data?.length === 0 ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            color: '#757575',
          }}
        >
          No Data Found
        </div>
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      sortDirection={
                        header.column.getIsSorted() ? 'asc' : 'desc'
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <TableSortLabel
                          active={header.column.getIsSorted() !== false}
                          direction={
                            header.column.getIsSorted()
                              ? header.column.getIsSorted() === 'desc'
                                ? 'desc'
                                : 'asc'
                              : 'asc'
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </TableSortLabel>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <div className="h-2" />
      <div className="flex items-center gap-2">
        <TablePagination
          component="div"
          count={table.getFilteredRowModel().rows.length}
          page={table.getState().pagination.pageIndex}
          onPageChange={(e, newPage) => table.setPageIndex(newPage)}
          rowsPerPage={table.getState().pagination.pageSize}
          onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
        />
      </div>
    </div>
  );
};

export default DataTable;
