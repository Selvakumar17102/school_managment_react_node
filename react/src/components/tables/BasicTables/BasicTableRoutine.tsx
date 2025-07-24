import { useEffect,useState } from "react";




const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

type Routine = {
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    sectionId: number;
    room: string;
    subject?: {
      subjectName: string;
    };
    teacher?: {
      name: string;
    };
  };

  type Section = {
    id: number;
    sectionName: string;
    classId: number;
  };

  type Class = {
    id: number;
    className: string;
  };




export default function BasicTableRoutine() {

  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [activeTab, setActiveTab] = useState("All");


  useEffect(() => {
    fetch("http://localhost:5000/api/classlist")
      .then((res) => res.json())
      .then((data) => setClasses(data));
  }, []);

  useEffect(() => {
    if (classId) {
      fetch(`http://localhost:5000/api/sectionlist/${classId}`)
        .then((res) => res.json())
        .then(setSections);

      fetch(`http://localhost:5000/api/routineclass/${classId}`)
        .then((res) => res.json())
        .then(setRoutines);

      setActiveTab("All");
    }
  }, [classId]);

  


  const getRoutineForDaySection = (day: string, sectionId: number | string) => 
  routines
    .filter((r) => r.day === day && r.sectionId === sectionId)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));


  const visibleSections = activeTab === "All"
  ? sections
  : sections.filter((s) => s.id === Number(activeTab));


  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Class Routine</h2>
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.className}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      {sections.length > 0 && (
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${activeTab === "All" ? "border-b-2 border-teal-500 font-semibold" : ""}`}
            onClick={() => setActiveTab("All")}
          >
            All Routines
          </button>
          {sections.map((section) => (
            <button
              key={section.id}
              className={`px-4 py-2 ${activeTab === String(section.id) ? "border-b-2 border-teal-500 font-semibold" : ""}`}
              onClick={() => setActiveTab(String(section.id))}
            >
              {section.sectionName}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          {/* <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Day</th>
              {visibleSections.map((sec) => (
                <th key={sec.id} className="px-4 py-2 border text-center">
                  {sec.sectionName}
                </th>
              ))}
            </tr>
          </thead> */}
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="px-4 py-2 font-medium border bg-gray-50">{day}</td>
                {visibleSections.map((sec) => {
                  const list = getRoutineForDaySection(day, sec.id);
                  return (
                    <td key={sec.id} className="px-2 py-2 border align-top">
                      {list.length > 0 ? (
                        list.map((rtn) => (
                          <div key={rtn.id} className="mb-2 p-2 bg-white shadow rounded border">
                            <div className="text-sm font-semibold">
                              {formatTime(rtn.startTime)} - {formatTime(rtn.endTime)}
                            </div>
                            <div className="text-xs">{rtn.subject?.subjectName}</div>
                            <div className="text-xs text-gray-500">Room: {rtn.room}</div>
                            <div className="text-xs text-gray-600 italic">{rtn.teacher?.name}</div>
                            <div className="flex space-x-1 mt-1">
                              <button className="text-orange-500 text-xs">✏️</button>
                              <button className="text-red-500 text-xs">🗑️</button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-xs italic text-center">N/A</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  
  );
}

function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = ((hour + 11) % 12 + 1).toString();
  return `${formattedHour}:${m} ${ampm}`;
}


