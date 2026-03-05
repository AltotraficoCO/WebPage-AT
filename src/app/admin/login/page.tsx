import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Alto Tráfico - Login Admin",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-lg font-bold">AT</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Alto Tráfico</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
