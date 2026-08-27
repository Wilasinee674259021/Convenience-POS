import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Members from "./pages/Members";
import Products from "./pages/Products";
import Promotions from "./pages/Promotions";
import Stock from "./pages/Stock";
import Purchasing from "./pages/Purchasing";
import Branches from "./pages/Branches";
import Employees from "./pages/Employees";
import AuditLog from "./pages/AuditLog";

function App() {
  // =========================
  // CURRENT USER
  // =========================

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("pos_current_user");

      if (!saved) {
        return null;
      }

      return JSON.parse(saved);
    } catch (error) {
      console.error(
        "ไม่สามารถอ่านข้อมูลผู้ใช้ได้:",
        error
      );

      localStorage.removeItem("pos_current_user");

      return null;
    }
  });

  // =========================
  // CURRENT PAGE
  // =========================
  // จำหน้าล่าสุดเอาไว้
  // เมื่อ Refresh จะกลับมาหน้าเดิม

  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const savedPage =
        localStorage.getItem("pos_current_page");

      return savedPage || "Dashboard";
    } catch (error) {
      console.error(
        "ไม่สามารถอ่านหน้าปัจจุบันได้:",
        error
      );

      return "Dashboard";
    }
  });

  // =========================
  // CHANGE PAGE
  // =========================

  const handlePageChange = (page) => {
    setCurrentPage(page);

    // จำหน้าปัจจุบัน
    localStorage.setItem(
      "pos_current_page",
      page
    );
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = (employee) => {
    if (!employee) {
      return;
    }

    // บันทึกผู้ใช้ไว้ใน localStorage
    localStorage.setItem(
      "pos_current_user",
      JSON.stringify(employee)
    );

    // ตั้งค่าผู้ใช้ปัจจุบัน
    setCurrentUser(employee);

    // หลัง Login ให้ไป Dashboard
    setCurrentPage("Dashboard");

    localStorage.setItem(
      "pos_current_page",
      "Dashboard"
    );
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "ต้องการออกจากระบบใช่หรือไม่?"
    );

    if (!confirmLogout) {
      return;
    }

    // =========================
    // SAVE AUDIT LOG
    // =========================

    try {
      const savedLogs =
        localStorage.getItem(
          "pos_audit_logs"
        );

      const logs = savedLogs
        ? JSON.parse(savedLogs)
        : [];

      logs.unshift({
        id: Date.now(),
        date: new Date().toLocaleString(
          "th-TH"
        ),
        employee:
          currentUser?.name ||
          "ไม่ทราบชื่อ",
        action: "ออกจากระบบ",
        module: "ระบบ",
        detail: "ออกจากระบบสำเร็จ",
        type: "logout",
      });

      localStorage.setItem(
        "pos_audit_logs",
        JSON.stringify(logs)
      );
    } catch (error) {
      console.error(
        "ไม่สามารถบันทึก Audit Log ได้:",
        error
      );
    }

    // =========================
    // CLEAR LOGIN
    // =========================

    localStorage.removeItem(
      "pos_current_user"
    );

    // เคลียร์หน้าที่จำไว้
    localStorage.removeItem(
      "pos_current_page"
    );

    setCurrentUser(null);

    setCurrentPage("Dashboard");
  };

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!currentUser) {
    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }

  // =========================
  // PERMISSION
  // =========================

  const allowedPages = {
    "พนักงาน": [
      "หน้าคิดเงิน",
      "สมาชิก",
    ],

    "ผู้จัดการ": [
      "Dashboard",
      "หน้าคิดเงิน",
      "สินค้า",
      "สมาชิก",
      "โปรโมชั่น",
      "สต๊อกสินค้า",
      "จัดซื้อ / รับสินค้า",
      "Audit Log",
    ],

    "ผู้ดูแลระบบ": [
      "Dashboard",
      "หน้าคิดเงิน",
      "สินค้า",
      "สมาชิก",
      "โปรโมชั่น",
      "สต๊อกสินค้า",
      "จัดซื้อ / รับสินค้า",
      "สาขา",
      "พนักงาน",
      "Audit Log",
    ],
  };

  const userRole = currentUser?.role;

  const userAllowedPages =
    allowedPages[userRole] || [];

  // =========================
  // CHECK SAVED PAGE
  // =========================

  // ถ้าหน้าที่จำไว้ ผู้ใช้ไม่มีสิทธิ์
  // ให้กลับไป Dashboard

  if (
    !userAllowedPages.includes(currentPage)
  ) {
    if (currentPage !== "Dashboard") {
      setCurrentPage("Dashboard");

      localStorage.setItem(
        "pos_current_page",
        "Dashboard"
      );
    }
  }

  // =========================
  // RENDER PAGE
  // =========================

  const renderPage = () => {
    // ถ้าผู้ใช้ไม่มีสิทธิ์เข้าหน้านั้น
    // ให้กลับไป Dashboard

    if (
      !userAllowedPages.includes(currentPage)
    ) {
      return <Dashboard />;
    }

    switch (currentPage) {
      case "Dashboard":
        return <Dashboard />;

      case "หน้าคิดเงิน":
        return <POS />;

      case "สินค้า":
        return <Products />;

      case "สมาชิก":
        return <Members />;

      case "โปรโมชั่น":
        return <Promotions />;

      case "สต๊อกสินค้า":
        return <Stock />;

      case "จัดซื้อ / รับสินค้า":
        return <Purchasing />;

      case "สาขา":
        return <Branches />;

      case "พนักงาน":
        return <Employees />;

      case "Audit Log":
        return <AuditLog />;

      default:
        return <Dashboard />;
    }
  };

  // =========================
  // MAIN APP
  // =========================

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1 min-w-0">
        {renderPage()}
      </main>

    </div>
  );
}

export default App;
