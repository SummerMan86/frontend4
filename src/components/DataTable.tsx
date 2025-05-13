import React from 'react';
import { Table } from '@mantine/core';

interface RowData {
  name: string;
  age: number;
  email: string;
}

const mockData: RowData[] = [
  { name: 'John Doe', age: 28, email: 'john@example.com' },
  { name: 'Jane Smith', age: 34, email: 'jane@example.com' },
  { name: 'Alice Johnson', age: 24, email: 'alice@example.com' },
];

export function DataTable() {
  const rows = mockData.map((row, idx) => (
    <tr key={idx}>
      <td>{row.name}</td>
      <td>{row.age}</td>
      <td>{row.email}</td>
    </tr>
  ));

  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
