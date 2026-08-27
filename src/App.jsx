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

// =====================================================
// PERMISSION
// =====================================================

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

// =====================================================
// GET DEFAULT PAGE
// =====================================================

const getDefaultPage = (user) => {
  if (!user) {
    return "Dashboard";
  }

  const pages =
    allowedPages[user.role] || [];

  // พนักงานให้เข้าหน้าคิดเงินเป็นหน้าแรก
  if (user.role === "พนักงาน") {
    return "หน้าคิดเงิน";
  }

  // ผู้จัดการ / ผู้ดูแลระบบ
  if (pages.includes("Dashboard")) {
    return "Dashboard";
  }

  return pages[0] || "Dashboard";
};

// =====================================================
// GET SAVED PAGE
// =====================================================

const getInitialPage = () => {
  try {
    // อ่าน user ก่อน
    const savedUser =
      localStorage.getItem("pos_current_user");

    if (!savedUser) {
      return "Dashboard";
    }

    const user = JSON.parse(savedUser);

    const pages =
      allowedPages[user.role] || [];

    // อ่านหน้าที่เคยเปิดล่าสุด
    const savedPage =
      localStorage.getItem("pos_current_page");

    // ถ้ามีหน้าที่จำไว้ และมีสิทธิ์เข้าหน้านั้น
    if (
      savedPage &&
      pages.includes(savedPage)
    ) {
      return savedPage;
    }

    // ถ้าหน้าที่จำไว้ไม่มีสิทธิ์
    // ให้ใช้หน้าเริ่มต้นของ Role
    const defaultPage =
      getDefaultPage(user);

    localStorage.setItem(
      "pos_current_page",
      defaultPage
    );

    return defaultPage;

  } catch (error) {
    console.error(
      "ไม่สามารถอ่านหน้าปัจจุบันได้:",
      error
    );

    return "Dashboard";
  }
};

// =====================================================
// APP
// =====================================================

function App() {

  // ===================================================
  // CURRENT USER
  // ===================================================

  const [currentUser, setCurrentUser] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(
            "pos_current_user"
          );

        if (!saved) {
          return null;
        }

        return JSON.parse(saved);

      } catch (error) {
        console.error(
          "ไม่สามารถอ่านข้อมูลผู้ใช้ได้:",
          error
        );

        localStorage.removeItem(
          "pos_current_user"
        );

        return null;
      }
    });

  // ===================================================
  // CURRENT PAGE
  // ===================================================

  const [currentPage, setCurrentPage] =
    useState(getInitialPage);

  // ===================================================
  // CHANGE PAGE
  // ===================================================

  const handlePageChange = (page) => {

    // ตรวจสอบสิทธิ์ก่อนเปลี่ยนหน้า
    const pages =
      allowedPages[currentUser?.role] || [];

    if (!pages.includes(page)) {
      alert(
        "คุณไม่มีสิทธิ์เข้าหน้านี้"
      );
      return;
    }

    // เปลี่ยนหน้า
    setCurrentPage(page);

    // จำหน้าปัจจุบัน
    localStorage.setItem(
      "pos_current_page",
      page
    );
  };

  // ===================================================
  // LOGIN
  // ===================================================

  const handleLogin = (employee) => {

    if (!employee) {
      return;
    }

    // บันทึกผู้ใช้
    localStorage.setItem(
      "pos_current_user",
      JSON.stringify(employee)
    );

    // ตั้งค่าผู้ใช้
    setCurrentUser(employee);

    // ===============================================
    // กำหนดหน้าแรกตาม Role
    // ===============================================

    const firstPage =
      getDefaultPage(employee);

    setCurrentPage(firstPage);

    localStorage.setItem(
      "pos_current_page",
      firstPage
    );
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {

    const confirmLogout =
      window.confirm(
        "ต้องการออกจากระบบใช่หรือไม่?"
      );

    if (!confirmLogout) {
      return;
    }

    // ===============================================
    // SAVE AUDIT LOG
    // ===============================================

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

        date:
          new Date().toLocaleString(
            "th-TH"
          ),

        employee:
          currentUser?.name ||
          "ไม่ทราบชื่อ",

        action: "ออกจากระบบ",

        module: "ระบบ",

        detail:
          "ออกจากระบบสำเร็จ",

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

    // ===============================================
    // CLEAR LOGIN
    // ===============================================

    localStorage.removeItem(
      "pos_current_user"
    );

    // ล้างหน้าที่จำไว้
    localStorage.removeItem(
      "pos_current_page"
    );

    setCurrentUser(null);

    setCurrentPage("Dashboard");
  };

  // ===================================================
  // LOGIN SCREEN
  // ===================================================

  if (!currentUser) {
    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }

  // ===================================================
  // USER ROLE
  // ===================================================

  const userRole =
    currentUser?.role;

  const userAllowedPages =
    allowedPages[userRole] || [];

  // ===================================================
  // CHECK CURRENT PAGE PERMISSION
  // ===================================================

  let safePage = currentPage;

  // ถ้าหน้าที่เปิดอยู่ไม่มีสิทธิ์
  if (
    !userAllowedPages.includes(
      currentPage
    )
  ) {
    safePage =
      getDefaultPage(currentUser);
  }

  // ===================================================
  // RENDER PAGE
  // ===================================================

  const renderPage = () => {

    switch (safePage) {

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

  // ===================================================
  // MAIN APP
  // ===================================================

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar
        currentPage={safePage}
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
