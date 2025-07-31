import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BasicTableExamSchedule from "../../components/tables/BasicTables/BasicTableExamSchedule";
import { useState,useEffect } from "react";
import { useLocation  } from "react-router-dom";


export default function ExamSchedule() {

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
      <PageBreadcrumb pageTitle="Exam" />

      <div className="space-y-6">
        {successMessage && (
          <div className="mb-4 p-2 rounded bg-green-100 text-green-800 border border-green-300">
            ✅ {successMessage}
          </div>
        )}
        <ComponentCard title="Exam Schedule">
          <BasicTableExamSchedule />
        </ComponentCard>
      </div>
    </>
  );
}
