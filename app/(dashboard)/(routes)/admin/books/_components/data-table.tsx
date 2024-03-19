"use client"

import * as React from "react";
import { useState } from "react";

import jsPDF from "jspdf";
import "jspdf-autotable";

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
import { PlusCircle } from "lucide-react";
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
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


  const downloadPDF = async () => {
    const pdf = new jsPDF() as any;
  
    pdf.setFontSize(14);
  
    const logoImg = new Image();
    logoImg.src = '/logoautomas4.png';
    logoImg.onload = async () => {
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
      pdf.setFontSize(12);
      pdf.text("Books", 10, titleY);
  
      // Aggregate table data from all pages
      const tableData: string[][] = [];
      let currentPage = 1;
  
      while (true) {
        const nextPageButton = document.querySelector('.books-data-table .rt-next button');
        if (nextPageButton && !nextPageButton.classList.contains("rt-disabled")) {
          currentPage++;
          await new Promise<void>((resolve) => {
            (nextPageButton as HTMLButtonElement).click();
            setTimeout(() => resolve(), 500);
          });
        } else {
          break;
        }
      }      
  
      const tableElement: HTMLElement | null = document.querySelector(".books-data-table ");
      if (tableElement) {
        const rows = tableElement.querySelectorAll("tr");
        rows.forEach((row) => {
          const rowData: string[] = [];
          row.querySelectorAll("td").forEach((cell) => {
            rowData.push(cell.innerText);
          });
          tableData.push(rowData);
        });
  
        pdf.autoTable({
          startY: titleY + 5,
          head: [['Title', 'Author', 'Publisher', 'Date Added']],
          body: tableData,
        });
  
        pdf.save("books_report.pdf");
      }
    };
  };
  
  

  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Search by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Link href="/admin/create">
          <Button variant="ghost">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add book
          </Button>
        </Link>
      </div>
      <div className="rounded-md border">
        <Table className="books-data-table">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
