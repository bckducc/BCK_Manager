import { useMemo, useState } from 'react';
import { Pagination } from 'antd';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const DEFAULT_PAGE_SIZE = 10;

const TableContainer = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.md};
  overflow: hidden;
  max-width: 100%;
`;

const TableScroll = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.borderLight};
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 720px;
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
    vertical-align: top;
    overflow-wrap: anywhere;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    min-width: 640px;
    font-size: ${theme.fontSize.sm};

    th,
    td {
      padding: ${theme.spacing.sm} ${theme.spacing.md};
    }
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }
`;

export interface TableColumn<T extends object> {
  key: string;
  title: string;
  render?: (value: unknown, record: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T extends object> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  pageSize?: number;
}

export const Table = <T extends object>({
  columns,
  data,
  loading = false,
  emptyText = 'No data',
  pageSize = DEFAULT_PAGE_SIZE,
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const visiblePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (visiblePage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, pageSize, visiblePage]);

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
            {paginatedData.map((record, idx) => (
              <tr key={idx}>
                {columns.map((col) => {
                  const value = (record as Record<string, unknown>)[col.key];
                  return (
                    <td key={col.key}>
                      {col.render ? col.render(value, record) : (value as React.ReactNode)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableScroll>
      <PaginationWrapper>
        <Pagination
          current={visiblePage}
          pageSize={pageSize}
          total={data.length}
          showSizeChanger={false}
          onChange={setCurrentPage}
        />
      </PaginationWrapper>
    </TableContainer>
  );
};
