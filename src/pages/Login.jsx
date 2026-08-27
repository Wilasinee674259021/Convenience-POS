import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // ===============================
  // LOGIN
  // ===============================

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (!username.trim() || !password) {
      setError("กรุณากรอก Username และ Password");
      return;
    }

    // ===============================
    // โหลดข้อมูลพนักงาน
    // ===============================

    const savedEmployees =
      localStorage.getItem("pos_employees");

    let employees = [];

    try {
      employees = savedEmployees
        ? JSON.parse(savedEmployees)
        : [];
    } catch (error) {
      console.error(
        "ไม่สามารถอ่านข้อมูลพนักงานได้:",
        error
      );

      employees = [];
    }

    // ===============================
    // สร้างบัญชีเริ่มต้น
    // ===============================

    if (employees.length === 0) {
      employees = [
        {
          id: 1,
          name: "ผู้ดูแลระบบ",
          username: "admin",
          password: "1234",
          role: "ผู้ดูแลระบบ",
          position: "ผู้ดูแลระบบ",
          status: "เปิดใช้งาน",
        },
        {
          id: 2,
          name: "พนักงานหน้าร้าน",
          username: "staff",
          password: "1234",
          role: "พนักงาน",
          position: "พนักงาน",
          status: "เปิดใช้งาน",
        },
        {
          id: 3,
          name: "ผู้จัดการร้าน",
          username: "manager",
          password: "1234",
          role: "ผู้จัดการ",
          position: "ผู้จัดการ",
          status: "เปิดใช้งาน",
        },
      ];

      localStorage.setItem(
        "pos_employees",
        JSON.stringify(employees)
      );
    }

    // ===============================
    // ตรวจสอบ Username + Password
    // ===============================

    const employee = employees.find(
      (item) =>
        String(item.username || "")
          .toLowerCase()
          .trim() === username.toLowerCase().trim() &&
        String(item.password || "") === password
    );

    // ===============================
    // Login ไม่สำเร็จ
    // ===============================

    if (!employee) {
      setError(
        "Username หรือ Password ไม่ถูกต้อง"
      );
      return;
    }

    // ===============================
    // ตรวจสอบสถานะบัญชี
    // ===============================

    if (
      employee.status &&
      employee.status !== "เปิดใช้งาน"
    ) {
      setError(
        "บัญชีนี้ถูกปิดใช้งาน กรุณาติดต่อผู้ดูแลระบบ"
      );
      return;
    }

    // ===============================
    // แปลง Role เก่าให้เป็น Role ใหม่
    // ===============================

    let userRole = employee.role;

    if (userRole === "admin") {
      userRole = "ผู้ดูแลระบบ";
    }

    if (userRole === "staff") {
      userRole = "พนักงาน";
    }

    if (userRole === "manager") {
      userRole = "ผู้จัดการ";
    }

    // ===============================
    // สร้างข้อมูลผู้ใช้ที่ Login
    // ===============================

    const loggedInUser = {
      ...employee,
      role: userRole,
    };

    // ===============================
    // อัปเดต Role ในข้อมูลพนักงาน
    // ===============================

    const updatedEmployees = employees.map(
      (item) => {
        if (item.id === employee.id) {
          return {
            ...item,
            role: userRole,
          };
        }

        return item;
      }
    );

    localStorage.setItem(
      "pos_employees",
      JSON.stringify(updatedEmployees)
    );

    // ===============================
    // บันทึกผู้ใช้งานปัจจุบัน
    // ===============================

    localStorage.setItem(
      "pos_current_user",
      JSON.stringify(loggedInUser)
    );

    // ===============================
    // บันทึก Audit Log
    // ===============================

    let logs = [];

    try {
      const savedLogs =
        localStorage.getItem(
          "pos_audit_logs"
        );

      logs = savedLogs
        ? JSON.parse(savedLogs)
        : [];
    } catch (error) {
      console.error(
        "ไม่สามารถอ่าน Audit Log ได้:",
        error
      );

      logs = [];
    }

    logs.unshift({
      id: Date.now(),
      date: new Date().toLocaleString(
        "th-TH"
      ),
      employee: loggedInUser.name,
      action: "เข้าสู่ระบบ",
      module: "ระบบ",
      detail: `เข้าสู่ระบบด้วย Username ${loggedInUser.username}`,
      type: "login",
    });

    localStorage.setItem(
      "pos_audit_logs",
      JSON.stringify(logs)
    );

    // ===============================
    // เข้าสู่ระบบ
    // ===============================

    onLogin(loggedInUser);
  };

  // ===============================
  // LOGIN PAGE
  // ===============================

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">

      <div className="w-full max-w-md">

        {/* ===============================
            LOGO
        =============================== */}

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

        {/* ===============================
            LOGIN CARD
        =============================== */}

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

            {/* ===============================
                USERNAME
            =============================== */}

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
                autoComplete="username"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* ===============================
                PASSWORD
            =============================== */}

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
                  autoComplete="current-password"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-3 text-lg"
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>

            {/* ===============================
                ERROR
            =============================== */}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* ===============================
                LOGIN BUTTON
            =============================== */}

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
