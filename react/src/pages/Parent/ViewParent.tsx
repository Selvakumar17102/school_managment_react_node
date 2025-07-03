import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';


export default function ViewParent() {

  const { id } = useParams();

  const [parent, setParent] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("Profile");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/parents/${id}`)
      .then(res => setParent(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!parent) return <p>Loading...</p>;


const tabs = ["Profile", "children", "Document"];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div>
          <button className="btn bg-red-500 text-white mr-2">Print</button>
          <button className="btn bg-red-500 text-white mr-2">PDF Preview</button>
          <button className="btn bg-orange-500 text-white mr-2">Edit</button>
        </div>
        <div>
          <span>Dashboard / Parent / View</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4 text-center">
          <img
            src={`http://localhost:5000/uploads/${parent.photo}`}
            alt={parent.guardianName}
            className="w-24 h-24 rounded-full mx-auto mb-2"
          />
          <h2 className="text-xl font-semibold">{parent.guardianName}</h2>
          <p>Parent</p>
          <div className="mt-4 space-y-1 text-left">
            <p><strong>Phone :</strong> {parent.phone}</p>
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
                <p><strong>Father's Name:</strong> {parent.fatherName}</p>
                <p><strong>Mother's Name:</strong> {parent.motherName}</p>
                <p><strong>Father's Profession:</strong> {parent.fatherProfession}</p>
                <p><strong>Mother's Profession:</strong> {parent.motherProfession}</p>
                <p><strong>Email:</strong> {parent.email}</p>
                <p><strong>Phone:</strong> {parent.phone}</p>
                <p><strong>Address:</strong> {parent.address}</p>
                <p><strong>Username:</strong> {parent.username}</p>
                </div>
            )}

            {activeTab === "children" && (
                <div>children Information Coming Soon...</div>
            )}

            {activeTab === "Document" && (
                <div>Document Content Here...</div>
            )}
        </div>
      </div>
    </div>
  );
}
