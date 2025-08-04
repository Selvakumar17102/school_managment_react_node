import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

type Mark = {
  subjectName: string;
  examName: string;
  examMark: number;
  attendance: number;
  classTest: number;
  assignment: number;
  totalMark: number;
  gradePoint: string;
  gradeName: string;
  highestMarks?: {
    exam: number;
    attendance: number;
    classTest: number;
    assignment: number;
  };
};

export default function ViewMarkDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [groupedMarks, setGroupedMarks] = useState<{ [examName: string]: Mark[] }>({});

  useEffect(() => {
    fetch(`http://localhost:5000/api/view-student-profile/${id}`)
      .then(res => res.json())
      .then(data => setStudent(data))
      .catch(err => console.error("Profile error:", err));

    fetch(`http://localhost:5000/api/view-mark-details/${id}`)
      .then(res => res.json())
      .then(data => {
        
        setGroupedMarks(data);
      })
      .catch(err => console.error("Marks error:", err));
  }, [id]);

  if (!student) return <p>Loading...</p>;

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
          Dashboard / <span className="text-blue-600">Mark</span> / <span className="font-semibold">View</span>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="bg-white shadow rounded p-4 text-center">
          <img
            src={`http://localhost:5000/uploads/${student.photo}`}
            alt={student.name}
            className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
          />
          <h2 className="text-xl font-semibold">{student.name}</h2>
          <p className="text-gray-600">Student</p>
          <div className="mt-4 text-left text-sm space-y-1">
            <p><strong>Register NO:</strong> {student.registerNo}</p>
            <p><strong>Roll:</strong> {student.roll}</p>
            <p><strong>Class:</strong> {student.className}</p>
            <p><strong>Section:</strong> {student.section}</p>
          </div>
        </div>

        {/* Mark Tables */}
        <div className="col-span-2 space-y-6">
          {Object.entries(groupedMarks).map(([examName, marks]) => {
            const totalMax = marks.length * 100;
            const totalObtained = marks.reduce((sum, m) => sum + (m.totalMark || 0), 0);
            const totalGPA = marks.reduce((sum, m) => sum + (parseFloat(m.gradePoint) || 0), 0);

            const avg = marks.length ? (totalObtained / marks.length).toFixed(2) : 0;
            const avgGPA = marks.length ? (totalGPA / marks.length).toFixed(2) : 0;

            return (
              <div key={examName} className="bg-white shadow rounded p-4">
                <h3 className="text-lg font-bold mb-2">{examName}</h3>
                <div className="overflow-x-auto">
                <table className="min-w-full border text-xs">
                  <thead className="bg-gray-100 text-center">
                    <tr>
                      <th className="border px-2 py-2" rowSpan={2}>Subject</th>
                      <th className="border px-2 py-2" colSpan={2}>Exam</th>
                      <th className="border px-2 py-2" colSpan={2}>Attendance</th>
                      <th className="border px-2 py-2" colSpan={2}>Class Test</th>
                      <th className="border px-2 py-2" colSpan={2}>Assignment</th>
                      <th className="border px-2 py-2" colSpan={3}>Total</th>
                    </tr>
                    <tr>
                      <th className="border px-2 py-2">Obtained</th>
                      <th className="border px-2 py-2">Highest</th>
                      <th className="border px-2 py-2">Obtained</th>
                      <th className="border px-2 py-2">Highest</th>
                      <th className="border px-2 py-2">Obtained</th>
                      <th className="border px-2 py-2">Highest</th>
                      <th className="border px-2 py-2">Obtained</th>
                      <th className="border px-2 py-2">Highest</th>
                      <th className="border px-2 py-2">Mark</th>
                      <th className="border px-2 py-2">Point</th>
                      <th className="border px-2 py-2">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((m, i) => (
                      <tr key={i} className="text-center">
                        <td className="border px-2 py-2">{m.subjectName}</td>
                        <td className="border px-2 py-2">{m.examMark}</td>
                        <td className="border px-2 py-2">{m.highestMarks?.exam || 70}</td>
                        <td className="border px-2 py-2">{m.attendance}</td>
                        <td className="border px-2 py-2">{m.highestMarks?.attendance || 10}</td>
                        <td className="border px-2 py-2">{m.classTest}</td>
                        <td className="border px-2 py-2">{m.highestMarks?.classTest || 10}</td>
                        <td className="border px-2 py-2">{m.assignment}</td>
                        <td className="border px-2 py-2">{m.highestMarks?.assignment || 10}</td>
                        <td className="border px-2 py-2">{m.totalMark}</td>
                        <td className="border px-2 py-2">{m.gradePoint}</td>
                        <td className="border px-2 py-2">{m.gradeName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>

                <div className="text-sm mt-2 text-gray-700 font-semibold">
                  Total Marks: <span className="font-bold text-red-600">{totalMax}</span> | 
                  Total Obtained Marks: <span className="font-bold text-red-600">{totalObtained}</span> | 
                  Total Average Marks (%): <span className="font-bold text-red-600">{avg}</span> | 
                  GPA: <span className="font-bold text-red-600">{avgGPA}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
