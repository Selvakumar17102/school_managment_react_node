import React, { useEffect,useState, useMemo } from "react";
import { Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from "../../../config";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

// import Badge from "../../ui/badge/Badge";

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
  classname: string;
  classteacher: string;
  type: string;
  passmark: string;
  finalmark: string;
  subjectname: string;
  subjectauthor: string;
  subjectcode: string;
}


export default function BasicTableSubject() {

  const navigate = useNavigate();

  const [tableData, setTableData] = useState<Order[]>([]);

  useEffect(() => {
    const fetchsubjects = async () => {
      try {
        const response = await fetch(`${BASE_URL}/subjectlist`);
        const data = await response.json();
      
        const formattedData: Order[] = data.map((subjects: any) => ({
          id: subjects.id,
          classname: subjects.Class.className,
          classteacher: subjects.Teacher.name,
          type: subjects.type,
          passmark: subjects.passmark,
          finalmark: subjects.finalmark,
          subjectname: subjects.subjectName,
          subjectauthor: subjects.subjectAuthor,
          subjectcode: subjects.subjectCode,
        }));


        setTableData(formattedData);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchsubjects();
  });


  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = useMemo(() => {
    if (!searchQuery) return tableData;
    const lowerQuery = searchQuery.toLowerCase();
    return tableData.filter((order) => {
      return (
        order.classname.toLowerCase().includes(lowerQuery) ||
        order.classteacher.toLowerCase().includes(lowerQuery) ||
        order.type.toLowerCase().includes(lowerQuery) ||
        order.passmark.toString().toLowerCase().includes(lowerQuery) ||
        order.finalmark.toString().toLowerCase().includes(lowerQuery) ||
        order.subjectname.toLowerCase().includes(lowerQuery) ||
        order.subjectauthor.toLowerCase().includes(lowerQuery) ||
        order.subjectcode.toLowerCase().includes(lowerQuery)
      );
    });
  }, [searchQuery, tableData]);


  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const pagedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  
  const exportExcel = () => {
    const dataForExcel = filteredData.map((order, index) => ({
      "S.No": index + 1,
      "Class Name": order.classname,
      "Class Teacher": order.classteacher,
      "Type": order.type,
      "Pass Mark": order.passmark,
      "Final Mark": order.finalmark,
      "Subject Name": order.subjectname,
      "Subject Author": order.subjectauthor,
      "Subject Code": order.subjectcode,
    }));


    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "subjects.xlsx");
  };

  const exportPDF = () => {
  const doc = new jsPDF();
  const tableColumn = ["S.No", "Class Name", "Class Teacher", "Type", "Pass Mark", "Final Mark", "Subject Name","Subject Author","Subject Code", "Action"];
  const tableRows: (string | number)[][] = [];

  filteredData.forEach((order, index) => {
    const row = [
      index + 1,
      order.classname,
      order.classteacher,
      order.type,
      order.passmark,
      order.finalmark,
      order.subjectname,
      order.subjectauthor,
      order.subjectcode,
    ];
    tableRows.push(row);
  });

  doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.text("subject Table", 14, 15);
    doc.save("subject.pdf");
  };

  const copyToClipboard = () => {
    let copyText = "S.No\tSubject Name\tSubject Author\tSubject Code\tType\tPass Mark\tFinal Mark\tClass Name\tClass Teacher\n";
    filteredData.forEach((order, index) => {
      copyText += `${index + 1}\t${order.subjectname}\t${order.subjectauthor}\t${order.subjectcode}\t${order.type}\t${order.passmark}\t${order.finalmark}\t${order.classname}\t${order.classteacher}\n`;
    });
    navigator.clipboard.writeText(copyText);
    alert("Table copied to clipboard!");
  };

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
  }, [searchQuery]);



  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      console.log("Deleted:", id);
    }
  };


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
          placeholder="Search user, email..."
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
                className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none`}>
                Subject Name
              </TableCell>
              <TableCell isHeader
                className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none`}>
                Subject Author
              </TableCell><TableCell isHeader
                className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none`}>
                Subject Code
              </TableCell>
              <TableCell isHeader
                className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none`}>
                Class Name
              </TableCell>
              <TableCell isHeader
                className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none`}>
                Class Teacher
              </TableCell>
              <TableCell isHeader
                className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none`}>
                Type
              </TableCell>
              <TableCell isHeader
                className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none`}>
                Pass Mark
              </TableCell>
              <TableCell isHeader
                className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none`}>
                Final Mark
              </TableCell>
              <TableCell isHeader
                className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none `}>
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
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.subjectname}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.subjectauthor}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.subjectcode}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.classname}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.classteacher}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.type}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.passmark}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.finalmark}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <div className="flex gap-3 items-center">
                      <button onClick={() => navigate(`/editsubject/${order.id}`)} title="Edit">
                        <Pencil className="w-5 h-5 text-green-500 hover:text-green-700" />
                      </button>
                      <button onClick={() => handleDelete(order.id)} title="Delete">
                        <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
                      </button>
                    </div>
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

