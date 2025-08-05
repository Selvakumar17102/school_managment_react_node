import { useParams,useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from "../../config";

export default function ViewTeacher() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [teacher, setTeacher] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("Profile");

  useEffect(() => {
    axios.get(`${BASE_URL}/teachers/${id}`)
      .then(res => setTeacher(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!teacher) return <p>Loading...</p>;


const tabs = ["Profile", "Routine", "Attendance", "Document"];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div>
          <button className="btn bg-red-500 text-white mr-2">Print</button>
          <button className="btn bg-red-500 text-white mr-2">PDF Preview</button>
          <button onClick={() => navigate(`/editteacher/${teacher.id}`)} className="btn bg-orange-500 text-white mr-2">Edit</button>
        </div>
        <div>
          <span>Dashboard / Teacher / View</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4 text-center">
          <img
            src={`http://localhost:5000/uploads/${teacher.photo}`}
            alt={teacher.name}
            className="w-24 h-24 rounded-full mx-auto mb-2"
          />
          <h2 className="text-xl font-semibold">{teacher.name}</h2>
          <p>Teacher</p>
          <div className="mt-4 space-y-1 text-left">
            <p><strong>Designation:</strong> {teacher.designation}</p>
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
                <p><strong>Date of Birth:</strong> {teacher.dob}</p>
                <p><strong>Gender:</strong> {teacher.gender}</p>
                <p><strong>Religion:</strong> {teacher.religion}</p>
                <p><strong>Email:</strong> {teacher.email}</p>
                <p><strong>Phone:</strong> {teacher.phone}</p>
                <p><strong>Username:</strong> {teacher.username}</p>
                <p><strong>Admission Date:</strong> {teacher.joiningDate}</p>
                <p><strong>Address:</strong> {teacher.address}</p>
                </div>
            )}

            {activeTab === "Routine" && (
                <div>Routine Content Here...</div>
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
