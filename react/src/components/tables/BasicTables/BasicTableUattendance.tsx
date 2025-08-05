import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../config";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  photo?: string;
};


export default function BasicTableUattendance() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {

    fetch(`${BASE_URL}/userlist`)
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);

  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (user: User) => {
    navigate(`/viewUserDetails/${user.id}`);
  };


  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">User Attendance</h2>
      </div>

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
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Role</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td className="border px-2 py-1">{index + 1}</td>
                  <td className="border px-2 py-1">
                    <img
                      src={`http://localhost:5000/uploads/${user.photo}`}
                      alt="user"
                      className="w-8 h-8 rounded-full mx-auto"
                    />
                  </td>
                  <td className="border px-2 py-1">{user.name}</td>
                  <td className="border px-2 py-1">{user.email}</td>
                  <td className="border px-2 py-1">{user.role}</td>
                  <td className="border px-2 py-1 text-center">
                    <button className="bg-teal-500 text-white px-2 py-1 rounded"
                    onClick={() => handleView(user)}
                    >
                      ✓
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-3">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}