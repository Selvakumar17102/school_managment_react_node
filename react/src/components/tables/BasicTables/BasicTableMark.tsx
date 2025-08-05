import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../config";

type Student = {
  id: number;
  name: string;
  email: string;
  roll: number;
  photo?: string;
  classId: number;
  sectionId: number;
};

type Class = {
  id: number;
  className: string;
};

type Section = {
  id: number;
  sectionName: string;
};

export default function BasicTableMark() {

    const navigate = useNavigate();
  
  
    const [classes, setClasses] = useState<Class[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
  
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedSection, setSelectedSection] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");


  useEffect(() => {
    fetch(`${BASE_URL}/classlist`)
      .then(res => res.json())
      .then(setClasses)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedClass) return;

    fetch(`${BASE_URL}/studentsattendancelist?className=${selectedClass}`)
      .then(res => res.json())
      .then(setStudents)
      .catch(console.error);

    fetch(`${BASE_URL}/sectionlists/${selectedClass}`)
      .then(res => res.json())
      .then(setSections)
      .catch(console.error);

    setSelectedSection("");
    setActiveTab("all");
  }, [selectedClass]);

  useEffect(() => {
      if (!selectedClass) return;
      if (!selectedSection) return;
  
      fetch(`${BASE_URL}/studentsattendancelist?className=${selectedClass}&section=${selectedSection}`)
        .then(res => res.json())
        .then(setStudents)
        .catch(console.error);
    }, [selectedSection]);
  
    const filteredStudents = students.filter(student =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase())
    );
  
    const handleView = (student: Student) => {
      navigate(`/viewMarkDetails/${student.id}`);
    };


  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <a href="/add-mark" className="text-blue-600 font-semibold">
          ➕ Add a mark
        </a>
        <select
          className="border px-3 py-2 rounded"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.className}</option>
          ))}
        </select>
      </div>

      {sections.length > 0 && (
        <div className="flex gap-2 border-b pb-2 mb-4">
          <button
            className={`px-4 py-2 rounded-t ${activeTab === "all" ? "bg-teal-500 text-white" : "bg-gray-200"}`}
            onClick={() => {
              setActiveTab("all");
              setSelectedSection("");
            }}
          >
            All Students
          </button>
          {sections.map(sec => (
            <button
              key={sec.id}
              className={`px-4 py-2 rounded-t ${activeTab === String(sec.id) ? "bg-teal-500 text-white" : "bg-gray-200"}`}
              onClick={() => {
                setActiveTab(String(sec.id));
                setSelectedSection(String(sec.id));
              }}
            >
              {sec.sectionName}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded text-sm">Copy</button>
          <button className="px-3 py-1 border rounded text-sm">Excel</button>
          <button className="px-3 py-1 border rounded text-sm">CSV</button>
          <button className="px-3 py-1 border rounded text-sm">PDF</button>
        </div>
        <input
          type="text"
          placeholder="Search"
          className="border px-3 py-1 rounded text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1">Photo</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Roll</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={student.id}>
                  <td className="border px-2 py-1">{index + 1}</td>
                  <td className="border px-2 py-1">
                    <img
                      src={`http://localhost:5000/uploads/${student.photo}`}
                      alt="student"
                      className="w-8 h-8 rounded-full mx-auto"
                    />
                  </td>
                  <td className="border px-2 py-1">{student.name}</td>
                  <td className="border px-2 py-1">{student.roll}</td>
                  <td className="border px-2 py-1">{student.email}</td>
                  <td className="border px-2 py-1 text-center">
                    <button className="bg-teal-500 text-white px-2 py-1 rounded"
                    onClick={() => handleView(student)}
                    >
                      ✓
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-3">
                  Select class
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
