import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../config";

type ClassOption = {
  id: string;
  className: string;
};

type SectionOption = {
  id: string;
  sectionName: string;
};

type ExamSchedule = {
  id: number;
  examName: string;
  className: string;
  sectionId: string;
  sectionName: string;
  subjectName: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  room: string;
};

export default function BasicTableExamSchedule() {

  const navigate = useNavigate();

  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [sectionOptions, setSectionOptions] = useState<SectionOption[]>([]);
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<ExamSchedule[]>([]);
  const [search, setSearch] = useState("");


  useEffect(() => {
    fetch(`${BASE_URL}/classlist`)
      .then((res) => res.json())
      .then(setClassOptions);
  }, []);

  useEffect(() => {
    if (classId) {
      fetch(`${BASE_URL}/examschedulelist/${classId}`)
        .then((res) => res.json())
        .then((data) => {
          setExamSchedules(data);
          setFilteredSchedules(data);
        });

      fetch(`${BASE_URL}/getsectionsbyclass/${classId}`)
        .then((res) => res.json())
        .then(setSectionOptions);

      setSectionId("");
    }
  }, [classId]);

  const handleSectionTab = (sectionId: string) => {
    setSectionId(sectionId);
    if (!sectionId) {
      setFilteredSchedules(examSchedules);
    } else {
      setFilteredSchedules(
        examSchedules.filter((s) => s.sectionId === sectionId)
      );
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/editExamSchedule/${id}`);
  };


  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <a href="/addExamSchedule" className="text-blue-600 font-semibold">
          ➕ Add a exam schedule
        </a>
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Class</option>
          {classOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.className}
            </option>
          ))}
        </select>
      </div>

      {sectionOptions.length > 0 && (
        <div className="mb-4 border-b">
          <button
            onClick={() => handleSectionTab("")}
            className={`mr-4 py-2 px-3 border-b-2 ${
              sectionId === "" ? "border-blue-600 text-blue-600" : "border-transparent"
            }`}
          >
            All Exam Schedules
          </button>
          {sectionOptions.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionTab(section.id)}
              className={`mr-4 py-2 px-3 border-b-2 ${
                sectionId === section.id ? "border-blue-600 text-blue-600" : "border-transparent"
              }`}
            >
            {section.sectionName}
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
              <th className="border px-2 py-1">Exam Name</th>
              <th className="border px-2 py-1">Class</th>
              <th className="border px-2 py-1">Section</th>
              <th className="border px-2 py-1">Subject</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Time</th>
              <th className="border px-2 py-1">Room</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-4">
                  No data available
                </td>
              </tr>
            ) : (
              filteredSchedules.map((item, idx) => (
                <tr key={item.id}>
                  <td className="border px-2 py-1">{idx + 1}</td>
                  <td className="border px-2 py-1">{item.examName}</td>
                  <td className="border px-2 py-1">{item.className}</td>
                  <td className="border px-2 py-1">{item.sectionName}</td>
                  <td className="border px-2 py-1">{item.subjectName}</td>
                  <td className="border px-2 py-1">{item.date}</td>
                  <td className="border px-2 py-1">
                    {item.timeFrom} - {item.timeTo}
                  </td>
                  <td className="border px-2 py-1">{item.room}</td>
                  <td className="border px-2 py-1">
                    <button className="text-yellow-600 mr-2" onClick={() => handleEdit(item.id)}>✏️</button>
                    <button className="text-red-600">🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
