import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";

import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import "jspdf";
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  email: string;
  status: string;
}


const tableData: Order[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      role: "Web Designer",
    },
    email: "Agency Website",
    status: "Active",
  }
];




type SortColumn = "user" | "projectName" | "status" | "budget" | null;
type SortDirection = "asc" | "desc";

export default function BasicTableOne() {

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 2;

  const [searchQuery, setSearchQuery] = useState("");

  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const filteredData = useMemo(() => {
    if (!searchQuery) return tableData;

    const lowerQuery = searchQuery.toLowerCase();

    return tableData.filter((order) => {
      return (
        order.user.name.toLowerCase().includes(lowerQuery) ||
        order.email.toLowerCase().includes(lowerQuery) ||
        order.status.toLowerCase().includes(lowerQuery)
      );
    });
  }, [searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aVal: string = "";
      let bVal: string = "";

      switch (sortColumn) {
        case "user":
          aVal = a.user.name.toLowerCase();
          bVal = b.user.name.toLowerCase();
          break;
        case "status":
          aVal = a.status.toLowerCase();
          bVal = b.status.toLowerCase();
          break;
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const pagedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sorting handler for column header click
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };


  // Exports

  // Export Excel
  const exportExcel = () => {
    const dataForExcel = sortedData.map((order, index) => ({
      "S.No": index + 1,
      User: order.user.name,
      "Email": order.email,
      Status: order.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "students.xlsx");
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    const tableColumn = ["S.No", "User", "Project Name", "Status", "Budget"];
    const tableRows: (string | number)[][] = [];

    sortedData.forEach((order, index) => {
      const row = [
        index + 1,
        order.user.name,
        order.email,
        order.status,
      ];
      tableRows.push(row);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.text("Order Table", 14, 15);
    doc.save("student.pdf");
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    let copyText = "S.No\tUser\tProject Name\tStatus\tBudget\n";
    sortedData.forEach((order, index) => {
      copyText += `${index + 1}\t${order.user.name}\t${order.email}\t${order.status}\n`;
    });

    navigator.clipboard.writeText(copyText);
    alert("Table copied to clipboard!");
  };

  // Print
  const printTable = () => {
    const printContent = document.getElementById("printable-table")?.outerHTML;
    if (!printContent) return;

    const newWindow = window.open("", "", "width=900,height=700");
    if (!newWindow) return;
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Table</title>
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortColumn, sortDirection]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={exportExcel}
        >
          Export Excel
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={exportPDF}
        >
          Export PDF
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={copyToClipboard}
        >
          Copy
        </button>
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          onClick={printTable}
        >
          Print
        </button>

        <input
          type="text"
          className="p-2 border rounded w-64 ml-auto"
          placeholder="Search user, project, status or budget..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader 
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                S/No
              </TableCell>
              <TableCell isHeader 
                onClick={() => handleSort("user")} 
                className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none ${
                  sortColumn === "user" ? "underline" : ""
                }`}
              >
                User {sortColumn === "user" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
              </TableCell>
              <TableCell isHeader
                className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none`}
              >
                Email
              </TableCell>
              <TableCell isHeader
                onClick={() => handleSort("status")}
                className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none ${
                  sortColumn === "status" ? "underline" : ""
                }`}
              >
                Status {sortColumn === "status" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
              </TableCell>
              <TableCell isHeader
                className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none `}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {pagedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-4">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              pagedData.map((order,index) => (
                <TableRow key={order.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                          width={40}
                          height={40}
                          src={order.user.image}
                          alt={order.user.name}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.user.name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {order.user.role}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        order.status === "Active"
                          ? "success"
                          : order.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.budget}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
}

