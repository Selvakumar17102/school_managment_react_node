import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


type ClassOption = { id: string; className: string };
type ExamOption = { id: string; examName: string };
type SectionOption = { id: string; sectionName: string };
type SubjectOption = { id: string; subjectName: string };

type Student = {
  id: number;
  name: string;
  roll: number;
  photo: string;
  exam: number;
  attendance: number;
  classTest: number;
  assignment: number;
};

export default function AddMark() {
    const navigate = useNavigate();


    const [selectedClass, setSelectedClass] = useState("");
    const [selectedClassName, setSelectedClassName] = useState("");
    const [selectedClassId, setSelectedClassId] = useState("");


    const [selectedExam, setSelectedExam] = useState("");
    const [selectedExamName, setSelectedExamName] = useState("");

    const [selectedSection, setSelectedSection] = useState("");
    const [selectedSectionName, setSelectedSectionName] = useState("");

    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedSubjectName, setSelectedSubjectName] = useState("");
    
    const [students, setStudents] = useState<Student[]>([]);

    const [showMarkTable, setShowMarkTable] = useState(false);

    const [classes, setClasses] = useState<ClassOption[]>([]);
    const [exams, setExams] = useState<ExamOption[]>([]);
    const [sections, setSections] = useState<SectionOption[]>([]);
    const [subjects, setSubjects] = useState<SubjectOption[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/classlist")
      .then((res) => res.json())
      .then(setClasses);

    fetch("http://localhost:5000/api/examlist")
      .then((res) => res.json())
      .then(setExams);

    // fetch("http://localhost:5000/api/sectionlist")
    //   .then((res) => res.json())
    //   .then(setSections);

    fetch("http://localhost:5000/api/subjectlist")
      .then((res) => res.json())
      .then(setSubjects);
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetch(`http://localhost:5000/api/sectionlists/${selectedClassId}`)
        .then((res) => res.json())
        .then(setSections);
    } else {
      setSections([]);
    }
  }, [selectedClassId]);


    const handleFetchStudents = async () => {
        if (!selectedClass || !selectedExam || !selectedSection || !selectedSubject) {
            alert("All fields are required");
            return;
        }

        try {
            const res = await fetch(
            `http://localhost:5000/api/get-mark-students?className=${selectedClass}&examName=${selectedExam}&sectionName=${selectedSection}&subjectName=${selectedSubject}`
            );

            const data = await res.json();
            setStudents(data);
            setShowMarkTable(true);
        } catch (err) {
            console.error("Error fetching students:", err);
            alert("Failed to fetch student data.");
        }
    };

    const handleInputChange = (id: number, field: string, value: string) => {
    setStudents((prev) =>
        prev.map((s) =>
        s.id === id ? { ...s, [field]: Number(value) } : s
        )
    );
    };


    const handleSubmitMarks = async () => {
        const payload = {
            classId: selectedClass,
            examId: selectedExam,
            sectionId: selectedSection,
            subjectId: selectedSubject,
            marks: students.map((s) => ({
            studentId: s.id,
            exam: s.exam,
            attendance: s.attendance,
            classTest: s.classTest,
            assignment: s.assignment,
            })),
        };

        try {
            const res = await fetch("http://localhost:5000/api/submit-marks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
            alert("Marks submitted successfully!");
            navigate("/mark", { state: { success: "Marks submitted successfully!" } });
            } else {
            alert("Submission failed: " + data.message);
            }
        } catch (err) {
            console.error("Submit error:", err);
        }
    };



  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold mb-4">🧪 Mark</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Class *</label>
          
            <select
            value={selectedClass}
            onChange={(e) => {
                const id = e.target.value;
                const found = classes.find((c) => c.id == id);
                setSelectedClass(id);
                setSelectedClassName(found ? found.className : "");
                setSelectedClassId(e.target.value);
            }}
            className="w-full border px-3 py-2 rounded mt-1"
            >
            <option value="">Select Class</option>
            {classes.map((c) => (
                <option key={c.id} value={c.id}>
                {c.className}
                </option>
            ))}
            </select>

        </div>

        <div>
          <label className="block text-sm font-medium">Exam *</label>
          <select
            value={selectedExam}
            onChange={(e) => {
                const id = e.target.value;
                const found = exams.find((ex) => ex.id == id);
                setSelectedExam(id);
                setSelectedExamName(found ? found.examName : "");
            }}
            className="w-full border px-3 py-2 rounded mt-1"
            >
            <option value="">Select Exam</option>
            {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                {ex.examName}
                </option>
            ))}
            </select>

        </div>

        <div>
          <label className="block text-sm font-medium">Section *</label>
          <select
            value={selectedSection}
            onChange={(e) => {
                const id = e.target.value;
                const found = sections.find((s) => s.id == id);
                setSelectedSection(id);
                setSelectedSectionName(found ? found.sectionName : "");
            }}
            className="w-full border px-3 py-2 rounded mt-1"
            >
            <option value="">Select Section</option>
            {sections.map((s) => (
                <option key={s.id} value={s.id}>
                {s.sectionName}
                </option>
            ))}
            </select>

        </div>

        <div>
          <label className="block text-sm font-medium">Subject *</label>
            <select
            value={selectedSubject}
            onChange={(e) => {
                const id = e.target.value;
                const found = subjects.find((s) => s.id == id);
                setSelectedSubject(id);
                setSelectedSubjectName(found ? found.subjectName : "");
            }}
            className="w-full border px-3 py-2 rounded mt-1"
            >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                {s.subjectName}
                </option>
            ))}
            </select>
        </div>
      </div>

      {/* Mark Button */}
      <div className="mb-4">
        <button
          onClick={handleFetchStudents}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded"
        >
          Mark
        </button>
      </div>

      {/* Mark Details Box */}
      {showMarkTable && (
        <>
            <div className="bg-gray-100 text-center py-4 px-6 rounded mb-4">
            <p>📘 <strong>Mark Details</strong></p>
            <p>Exam: {selectedExamName}</p>
            <p>Class: {selectedClassName}</p>
            <p>Section: {selectedSectionName}</p>
            <p>Subject: {selectedSubjectName}</p>
            </div>


          {/* Mark Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2">#</th>
                  <th className="border px-3 py-2">Photo</th>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Roll</th>
                  <th className="border px-3 py-2">Exam (70)</th>
                  <th className="border px-3 py-2">Attendance (10)</th>
                  <th className="border px-3 py-2">Class Test (10)</th>
                  <th className="border px-3 py-2">Assignment (10)</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, index) => (
                  <tr key={s.id} className="even:bg-gray-50">
                    <td className="border px-3 py-2">{index + 1}</td>
                    <td className="border px-3 py-2">
                      <img
                        src={`http://localhost:5000/uploads/${s.photo}`}
                        alt={s.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </td>
                    <td className="border px-3 py-2">{s.name}</td>
                    <td className="border px-3 py-2">{s.roll}</td>
                    <td className="border px-3 py-2">
                      <input
                        type="number"
                        value={s.exam}
                        onChange={(e) => handleInputChange(s.id, "exam", e.target.value)}
                        min={0}
                        max={70}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <input
                        type="number"
                        value={s.attendance}
                        onChange={(e) => handleInputChange(s.id, "attendance", e.target.value)}
                        min={0}
                        max={10}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <input
                        type="number"
                        value={s.classTest}
                        onChange={(e) => handleInputChange(s.id, "classTest", e.target.value)}
                        min={0}
                        max={10}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <input
                        type="number"
                        value={s.assignment}
                        onChange={(e) => handleInputChange(s.id, "assignment", e.target.value)}
                        min={0}
                        max={10}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <button 
                onClick={handleSubmitMarks}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded">
              Add Mark
            </button>
          </div>
        </>
      )}
    </div>
  );
}
