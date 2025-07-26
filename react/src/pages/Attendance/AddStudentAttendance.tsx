import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddStudentAttendance() {

    const navigate = useNavigate();

    type ClassType = {
        id: number;
        className: string;
    };

    type SectionType = {
        id: number;
        sectionName: string;
    };

    type StudentType = {
        id: number;
        photo: string;
        name: string;
        email: string;
        roll: number;
        className: string;
        section: string;
    };

    const [classId, setClassId] = useState("");
    const [sectionId, setSectionId] = useState("");
    // const [date, setDate] = useState("");
    const [classes, setClasses] = useState<ClassType[]>([]);
    const [sections, setSections] = useState<SectionType[]>([]);
    const [students, setStudents] = useState<StudentType[]>([]);
    const [attendance, setAttendance] = useState<{ [studentId: string]: string }>({});

    useEffect(() => {
        fetch("http://localhost:5000/api/classlist")
        .then((res) => res.json())
        .then((data) => setClasses(data));
    }, []);

    useEffect(() => {
        if (classId) {
        fetch(`http://localhost:5000/api/sectionlists/${classId}`)
            .then((res) => res.json())
            .then((data) => setSections(data));
        }
    }, [classId]);

    const handleAttendanceLoad = () => {
        if (!classId || !sectionId || !date) return;

        fetch(`http://localhost:5000/api/studentlists/${classId}/${sectionId}`)
        .then((res) => res.json())
        .then((data) => setStudents(data));
    };

    const handleAttendanceChange = (studentId: number, value: string) => {
        setAttendance((prev) => ({ ...prev, [studentId]: value }));
    };

    const getDayName = (dateStr: string) => {
        const day = new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" });
        return day;
    };


    const handleSubmit = () => {
        // const payload = students.map((student) => ({
        //     studentId: student.id,
        //     status: attendance[student.id] || "Absent",
        //     date,
        //     className: selectedClass?.id,
        //     section: selectedSection?.id
        // }));

        const payload = {
            date,
            classId,
            sectionId,
            records: students.map((student) => ({
                studentId: student.id,
                status: attendance[student.id] || "Absent"
            }))
        };

        fetch("http://localhost:5000/api/saveSattendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        .then((res) => res.json())
        .then(() => {
            alert("Attendance submitted!");
            navigate("/sattendance");
        })
        .catch((err) => console.error("Submit error:", err));
    };

    const selectedClass = classes.find(c => c.id === Number(classId));
    const selectedSection = sections.find(s => s.id === Number(sectionId));

    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded mt-8 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
            <div>
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <select
                    className="border rounded px-4 py-2 w-40"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700">Section</label>
                <select
                    className="border rounded px-4 py-2 w-40"
                    value={sectionId}
                    onChange={(e) => setSectionId(e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                    type="date"
                    className="border rounded px-4 py-2"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div className="mt-6">
                <button
                    onClick={handleAttendanceLoad}
                    className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition"
                >
                    Load Attendance
                </button>
            </div>

            {students.length > 0 && (
                <div className="bg-gray-200 text-center p-4 rounded text-sm font-medium">
                    <p><u>Attendance Details</u></p>
                    <p>Class : {selectedClass?.className || ""}</p>
                    <p>Section : {selectedSection?.sectionName || ""}</p>
                    <p>Day : {getDayName(date)}</p>
                    <p>Date : {new Date(date).toLocaleDateString("en-GB")}</p>
                </div>
            )}
        </div>

        {/* Table */}
        {students.length > 0 && (
            <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border text-sm text-left">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Photo</th>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Roll</th>
                    <th className="p-2 border">Attendance</th>
                </tr>
                </thead>
                <tbody>
                {students.map((student, index) => (
                    <tr key={student.id} className="border-b">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">
                        <img
                        src={`http://localhost:5000/uploads/${student.photo}`}
                        alt="student"
                        className="h-8 w-8 rounded-full object-cover"
                        />
                    </td>
                    <td className="p-2 border">{student.name}</td>
                    <td className="p-2 border">{student.email}</td>
                    <td className="p-2 border">{student.roll}</td>
                    <td className="p-2 border">
                        {["Present", "Late Present With Excuse", "Late Present", "Absent"].map(
                        (status) => (
                            <label key={status} className="mr-3">
                            <input
                                type="radio"
                                name={`attendance-${student.id}`}
                                value={status}
                                checked={attendance[student.id] === status}
                                onChange={() => handleAttendanceChange(student.id, status)}
                                className="mr-1"
                            />
                            {status}
                            </label>
                        )
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="mt-4 text-right">
                <button
                onClick={handleSubmit}
                className="bg-teal-600 text-white px-6 py-2 rounded shadow hover:bg-teal-700"
                >
                Submit
                </button>
            </div>
            </div>
        )}
        </div>
    );
}
