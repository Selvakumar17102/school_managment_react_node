import { useParams,useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';


export default function ViewUser() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("Profile");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/${id}`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!user) return <p>Loading...</p>;


const tabs = ["Profile", "Attendance", "Document"];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div>
          <button className="btn bg-red-500 text-white mr-2">Print</button>
          <button className="btn bg-red-500 text-white mr-2">PDF Preview</button>
          <button onClick={() => navigate(`/edituser/${user.id}`)} className="btn bg-orange-500 text-white mr-2">Edit</button>
        </div>
        <div>
          <span>Dashboard / User / View</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4 text-center">
          <img
            src={`http://localhost:5000/uploads/${user.photo}`}
            alt={user.name}
            className="w-24 h-24 rounded-full mx-auto mb-2"
          />
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p>{user.role}</p>
          <div className="mt-4 space-y-1 text-left">
            <p><strong>Gender:</strong> {user.gender}</p>
          </div>
          <div className="mt-4 space-y-1 text-left">
            <p><strong>Date Of Birth:</strong> {user.dob}</p>
          </div>
          <div className="mt-4 space-y-1 text-left">
            <p><strong>Phone:</strong> {user.phone}</p>
          </div>
        </div>

        <div className="col-span-2 bg-white shadow rounded p-4">
            <ul className="flex border-b mb-4">
                {tabs.map((tab) => (
                <li key={tab} className="mr-6">
                    <button
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 ${
                        activeTab === tab
                        ? "text-blue-500 border-b-2 border-blue-500"
                        : "text-gray-500"
                    }`}
                    >
                    {tab}
                    </button>
                </li>
                ))}
            </ul>
            {activeTab === "Profile" && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                <p><strong>Joinning Date:</strong> {user.joiningDate}</p>
                <p><strong>Religion:</strong> {user.religion}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Address:</strong> {user.address}</p>
                </div>
            )}

            {activeTab === "Attendance" && (
                <div>Attendance Content Here...</div>
            )}

            {activeTab === "Document" && (
                <div>Document Content Here...</div>
            )}
        </div>
      </div>
    </div>
  );
}
