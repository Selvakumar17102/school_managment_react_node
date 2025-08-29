import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function Promotion() {

  return (
    <div>
      <PageMeta
        title="Under Progress Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Under Progress Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Under Progress" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          {/* Icon with animation */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-yellow-100 rounded-full animate-bounce">
              <span className="text-4xl">⚒️</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            🚧 Promotion Page Under Progress
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            We are currently working on this page. New features are on the way!
          </p>

          {/* Animated text indicator */}
          <p className="text-lg font-semibold text-yellow-600 animate-pulse">
            ⏳ Work in Progress...
          </p>
        </div>
      </div>
    </div>
  );
}
