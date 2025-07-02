import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { useState,useEffect } from "react";
import { Link,useLocation  } from "react-router-dom";
import { FaPlus } from "react-icons/fa";


export default function Student() {
    const [selectedClass, setSelectedClass] = useState("");

    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState("");
    useEffect(() => {
      if (location.state?.success) {
        setSuccessMessage(location.state.success);
        const timeout = setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        return () => clearTimeout(timeout);
      }
    }, [location.state]);

  return (
    <>
      <PageBreadcrumb pageTitle="Students" />

      <div className="space-y-6">
        {successMessage && (
          <div className="mb-4 p-2 rounded bg-green-100 text-green-800 border border-green-300">
            ✅ {successMessage}
          </div>
        )}
        <ComponentCard title="All Student Table">
        <div className="flex justify-between items-center mb-4">
            <Link
                to="/add-student"
                className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1"
                >
                <FaPlus className="text-base" />
                Add a student
            </Link>

            <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border border-gray-300 text-sm px-3 py-1 rounded-md focus:outline-none"
            >
                <option value="">Select Class</option>
                <option value="class-1">Class 1</option>
                <option value="class-2">Class 2</option>
                <option value="class-3">Class 3</option>
            </select>
        </div>
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
