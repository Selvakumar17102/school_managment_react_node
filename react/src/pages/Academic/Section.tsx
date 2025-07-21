import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BasicTableSection from "../../components/tables/BasicTables/BasicTableSection";
import { useState,useEffect } from "react";
import { Link,useLocation  } from "react-router-dom";
import { FaPlus } from "react-icons/fa";


export default function Section() {

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
      <PageBreadcrumb pageTitle="Section" />

      <div className="space-y-6">
        {successMessage && (
          <div className="mb-4 p-2 rounded bg-green-100 text-green-800 border border-green-300">
            ✅ {successMessage}
          </div>
        )}
        <ComponentCard title="All Section Table">
        <div className="flex justify-between items-center mb-4">
            <Link
                to="/addSection"
                className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1"
                >
                <FaPlus className="text-base" />
                Add a Section
            </Link>
        </div>
          <BasicTableSection />
        </ComponentCard>
      </div>
    </>
  );
}
