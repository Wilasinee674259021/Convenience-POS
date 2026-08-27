import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (!username || !password) {
      setError("กรุณากรอก Username และ Password");
      return;
    }

    const savedEmployees =
      localStorage.getItem("pos_employees");

    const employees = savedEmployees
      ? JSON.parse(savedEmployees)
      : [];

    const employee = employees.find(
      (item) =>
        item.username.toLowerCase() ===
          username.toLowerCase() &&
        item.password === password
    );

    if (!employee) {
      setError("Username หรือ Password ไม่ถูกต้อง");
      return;
    }

    if (employee.status !== "เปิดใช้งาน") {
      setError(
        "บัญชีนี้ถูกปิดใช้งาน กรุณาติดต่อผู้ดูแลระบบ"
      );
      return;
    }

    // บันทึกผู้ใช้งานปัจจุบัน
    localStorage.setItem(
      "pos_current_user",
      JSON.stringify(employee)
    );

    // บันทึก Audit Log
    const savedLogs =
      localStorage.getItem("pos_audit_logs");

    const logs = savedLogs
      ? JSON.parse(savedLogs)
      : [];

    logs.unshift({
      id: Date.now(),
      date: new Date().toLocaleString("th-TH"),
      employee: employee.name,
      action: "เข้าสู่ระบบ",
      module: "ระบบ",
      detail: `เข้าสู่ระบบด้วย Username ${employee.username}`,
      type: "login",
    });

    localStorage.setItem(
      "pos_audit_logs",
      JSON.stringify(logs)
    );

    onLogin(employee);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">

      <div className="w-full max-w-md">

        {/* LOGO */}

        <div className="text-center mb-8">

          <div className="text-6xl mb-4">
            🏪
          </div>

          <h1 className="text-3xl font-bold text-white">
            Convenience POS
          </h1>

          <p className="text-slate-400 mt-2">
            ระบบจัดการร้านสะดวกซื้อ
          </p>

        </div>

        {/* LOGIN CARD */}

        <div className="bg-white rounded-2xl shadow-2xl p-8">

          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            เข้าสู่ระบบ
          </h2>

          <p className="text-slate-500 mb-6">
            กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ
          </p>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* USERNAME */}

            <div>

              <label className="block font-medium mb-2">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="กรอก Username"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block font-medium mb-2">
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="กรอก Password"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-3"
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition"
            >
              🔐 เข้าสู่ระบบ
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}