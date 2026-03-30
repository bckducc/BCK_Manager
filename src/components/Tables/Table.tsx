import styles from '../../styles/tables.module.css';

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
    return <div className={styles.loading}>Loading...</div>;
  }

  if (data.length === 0) {
    return <div className={styles.tableEmpty}>{emptyText}</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
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
        </table>
      </div>
    </div>
  );
};
