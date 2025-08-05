import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from "../../config";
type AttendanceRecord = {
    [month: string]: {
        [day: number]: string;
    };
};

export default function ViewSattendanceDetail() {


    const { id } = useParams();

    const [student, setStudent] = useState<any>(null);
    const [attendance, setAttendance] = useState<AttendanceRecord>({});
    const [summary, setSummary] = useState<any>({});

    useEffect(() => {
    axios.get(`${BASE_URL}/students/${id}`)
      .then(res => setStudent(res.data))
      .catch(err => console.error(err));

    axios.get(`${BASE_URL}/sattendance/${id}`)
      .then(res => {
        setAttendance(res.data.attendance);
        setSummary(res.data.summary);
      })
      .catch(err => console.error(err));
    }, [id]);

    if (!student || Object.keys(attendance).length === 0) return <p>Loading...</p>;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);


  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <div className="space-x-2">
          <button className="bg-red-500 text-white px-3 py-1 rounded">Print</button>
          <button className="bg-red-500 text-white px-3 py-1 rounded">PDF Preview</button>
          <button className="bg-red-500 text-white px-3 py-1 rounded">Send PDF to Mail</button>
        </div>
        <div className="text-sm text-right">
          Dashboard / <span className="text-blue-600">Student Attendance</span> / <span className="font-semibold">View</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="bg-white shadow rounded p-4 text-center ">
          <img
            src={`http://localhost:5000/uploads/${student.photo}`}
            alt={student.name}
            className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
          />
          <h2 className="text-xl font-semibold">{student.name}</h2>
          <p className="text-gray-600">Student</p>
          <div className="mt-4 space-y-1 text-left text-sm">
            <p><strong>Register No:</strong> {student.registerNo}</p>
            <p><strong>Roll:</strong> {student.roll}</p>
            <p><strong>Class:</strong> {student.className}</p>
            <p><strong>Section:</strong> {student.section}</p>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="col-span-2 bg-white shadow rounded p-4 overflow-auto">
          <h3 className="font-semibold text-lg mb-2">Attendance</h3>
          <table className="min-w-full text-xs border">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border px-2 py-1">#</th>
                {days.map((day) => (
                  <th key={day} className="border px-2 py-1">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
                {months.map((month) => (
                    <tr key={month} className="text-center">
                    <td className="border px-2 py-1 font-semibold">{month}</td>
                    {days.map((day) => {
                        const status = attendance[month]?.[day] || "N/A";

                        let bgColor = "";
                        switch (status) {
                        case "P":
                            bgColor = "bg-green-500";
                            break;
                        case "A":
                            bgColor = "bg-red-500";
                            break;
                        case "LP":
                            bgColor = "bg-gray-500";
                            break;
                        case "LPE":
                            bgColor = "bg-yellow-500";
                            break;
                        case "W":
                            bgColor = "bg-blue-200";
                            break;
                        case "H":
                            bgColor = "bg-purple-500";
                            break;
                        default:
                            bgColor = "text-gray-400";
                            break;
                        }

                        return (
                        <td key={day} className={`border px-1 py-1 ${bgColor}`}>
                            {status}
                        </td>
                        );
                    })}
                    </tr>
                ))}
                </tbody>

          </table>

          {/* Summary */}
          <div className="text-sm mt-2 text-gray-700">
            Total Holiday: {summary.holiday || 0}, Total Weekend: {summary.weekend || 0}, Total Leave: {summary.leave || 0}, Total Present: {summary.present || 0}, Total Late With Excuse: {summary.lateWithExcuse || 0}, Total Late: {summary.late || 0}, Total Absent: {summary.absent || 0}
          </div>
        </div>
      </div>
    </div>
  );
}
