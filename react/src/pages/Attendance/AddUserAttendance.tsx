import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddUserAttendance() {

    const navigate = useNavigate();
    type UserType = {
        id: number;
        photo: string;
        name: string;
        email: string;
    };

    const [users, setUsers] = useState<UserType[]>([]);
    const [attendance, setAttendance] = useState<{ [userId: string]: string }>({});


    const handleAttendanceLoad = () => {
        if (!date) return;

        fetch(`http://localhost:5000/api/userlist`)
        .then((res) => res.json())
        .then((data) => setUsers(data));
    };

    const handleAttendanceChange = (userId: number, value: string) => {
        setAttendance((prev) => ({ ...prev, [userId]: value }));
    };

    const getDayName = (dateStr: string) => {
        const day = new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" });
        return day;
    };


    const handleSubmit = () => {
       
        const payload = {
            date,
            records: users.map((user) => ({
                userId: user.id,
                status: attendance[user.id] || "Absent"
            }))
        };

        fetch("http://localhost:5000/api/saveUattendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        .then((res) => res.json())
        .then(() => {
            alert("Attendance submitted!");
            navigate("/uattendance");
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

                {users.length > 0 && (
                    <div className="bg-gray-200 text-center p-4 rounded text-sm font-medium">
                        <p><u>Attendance Details</u></p>
                        <p>Day : {getDayName(date)}</p>
                        <p>Date : {new Date(date).toLocaleDateString("en-GB")}</p>
                    </div>
                )}
            </div>

            {users.length > 0 && (
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
                    {users.map((user, index) => (
                        <tr key={user.id} className="border-b">
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border">
                            <img
                            src={`http://localhost:5000/uploads/${user.photo}`}
                            alt="user"
                            className="h-8 w-8 rounded-full object-cover"
                            />
                        </td>
                        <td className="p-2 border">{user.name}</td>
                        <td className="p-2 border">{user.email}</td>
                        <td className="p-2 border">
                            {["Present", "Late Present With Excuse", "Late Present", "Absent"].map(
                            (status) => (
                                <label key={status} className="mr-3">
                                <input
                                    type="radio"
                                    name={`attendance-${user.id}`}
                                    value={status}
                                    checked={attendance[user.id] === status}
                                    onChange={() => handleAttendanceChange(user.id, status)}
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
