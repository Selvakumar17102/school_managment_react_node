import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";

export default function Blank() {
  return (
    <div>
      <PageMeta
        title="Coming Soon Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Coming Soon" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            🚧 Coming Soon
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            This page is under construction. We’re working hard to bring you this feature soon!
          </p>
        </div>
      </div>
    </div>
  );
}
