"use client";

import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

interface IProps {
  setAppliedFilters: (a: string[]) => void;
  setSelectedRows: (r: DataRow[]) => void;
}

const DataTable = ({setAppliedFilters, setSelectedRows}: IProps) => {
  const [rowData, setRowData] = useState<any[]>([]);

  const [columnDefs] = useState<ColDef[]>([
    { field: "athlete" },
    { field: "age", filter: "agNumberColumnFilter", maxWidth: 100 },
    { field: "date", filter: "agDateColumnFilter", maxWidth: 180 },
    { field: "country", filter: "agSetColumnFilter" },
    { field: "sport", filter: "agMultiColumnFilter" },
    { field: "gold", filter: "agNumberColumnFilter" },
    { field: "silver", filter: "agNumberColumnFilter" },
    { field: "bronze", filter: "agNumberColumnFilter" },
    { field: "total", filter: "agNumberColumnFilter" },
  ]);

  const onFilterChanged = (event: any) => {
    const allFilters = event.api.getFilterModel();
    console.log(allFilters);
    const filterChips: string[] = [];

    // Loop over all filters and add the applied filters to the chips list
    for (const colId in allFilters) {
      const filterModel = allFilters[colId];
      if (filterModel) {
        filterChips.push(`${colId?.toUpperCase()}: ${filterModel.type} ${filterModel.filter}`);
      }
    }
    setAppliedFilters(filterChips);
  };

  const onSelectionChanged = (event: any) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedRows(selectedRows);
  };

  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((result) => result.json()) 
      .then((rowData) => setRowData(rowData)); 
  }, []);

  return (
    <AgGridReact 
        rowData={rowData} 
        columnDefs={columnDefs} 
        rowSelection={{mode: 'multiRow'}} 
        onFilterChanged={onFilterChanged}
        onSelectionChanged={onSelectionChanged}
    />
  );
};

export default DataTable;
