import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";
export default function AddTeacherAttendance() {

    const navigate = useNavigate();
    type TeacherType = {
        id: number;
        photo: string;
        name: string;
        email: string;
    };

    const [teachers, setTeachers] = useState<TeacherType[]>([]);
    const [attendance, setAttendance] = useState<{ [teacherId: string]: string }>({});


    const handleAttendanceLoad = () => {
        if (!date) return;

        fetch(`${BASE_URL}/teacherlist`)
        .then((res) => res.json())
        .then((data) => setTeachers(data));
    };

    const handleAttendanceChange = (teacherId: number, value: string) => {
        setAttendance((prev) => ({ ...prev, [teacherId]: value }));
    };

    const getDayName = (dateStr: string) => {
        const day = new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" });
        return day;
    };


    const handleSubmit = () => {
       
        const payload = {
            date,
            records: teachers.map((teacher) => ({
                teacherId: teacher.id,
                status: attendance[teacher.id] || "Absent"
            }))
        };

        fetch(`${BASE_URL}/saveTattendance`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        .then((res) => res.json())
        .then(() => {
            alert("Attendance submitted!");
            navigate("/tattendance");
        })
        .catch((err) => console.error("Submit error:", err));
    };

    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded mt-8 space-y-4">
            <div className="flex flex-wrap gap-4 items-center">

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

                {teachers.length > 0 && (
                    <div className="bg-gray-200 text-center p-4 rounded text-sm font-medium">
                        <p><u>Attendance Details</u></p>
                        <p>Day : {getDayName(date)}</p>
                        <p>Date : {new Date(date).toLocaleDateString("en-GB")}</p>
                    </div>
                )}
            </div>

            {teachers.length > 0 && (
                <div className="mt-6 overflow-x-auto">
                <table className="min-w-full border text-sm text-left">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">#</th>
                        <th className="p-2 border">Photo</th>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Attendance</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teachers.map((teacher, index) => (
                        <tr key={teacher.id} className="border-b">
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border">
                            <img
                            src={`http://localhost:5000/uploads/${teacher.photo}`}
                            alt="teacher"
                            className="h-8 w-8 rounded-full object-cover"
                            />
                        </td>
                        <td className="p-2 border">{teacher.name}</td>
                        <td className="p-2 border">{teacher.email}</td>
                        <td className="p-2 border">
                            {["Present", "Late Present With Excuse", "Late Present", "Absent"].map(
                            (status) => (
                                <label key={status} className="mr-3">
                                <input
                                    type="radio"
                                    name={`attendance-${teacher.id}`}
                                    value={status}
                                    checked={attendance[teacher.id] === status}
                                    onChange={() => handleAttendanceChange(teacher.id, status)}
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
