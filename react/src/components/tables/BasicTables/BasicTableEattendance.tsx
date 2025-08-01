import { useEffect, useState } from "react";



export default function BasicTableEattendance() {

  type ExamOption = {
      id: number;
      examName: string;
  };
  type ClassOption = {
      id: number;
      className: string;
  };
  type SectionOption = {
      id: number;
      sectionName: string;
  };
  type SubjectOption = {
      id: number;
      subjectName: string;
  };

  type Student = {
      id: number;
      name: string;
      sectionName:string;
      email: string;
      roll: number;
      status: string;
      photo?: string;
  };

  const [exams, setExams] = useState<ExamOption[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [sections, setSections] = useState<SectionOption[]>([]);

  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [activeSection, setActiveSection] = useState("All");

  const [students, setStudents] = useState<Student[]>([]);

  const [errors, setErrors] = useState({
        exam: "",
        class: "",
        subject: "",
    });

  const validateFields = () => {
      const newErrors = {
          exam: selectedExam ? "" : "Exam is required",
          class: selectedClass ? "" : "Class is required",
          subject: selectedSubject ? "" : "Subject is required",
      };
      setErrors(newErrors);
      return Object.values(newErrors).every((msg) => msg === "");
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/examlist").then((res) => res.json()).then(setExams);
    fetch("http://localhost:5000/api/classlist").then((res) => res.json()).then(setClasses);
    fetch("http://localhost:5000/api/subjectlist").then((res) => res.json()).then(setSubjects);
  }, []);

  useEffect(() => {
    if (!selectedClass) return;

    fetch(`http://localhost:5000/api/sectionlists/${selectedClass}`)
      .then(res => res.json())
      .then(setSections)
      .catch(console.error);

  }, [selectedClass]);

  const handleViewAttendance = () => {
    if (!validateFields()) return;

    fetch(
      `http://localhost:5000/api/get-students-attendance?classId=${selectedClass}&subjectId=${selectedSubject}&examId=${selectedExam}`
    )
      .then((res) => res.json())
      .then((data) => {

        setStudents(data);
        // setSections(data.sections);
      });
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-4 mb-4">
        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className={`w-full border rounded px-3 py-2 mt-1 text-sm ${
              errors.exam ? "border-red-500" : ""
          }`}
        >
          <option value="">Select Exam</option>
          {exams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.examName}
            </option>
          ))}
        </select>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className={`w-full border rounded px-3 py-2 mt-1 text-sm ${
              errors.class ? "border-red-500" : ""
          }`}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.className}
            </option>
          ))}
        </select>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className={`w-full border rounded px-3 py-2 mt-1 text-sm ${
              errors.subject ? "border-red-500" : ""
          }`}
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.subjectName}
            </option>
          ))}
        </select>

        <button
          onClick={handleViewAttendance}
          className="bg-teal-500 text-white px-5 py-2 rounded hover:bg-teal-600"
        >
          View Attendance
        </button>
      </div>

      <div className="flex border-b mb-4 text-sm">
        <button
          onClick={() => setActiveSection("All")}
          className={`px-4 py-2 ${
            activeSection === "All"
              ? "border-b-2 border-teal-500 font-medium"
              : ""
          }`}
        >
          All Students
        </button>
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.sectionName)}
            className={`px-4 py-2 ${
              activeSection === sec.sectionName
                ? "border-b-2 border-teal-500 font-medium"
                : ""
            }`}
          >
          {sec.sectionName}
          </button>
        ))}
      </div>

      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1 border">#</th>
            <th className="px-2 py-1 border">Photo</th>
            <th className="px-2 py-1 border">Name</th>
            <th className="px-2 py-1 border">Roll</th>
            <th className="px-2 py-1 border">Email</th>
            <th className="px-2 py-1 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {students
            .filter(
              (s) => activeSection === "All" || s.sectionName === activeSection
            )
            .map((student, idx) => (
              <tr key={student.id} className="even:bg-gray-50">
                <td className="px-2 py-1 border">{idx + 1}</td>
                <td className="px-2 py-1 border text-center">
                  <img
                    src={`http://localhost:5000/uploads/${student.photo}`}
                    alt="student"
                    className="w-8 h-8 rounded-full mx-auto"
                  />
                </td>
                <td className="px-2 py-1 border">{student.name}</td>
                <td className="px-2 py-1 border">{student.roll}</td>
                <td className="px-2 py-1 border">{student.email}</td>
                <td className="px-2 py-1 border">
                  <span
                    className={`px-2 py-1 text-xs rounded text-white ${
                      student.status === "present"
                        ? "bg-teal-500"
                        : "bg-red-500"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}