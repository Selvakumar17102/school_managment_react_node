import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BasicTableMark from "../../components/tables/BasicTables/BasicTableMark";
import { useState,useEffect } from "react";
import { useLocation  } from "react-router-dom";


export default function Mark() {

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
      <PageBreadcrumb pageTitle="Mark" />

      <div className="space-y-6">
        {successMessage && (
          <div className="mb-4 p-2 rounded bg-green-100 text-green-800 border border-green-300">
            ✅ {successMessage}
          </div>
        )}
        <ComponentCard title="Mark">
          <BasicTableMark />
        </ComponentCard>
      </div>
    </>
  );
}
