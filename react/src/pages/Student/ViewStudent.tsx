import { useParams,useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';


export default function ViewStudent() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("Profile");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/students/${id}`)
      .then(res => setStudent(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!student) return <p>Loading...</p>;


const tabs = ["Profile", "Parents", "Routine", "Attendance", "Mark", "Invoice", "Payment", "Document"];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div>
          <button className="btn bg-red-500 text-white mr-2">Print</button>
          <button className="btn bg-red-500 text-white mr-2">PDF Preview</button>
          <button onClick={() => navigate(`/editstudent/${student.id}`)} className="btn bg-orange-500 text-white mr-2">Edit</button>
        </div>
        <div>
          <span>Dashboard / Student / View</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4 text-center">
          <img
            src={`http://localhost:5000/uploads/${student.photo}`}
            alt={student.name}
            className="w-24 h-24 rounded-full mx-auto mb-2"
          />
          <h2 className="text-xl font-semibold">{student.name}</h2>
          <p>Student</p>
          <div className="mt-4 space-y-1 text-left">
            <p><strong>Register No:</strong> {student.registerNo}</p>
            <p><strong>Roll:</strong> {student.roll}</p>
            <p><strong>Class:</strong> {student.className}</p>
            <p><strong>Section:</strong> {student.section}</p>
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
                <p><strong>Group:</strong> -</p>
                <p><strong>Optional Subject:</strong> {student.optionalSubject}</p>
                <p><strong>Date of Birth:</strong> {student.dob}</p>
                <p><strong>Gender:</strong> {student.gender}</p>
                <p><strong>Blood Group:</strong> {student.bloodGroup}</p>
                <p><strong>Religion:</strong> {student.religion}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Phone:</strong> {student.phone}</p>
                <p><strong>State:</strong> {student.state}</p>
                <p><strong>Country:</strong> {student.country}</p>
                <p><strong>Username:</strong> {student.username}</p>
                <p><strong>Admission Date:</strong> {student.admissionDate}</p>
                <p><strong>Address:</strong> {student.address}</p>
                </div>
            )}

            {activeTab === "Parents" && (
                <div>Parent Information Coming Soon...</div>
            )}

            {activeTab === "Routine" && (
                <div>Routine Content Here...</div>
            )}

            {activeTab === "Attendance" && (
                <div>Attendance Content Here...</div>
            )}

            {activeTab === "Mark" && (
                <div>Mark Content Here...</div>
            )}

            {activeTab === "Invoice" && (
                <div>Invoice Content Here...</div>
            )}

            {activeTab === "Payment" && (
                <div>Payment Content Here...</div>
            )}

            {activeTab === "Document" && (
                <div>Document Content Here...</div>
            )}
        </div>
      </div>
    </div>
  );
}
