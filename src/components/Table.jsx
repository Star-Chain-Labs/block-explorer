import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Table = ({ columns = [], data = [], navigatePath, navigateState }) => {
  const navigate = useNavigate();

  const handleRowClick = (e) => {
    if (navigatePath) {
      navigate(`${navigatePath}`, navigateState);
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-xl border border-gray-200">
      <div className="overflow-auto rounded-lg whitespace-nowrap">
        <DataTable
          value={data}
          paginator
          rows={100}
          stripedRows
          showGridlines
          size="small"
          className="custom-table"
          onRowClick={handleRowClick}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
          rowsPerPageOptions={[5, 10, 20]}
          tableStyle={{ minWidth: "50rem" }}
        >
          {columns.map((col, index) => (
            <Column
              key={index}
              field={col.field}
              header={col.header}
              sortable={col.sortable ?? true}
              body={
                col.body ||
                (col.field === "status"
                  ? (rowData) => {
                      let color = "gray";
                      if (
                        rowData.status === "Active" ||
                        rowData.status === "Completed"
                      )
                        color = "green";
                      else if (
                        rowData.status === "Inactive" ||
                        rowData.status === "Failed"
                      )
                        color = "red";
                      else if (rowData.status === "Pending") color = "orange";

                      return (
                        <span
                          className="px-2 py-1 rounded-full text-white text-sm capitalize"
                          style={{ backgroundColor: color }}
                        >
                          {rowData.status}
                        </span>
                      );
                    }
                  : undefined)
              }
              style={{
                minWidth: col.minWidth || "150px",
                textAlign: col.align || "left",
              }}
            />
          ))}
        </DataTable>
      </div>
    </div>
  );
};

export default Table;
