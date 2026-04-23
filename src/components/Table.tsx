import styled from 'styled-components';
import { theme } from '../styles/theme';

const TableContainer = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.md};
  overflow: hidden;
`;

const TableScroll = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${theme.fontSize.base};

  thead {
    background-color: ${theme.colors.lightBg};
    border-bottom: 2px solid ${theme.colors.borderLight};
  }

  th {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    text-align: left;
    font-weight: ${theme.fontWeight.semibold};
    color: ${theme.colors.dark};
  }

  tbody tr {
    border-bottom: 1px solid ${theme.colors.borderLight};
    transition: background-color ${theme.transition.base};

    &:hover {
      background-color: ${theme.colors.lightBg};
    }
  }

  td {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    color: ${theme.colors.text};
  }
`;

const SkeletonLoader = styled.div`
  padding: ${theme.spacing.lg};
  text-align: center;
  
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  background: linear-gradient(
    to right,
    ${theme.colors.lightBg} 8%,
    ${theme.colors.borderLight} 18%,
    ${theme.colors.lightBg} 33%
  );
  background-size: 800px 100%;
  animation: shimmer 1.5s infinite;
  height: 200px;
  border-radius: ${theme.radius.md};
`;

const EmptyState = styled.div`
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.textSecondary};
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.md};
`;

export interface TableColumn {
  key: string;
  title: string;
  render?: (value: any, record: any) => React.ReactNode;
  width?: string;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  emptyText?: string;
}

export const Table = ({
  columns,
  data,
  loading = false,
  emptyText = 'No data',
}: TableProps) => {
  if (loading) {
    return <SkeletonLoader />;
  }

  if (data.length === 0) {
    return <EmptyState>{emptyText}</EmptyState>;
  }

  return (
    <TableContainer>
      <TableScroll>
        <StyledTable>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ width: col.width }}>
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((record, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(record[col.key], record) : record[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableScroll>
    </TableContainer>
  );
};
