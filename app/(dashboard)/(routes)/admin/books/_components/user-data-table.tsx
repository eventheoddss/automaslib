"use client"

import "typeface-inter";

import * as React from "react";
import { useState } from "react";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { 
  ColumnDef, 
  ColumnFiltersState, 
  SortingState, 
  flexRender, 
  getCoreRowModel, 
  getFilteredRowModel, 
  getPaginationRowModel, 
  getSortedRowModel, 
  useReactTable 
} from "@tanstack/react-table";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function UserDataTable<TData, TValue>({ columns, data }: UserDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [durationFilter, setDurationFilter] = useState<string>("");
  const [filteredData, setFilteredData] = useState<TData[]>(data);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleDurationFilterChange = (value: string) => {
    setDurationFilter(value);
    const currentDate = new Date();
    let updatedFilteredData = [...data];

    switch (value) {
      case "24h":
        updatedFilteredData = data.filter((item: any) => {
          const createdAt = new Date(item.createdAt);
          const timeDifference = currentDate.getTime() - createdAt.getTime();
          const hoursDifference = timeDifference / (1000 * 3600);
          return hoursDifference <= 24;
        });
        break;
      case "1w":
        updatedFilteredData = data.filter((item: any) => {
          const createdAt = new Date(item.createdAt);
          const timeDifference = currentDate.getTime() - createdAt.getTime();
          const daysDifference = timeDifference / (1000 * 3600 * 24);
          return daysDifference <= 7;
        });
        break;
      case "1m":
        updatedFilteredData = data.filter((item: any) => {
          const createdAt = new Date(item.createdAt);
          const timeDifference = currentDate.getTime() - createdAt.getTime();
          const daysDifference = timeDifference / (1000 * 3600 * 24);
          return daysDifference <= 30;
        });
        break;
      default:
        break;
    }

    setFilteredData(updatedFilteredData);
  };

const downloadPDF = () => {
  const pdf = new jsPDF() as any;
  
  pdf.setFontSize(14);
  
  const logoImg = new Image();
  logoImg.src = '/logoautomas4.png';
  logoImg.onload = () => {
    const logoWidth = 50; 
    const logoHeight = 10; 
    const x = (pdf.internal.pageSize.getWidth() - logoWidth) / 2;
    const y = 10;
    pdf.addImage(logoImg, 'PNG', x, y, logoWidth, logoHeight);

    const orgNameY = y + logoHeight + 10;
    pdf.text("Automas Library", pdf.internal.pageSize.getWidth() / 2, orgNameY, { align: "center" });
    
    const currentDate = new Date().toLocaleDateString();
    const dateY = orgNameY + 10; 
    pdf.setFontSize(10)
    pdf.text("Date: " + currentDate, pdf.internal.pageSize.getWidth() / 2, dateY, { align: "center" });
    
    const titleY = dateY + 10;
    pdf.setFontSize(12)
    pdf.text("User Report", 10, titleY);
    
    const tableData: string[][] = [];
    const table = document.querySelector(".user-data-table");
    if (table) {
      const rows = table.querySelectorAll("tr");
      rows.forEach((row) => {
        const rowData: string[]= [];
        row.querySelectorAll("td").forEach((cell) => {
          rowData.push(cell.innerText);
        });
        tableData.push(rowData);
      });

      pdf.autoTable({
        startY: titleY + 7,
        head: [['Name', 'Email', 'Role', 'Created At']],
        body: tableData,
      });

      pdf.save("user_report.pdf");
    }
  };
};

  
  
  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Search by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="relative">
          <select
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            value={durationFilter}
            onChange={(e) => handleDurationFilterChange(e.target.value)}
          >
            <option value="">All</option>
            <option value="24h">Last 24 hours</option>
            <option value="1w">Last 1 week</option>
            <option value="1m">Last 1 month</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M10 12L4 6h12z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table className="user-data-table">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No matches found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={downloadPDF}
        >
          Download PDF
        </Button>
      </div>
    </div>
  );
}
