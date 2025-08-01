import { useEffect, useState } from "react";

import { toast } from "react-toastify";

export default function AddExamAttendance() {

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
        email: string;
        roll: number;
        section: string;
        photo?: string;
    };

    const [errors, setErrors] = useState({
        exam: "",
        class: "",
        section: "",
        subject: "",
    });

    const validateFields = () => {
        const newErrors = {
            exam: selectedExam ? "" : "Exam is required",
            class: selectedClass ? "" : "Class is required",
            section: selectedSection ? "" : "Section is required",
            subject: selectedSubject ? "" : "Subject is required",
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((msg) => msg === "");
    };



    const [exams, setExams] = useState<ExamOption[]>([]);
    const [classes, setClasses] = useState<ClassOption[]>([]);
    const [sections, setSections] = useState<SectionOption[]>([]);
    const [subjects, setSubjects] = useState<SubjectOption[]>([]);


    const [selectedExam, setSelectedExam] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");

    const [students, setStudents] = useState<Student[]>([]);
    const [showTable, setShowTable] = useState(false);


    const [attendanceStatus, setAttendanceStatus] = useState<{ [id: number]: boolean }>({});


    useEffect(() => {
        fetch("http://localhost:5000/api/examlist")
        .then((res) => res.json())
        .then(setExams);

        fetch("http://localhost:5000/api/classlist")
        .then((res) => res.json())
        .then(setClasses);

        fetch("http://localhost:5000/api/subjectlist")
        .then((res) => res.json())
        .then(setSubjects);
    }, []);

    useEffect(() => {
        if (selectedClass) {
        fetch(`http://localhost:5000/api/sectionlists/${selectedClass}`)
            .then((res) => res.json())
            .then(setSections);
        } else {
        setSections([]);
        }
    }, [selectedClass]);

    const handleFetchStudents = () => {
        if (!validateFields()) return;

        fetch(
        `http://localhost:5000/api/exam_attendance_students?className=${selectedClass}&section=${selectedSection}`
        )
        .then((res) => res.json())
        .then((data) => {
            setStudents(data);
            setShowTable(true);
        })
        .catch((err) => {
            console.error("Failed to fetch students", err);
        });
    };

    const handleAttendanceToggle = async (studentId: number, isChecked: boolean) => {
        setAttendanceStatus((prev) => ({
            ...prev,
            [studentId]: isChecked,
        }));

        const payload = {
            studentId,
            classId: selectedClass,
            sectionId: selectedSection,
            examId: selectedExam,
            subjectId: selectedSubject,
            date: new Date().toISOString().slice(0, 10),
            status: isChecked ? "present" : "absent",
        };

        try {
            const res = await fetch("http://localhost:5000/api/save-exam-attendance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (res.ok) {
                toast.success("✔️ Attendance marked successfully!");
            } else {
                toast.error(`❌ ${result.error || "Failed to save attendance"}`);
            }
        } catch (error) {
            console.error("Auto-save error:", error);
             toast.error("❌ Failed to auto-save attendance");
        }
    };


    return (
        <div className="p-6 bg-white shadow rounded">

        <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
            🧑‍🏫 Exam Attendance
            </h2>
            <div className="text-sm text-gray-600 space-x-1">
            <a href="/dashboard" className="hover:underline text-gray-600">
                Dashboard
            </a>
            <span>/</span>
            <span>Exam Attendance</span>
            <span>/</span>
            <a href="/add-exam-attendance" className="text-teal-500 font-medium hover:underline">
                Add Exam Attendance
            </a>
            </div>
        </div>

        <div className="grid grid-cols-5 gap-4 items-end mb-6">
            <div>
            <label className="text-sm font-medium">Exam <span className="text-red-500">*</span></label>
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
            </div>

            <div>
            <label className="text-sm font-medium">Class <span className="text-red-500">*</span></label>
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
            </div>

            <div>
            <label className="text-sm font-medium">Section <span className="text-red-500">*</span></label>
            <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className={`w-full border rounded px-3 py-2 mt-1 text-sm ${
                    errors.section ? "border-red-500" : ""
                }`}
            >
                <option value="">Select Section</option>
                {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                    {sec.sectionName}
                </option>
                ))}
            </select>
            </div>

            <div>
            <label className="text-sm font-medium">Subject <span className="text-red-500">*</span></label>
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
            </div>

            <div>
            <button
                onClick={handleFetchStudents}
                className="bg-teal-500 text-white px-5 py-2 rounded hover:bg-teal-600 text-sm w-full"
            >
                Attendance
            </button>
            </div>
        </div>

        {showTable && (
            <>
            <div className="bg-gray-100 p-4 rounded text-center text-sm font-medium mb-6">
                <p>Exam Attendance Details</p>
                <p>
                Exam: {exams.find((e) => e.id == +selectedExam)?.examName} &nbsp; | &nbsp;
                Class: {classes.find((c) => c.id == +selectedClass)?.className} &nbsp; | &nbsp;
                Section: {sections.find((s) => s.id == +selectedSection)?.sectionName} &nbsp; | &nbsp;
                Subject: {subjects.find((s) => s.id == +selectedSubject)?.subjectName}
                </p>
            </div>

            <table className="w-full text-sm border rounded overflow-hidden">
                <thead className="bg-gray-200">
                <tr>
                    <th className="border px-2 py-1">#</th>
                    <th className="border px-2 py-1">Photo</th>
                    <th className="border px-2 py-1">Name</th>
                    <th className="border px-2 py-1">Section</th>
                    <th className="border px-2 py-1">Email</th>
                    <th className="border px-2 py-1">Roll</th>
                    <th className="border px-2 py-1 text-center">Action</th>
                </tr>
                </thead>
                <tbody>
                {students.length === 0 ? (
                    <tr>
                    <td colSpan={7} className="text-center py-3 text-gray-500">
                        No students found
                    </td>
                    </tr>
                ) : (
                    students.map((student, index) => (
                    <tr key={student.id} className="odd:bg-white even:bg-gray-50">
                        <td className="border px-2 py-1">{index + 1}</td>
                        <td className="border px-2 py-1 text-center">
                        <img
                            src={`http://localhost:5000/uploads/${student.photo}`}
                            alt="student"
                            className="w-8 h-8 rounded-full mx-auto"
                        />
                        </td>
                        <td className="border px-2 py-1">{student.name}</td>
                        <td className="border px-2 py-1">{student.section}</td>
                        <td className="border px-2 py-1">{student.email}</td>
                        <td className="border px-2 py-1">{student.roll}</td>
                        <td className="border px-2 py-1 text-center">
                        <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={attendanceStatus[student.id] || false}
                            onChange={(e) =>
                                handleAttendanceToggle(student.id, e.target.checked)
                            }
                        />
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </>
        )}
        </div>
    );
}
