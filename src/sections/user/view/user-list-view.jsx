import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { UserTableRow } from '../user-table-row';
import { UserTableToolbar } from '../user-table-toolbar';
import { UserTableFiltersResult } from '../user-table-filters-result';
import { useDispatch, useSelector } from 'react-redux';
import { userList } from 'src/store/action/userActions';
import { Typography } from '@mui/material';
import { UserCreateForm } from './user-create-form';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'Name', label: 'Name' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'Address', label: 'Address' },
  { id: 'role', label: 'Role' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Actions' },
];
// ----------------------------------------------------------------------

export function UserListView() {
  const table = useTable();
  const router = useRouter();
  const confirm = useBoolean();
  const dispatch = useDispatch();

  const _userList = useSelector((state) => state.user?.user || []);
  const [tableData, setTableData] = useState(_userList);

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Update the initial state to include lastName, email, and mobile
  const filters = useSetState({ firstName: '', lastName: '', email: '', mobile: '', status: 'all' });
  const STATUS_OPTIONS = [
    { value: 'all', label: 'All', count: tableData.length },
    { value: 'Active', label: 'Active', count: tableData.filter((item) => item.status === 'Active').length },
    { value: 'Suspended', label: 'Suspended', count: tableData.filter((item) => item.status === 'Suspended').length }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(userList());
      } catch (error) {
        toast.error('Failed to fetch user data');
      }
    };

    fetchData();
  }, [dispatch]);

  // Update table data whenever user list changes
  useEffect(() => {
    setTableData(_userList);
  }, [_userList]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const canReset = !!filters.state.searchTerm || filters.state.status !== 'all';
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      toast.success('Delete success!');
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    toast.success('Delete success!');
    setTableData(deleteRows);
    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );



  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Users', href: paths?.dashboard?.user?.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              // href={paths?.dashboard?.user?.new}
              onClick={handleOpenDialog} // Open the dialog on click
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New user
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <UserCreateForm open={openDialog} onClose={handleCloseDialog} />

        <Card>
          <Tabs value={filters.state.status} onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={tab.value === filters.state.status ? 'filled' : 'soft'}
                    color={
                      (tab.value === 'Active' && 'success') ||
                      (tab.value === 'Suspended' && 'error') ||
                      (tab.value === 'all' && 'default') || 'default'
                    }
                  >
                    {tab.count} {/* Display the count for each status */}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <UserTableToolbar filters={filters} onResetPage={table.onResetPage} />
          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered.slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  ).map((row) => (
                    <UserTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                    />
                  ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onPageChange}
            onRowsPerPageChange={table.onRowsPerPageChange}
            sx={{ px: 2.5, pb: 2 }}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete users?"
        content={
          <Box>
            <Typography gutterBottom>Are you sure you want to delete the selected users?</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              This action cannot be undone.
            </Typography>
          </Box>
        }
        action={
          <Button onClick={handleDeleteRows} variant="contained" color="error">
            Delete
          </Button>
        }
      />
    </>
  );
}

// Filtering function
function applyFilter({ inputData, comparator, filters }) {
  const { searchTerm, status } = filters;
  // Start by filtering based on status
  let filteredData = inputData;
  // Filter by status (only filter if the status is not 'all')
  if (status !== 'all') {
    filteredData = filteredData.filter((item) => item.status === status);
  }
  // If there's a search term, filter by first name, last name, or email
  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();

    filteredData = filteredData.filter((item) =>
      item.firstName.toLowerCase().includes(lowerSearchTerm) ||
      item.lastName.toLowerCase().includes(lowerSearchTerm) ||
      item.email.toLowerCase().includes(lowerSearchTerm)
    );
  }

  // Sort the filtered data using the comparator
  return filteredData.sort(comparator);
}
