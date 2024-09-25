export const getStatusOptions = (tableData) => [
    { value: 'all', label: 'All', count: tableData.length },
    { value: 'Active', label: 'Active', count: tableData.filter((item) => item.status === 'Active').length },
    { value: 'Suspended', label: 'Suspended', count: tableData.filter((item) => item.status === 'Suspended').length },
  ];
  