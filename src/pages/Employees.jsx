import { useEffect, useState } from "react";

// ======================================================
// พนักงานเริ่มต้น
// ======================================================

const defaultEmployees = [
  {
    id: 1,
    employeeCode: "EMP001",
    name: "ผู้ดูแลระบบ",
    username: "admin",
    password: "1234",
    position: "ผู้ดูแลระบบ",
    branch: "สาขาหลัก",
    role: "ผู้ดูแลระบบ",
    status: "เปิดใช้งาน",
  },
  {
    id: 2,
    employeeCode: "EMP002",
    name: "พนักงานหน้าร้าน",
    username: "staff",
    password: "1234",
    position: "พนักงานขาย",
    branch: "สาขาหลัก",
    role: "พนักงาน",
    status: "เปิดใช้งาน",
  },
  {
    id: 3,
    employeeCode: "EMP003",
    name: "ผู้จัดการร้าน",
    username: "manager",
    password: "1234",
    position: "ผู้จัดการ",
    branch: "สาขาหลัก",
    role: "ผู้จัดการ",
    status: "เปิดใช้งาน",
  },
];

// ======================================================
// แปลง Role เก่าให้เป็น Role ใหม่
// ======================================================

const normalizeRole = (role) => {
  if (role === "admin") {
    return "ผู้ดูแลระบบ";
  }

  if (role === "staff") {
    return "พนักงาน";
  }

  if (role === "manager") {
    return "ผู้จัดการ";
  }

  if (
    role === "ผู้ดูแลระบบ" ||
    role === "พนักงาน" ||
    role === "ผู้จัดการ"
  ) {
    return role;
  }

  return "พนักงาน";
};

// ======================================================
// ทำความสะอาดข้อมูลพนักงาน
// ======================================================

const normalizeEmployee = (employee, index) => {
  return {
    id: employee?.id ?? Date.now() + index,

    employeeCode:
      employee?.employeeCode ||
      `EMP${String(index + 1).padStart(3, "0")}`,

    name:
      employee?.name ||
      "ไม่ระบุชื่อ",

    username:
      employee?.username ||
      `employee${index + 1}`,

    password:
      employee?.password ||
      "1234",

    position:
      employee?.position ||
      "พนักงานขาย",

    branch:
      employee?.branch ||
      "สาขาหลัก",

    role:
      normalizeRole(employee?.role),

    status:
      employee?.status ||
      "เปิดใช้งาน",
  };
};

// ======================================================
// COMPONENT
// ======================================================

export default function Employees() {
  // ====================================================
  // EMPLOYEES
  // ====================================================

  const [employees, setEmployees] = useState(() => {
    try {
      const saved =
        localStorage.getItem("pos_employees");

      if (!saved) {
        return defaultEmployees;
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        return defaultEmployees;
      }

      return parsed.map(normalizeEmployee);
    } catch (error) {
      console.error(
        "ไม่สามารถโหลดข้อมูลพนักงานได้:",
        error
      );

      return defaultEmployees;
    }
  });

  // ====================================================
  // BRANCHES
  // ====================================================

  const [branches, setBranches] = useState([]);

  // ====================================================
  // SEARCH
  // ====================================================

  const [search, setSearch] = useState("");

  // ====================================================
  // FORM
  // ====================================================

  const [showForm, setShowForm] =
    useState(false);

  const [editingEmployee, setEditingEmployee] =
    useState(null);

  const [showPassword, setShowPassword] =
    useState(false);

  const [form, setForm] = useState({
    employeeCode: "",
    name: "",
    username: "",
    password: "",
    position: "พนักงานขาย",
    branch: "สาขาหลัก",
    role: "พนักงาน",
  });

  // ====================================================
  // SAVE EMPLOYEES
  // ====================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        "pos_employees",
        JSON.stringify(employees)
      );
    } catch (error) {
      console.error(
        "ไม่สามารถบันทึกข้อมูลพนักงานได้:",
        error
      );
    }
  }, [employees]);

  // ====================================================
  // LOAD BRANCHES
  // ====================================================

  useEffect(() => {
    try {
      const savedBranches =
        localStorage.getItem("pos_branches");

      if (!savedBranches) {
        setBranches([]);
        return;
      }

      const parsedBranches =
        JSON.parse(savedBranches);

      if (Array.isArray(parsedBranches)) {
        setBranches(parsedBranches);
      } else {
        setBranches([]);
      }
    } catch (error) {
      console.error(
        "ไม่สามารถโหลดข้อมูลสาขาได้:",
        error
      );

      setBranches([]);
    }
  }, []);

  // ====================================================
  // AUDIT LOG
  // ====================================================

  const addAuditLog = (
    action,
    detail
  ) => {
    try {
      const currentUser =
        localStorage.getItem(
          "pos_current_user"
        );

      const user = currentUser
        ? JSON.parse(currentUser)
        : null;

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
          user?.name ||
          "ไม่ทราบชื่อ",
        action,
        module: "จัดการพนักงาน",
        detail,
        type: "employee",
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
  };

  // ====================================================
  // OPEN ADD FORM
  // ====================================================

  const openAddForm = () => {
    setEditingEmployee(null);

    setForm({
      employeeCode: "",
      name: "",
      username: "",
      password: "",
      position: "พนักงานขาย",
      branch:
        branches.length > 0
          ? branches[0]?.name || "สาขาหลัก"
          : "สาขาหลัก",
      role: "พนักงาน",
    });

    setShowPassword(false);
    setShowForm(true);
  };

  // ====================================================
  // OPEN EDIT FORM
  // ====================================================

  const openEditForm = (employee) => {
    if (!employee) {
      return;
    }

    setEditingEmployee(employee);

    setForm({
      employeeCode:
        employee.employeeCode || "",
      name:
        employee.name || "",
      username:
        employee.username || "",
      password:
        employee.password || "",
      position:
        employee.position || "พนักงานขาย",
      branch:
        employee.branch || "สาขาหลัก",
      role:
        normalizeRole(employee.role),
    });

    setShowPassword(false);
    setShowForm(true);
  };

  // ====================================================
  // HANDLE CHANGE
  // ====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ====================================================
  // SAVE EMPLOYEE
  // ====================================================

  const saveEmployee = () => {
    const employeeCode =
      form.employeeCode.trim();

    const name =
      form.name.trim();

    const username =
      form.username.trim();

    const password =
      form.password;

    const position =
      form.position.trim();

    const branch =
      form.branch.trim();

    const role =
      normalizeRole(form.role);

    // ------------------------------------------
    // ตรวจข้อมูล
    // ------------------------------------------

    if (
      !employeeCode ||
      !name ||
      !username ||
      !password ||
      !position ||
      !branch ||
      !role
    ) {
      alert(
        "กรุณากรอกข้อมูลให้ครบ"
      );

      return;
    }

    // ------------------------------------------
    // ตรวจรหัสพนักงานซ้ำ
    // ------------------------------------------

    const duplicateCode =
      employees.some(
        (employee) =>
          String(
            employee.employeeCode || ""
          )
            .toLowerCase()
            .trim() ===
            employeeCode
              .toLowerCase()
              .trim() &&
          employee.id !==
            editingEmployee?.id
      );

    if (duplicateCode) {
      alert(
        "รหัสพนักงานนี้มีอยู่แล้ว"
      );

      return;
    }

    // ------------------------------------------
    // ตรวจ Username ซ้ำ
    // ------------------------------------------

    const duplicateUsername =
      employees.some(
        (employee) =>
          String(
            employee.username || ""
          )
            .toLowerCase()
            .trim() ===
            username
              .toLowerCase()
              .trim() &&
          employee.id !==
            editingEmployee?.id
      );

    if (duplicateUsername) {
      alert(
        "Username นี้มีอยู่แล้ว"
      );

      return;
    }

    // ------------------------------------------
    // EDIT
    // ------------------------------------------

    if (editingEmployee) {
      const updatedEmployees =
        employees.map(
          (employee) =>
            employee.id ===
            editingEmployee.id
              ? {
                  ...employee,
                  employeeCode,
                  name,
                  username,
                  password,
                  position,
                  branch,
                  role,
                }
              : employee
        );

      setEmployees(
        updatedEmployees
      );

      addAuditLog(
        "แก้ไขพนักงาน",
        `แก้ไขข้อมูลพนักงาน ${name} (${username})`
      );

      // ถ้าแก้ข้อมูลตัวเอง
      // ให้อัปเดต current user ด้วย
      try {
        const savedCurrentUser =
          localStorage.getItem(
            "pos_current_user"
          );

        if (savedCurrentUser) {
          const currentUser =
            JSON.parse(
              savedCurrentUser
            );

          if (
            currentUser?.id ===
            editingEmployee.id
          ) {
            const updatedCurrentUser = {
              ...currentUser,
              employeeCode,
              name,
              username,
              password,
              position,
              branch,
              role,
            };

            localStorage.setItem(
              "pos_current_user",
              JSON.stringify(
                updatedCurrentUser
              )
            );
          }
        }
      } catch (error) {
        console.error(
          "ไม่สามารถอัปเดตผู้ใช้ปัจจุบันได้:",
          error
        );
      }

      alert(
        "แก้ไขข้อมูลพนักงานเรียบร้อย"
      );
    }

    // ------------------------------------------
    // ADD
    // ------------------------------------------

    else {
      const newEmployee = {
        id: Date.now(),
        employeeCode,
        name,
        username,
        password,
        position,
        branch,
        role,
        status: "เปิดใช้งาน",
      };

      setEmployees((previous) => [
        ...previous,
        newEmployee,
      ]);

      addAuditLog(
        "เพิ่มพนักงาน",
        `เพิ่มพนักงาน ${name} (${username})`
      );

      alert(
        "เพิ่มพนักงานเรียบร้อย"
      );
    }

    setShowForm(false);
    setEditingEmployee(null);
  };

  // ====================================================
  // DELETE EMPLOYEE
  // ====================================================

  const deleteEmployee = (id) => {
    const employee =
      employees.find(
        (item) =>
          item.id === id
      );

    if (!employee) {
      return;
    }

    // ห้ามลบ admin
    if (
      employee.username === "admin"
    ) {
      alert(
        "ไม่สามารถลบบัญชี admin ได้"
      );

      return;
    }

    // ห้ามลบบัญชีตัวเอง
    try {
      const savedCurrentUser =
        localStorage.getItem(
          "pos_current_user"
        );

      if (savedCurrentUser) {
        const currentUser =
          JSON.parse(
            savedCurrentUser
          );

        if (
          currentUser?.id === id
        ) {
          alert(
            "ไม่สามารถลบบัญชีที่กำลังเข้าสู่ระบบอยู่ได้"
          );

          return;
        }
      }
    } catch (error) {
      console.error(error);
    }

    const confirmDelete =
      window.confirm(
        `ต้องการลบพนักงาน "${employee.name}" ใช่หรือไม่?`
      );

    if (!confirmDelete) {
      return;
    }

    setEmployees(
      (previous) =>
        previous.filter(
          (item) =>
            item.id !== id
        )
    );

    addAuditLog(
      "ลบพนักงาน",
      `ลบพนักงาน ${employee.name} (${employee.username})`
    );

    alert(
      "ลบพนักงานเรียบร้อย"
    );
  };

  // ====================================================
  // TOGGLE STATUS
  // ====================================================

  const toggleStatus = (id) => {
    const employee =
      employees.find(
        (item) =>
          item.id === id
      );

    if (!employee) {
      return;
    }

    // ห้ามปิดบัญชี admin
    if (
      employee.username === "admin"
    ) {
      alert(
        "ไม่สามารถปิดใช้งานบัญชี admin ได้"
      );

      return;
    }

    const newStatus =
      employee.status ===
      "เปิดใช้งาน"
        ? "ปิดใช้งาน"
        : "เปิดใช้งาน";

    setEmployees(
      (previous) =>
        previous.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  status:
                    newStatus,
                }
              : item
        )
    );

    addAuditLog(
      newStatus ===
        "เปิดใช้งาน"
        ? "เปิดใช้งานพนักงาน"
        : "ปิดใช้งานพนักงาน",
      `${newStatus}บัญชี ${employee.name}`
    );
  };

  // ====================================================
  // SEARCH
  // ====================================================

  const filteredEmployees =
    employees.filter(
      (employee) => {
        const keyword =
          search
            .toLowerCase()
            .trim();

        if (!keyword) {
          return true;
        }

        const employeeCode =
          String(
            employee.employeeCode ||
              ""
          ).toLowerCase();

        const name =
          String(
            employee.name || ""
          ).toLowerCase();

        const username =
          String(
            employee.username ||
              ""
          ).toLowerCase();

        const position =
          String(
            employee.position ||
              ""
          ).toLowerCase();

        const branch =
          String(
            employee.branch || ""
          ).toLowerCase();

        const role =
          String(
            employee.role || ""
          ).toLowerCase();

        return (
          employeeCode.includes(
            keyword
          ) ||
          name.includes(keyword) ||
          username.includes(
            keyword
          ) ||
          position.includes(
            keyword
          ) ||
          branch.includes(keyword) ||
          role.includes(keyword)
        );
      }
    );

  // ====================================================
  // SUMMARY
  // ====================================================

  const activeEmployees =
    employees.filter(
      (employee) =>
        employee.status ===
        "เปิดใช้งาน"
    ).length;

  const inactiveEmployees =
    employees.filter(
      (employee) =>
        employee.status ===
        "ปิดใช้งาน"
    ).length;

  const adminEmployees =
    employees.filter(
      (employee) =>
        normalizeRole(
          employee.role
        ) ===
        "ผู้ดูแลระบบ"
    ).length;

  const managerEmployees =
    employees.filter(
      (employee) =>
        normalizeRole(
          employee.role
        ) ===
        "ผู้จัดการ"
    ).length;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex justify-between items-center mb-7">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            👨‍💼 จัดการพนักงาน
          </h1>

          <p className="text-slate-500 mt-1">
            จัดการบัญชีพนักงาน ตำแหน่ง และสิทธิ์การใช้งาน
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          ＋ เพิ่มพนักงาน
        </button>

      </div>

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-slate-500">
            พนักงานทั้งหมด
          </p>

          <p className="text-3xl font-bold mt-2">
            {employees.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-slate-500">
            เปิดใช้งาน
          </p>

          <p className="text-3xl font-bold text-green-600 mt-2">
            {activeEmployees}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-slate-500">
            ปิดใช้งาน
          </p>

          <p className="text-3xl font-bold text-red-500 mt-2">
            {inactiveEmployees}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-slate-500">
            ผู้จัดการ
          </p>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            {managerEmployees}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-slate-500">
            ผู้ดูแลระบบ
          </p>

          <p className="text-3xl font-bold text-purple-600 mt-2">
            {adminEmployees}
          </p>
        </div>

      </div>

      {/* ==================================================
          SEARCH
      ================================================== */}

      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="🔍 ค้นหารหัสพนักงาน / ชื่อ / Username / ตำแหน่ง / สาขา / สิทธิ์"
          className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* ==================================================
          TABLE
      ================================================== */}

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">

        <table className="w-full min-w-[1000px]">

          <thead className="bg-slate-100">

            <tr>

              <th className="text-left p-4">
                รหัส
              </th>

              <th className="text-left p-4">
                พนักงาน
              </th>

              <th className="text-left p-4">
                Username
              </th>

              <th className="text-left p-4">
                ตำแหน่ง
              </th>

              <th className="text-left p-4">
                สาขา
              </th>

              <th className="text-center p-4">
                สิทธิ์
              </th>

              <th className="text-center p-4">
                สถานะ
              </th>

              <th className="text-center p-4">
                จัดการ
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredEmployees.map(
              (employee) => {

                const role =
                  normalizeRole(
                    employee.role
                  );

                return (
                  <tr
                    key={employee.id}
                    className="border-t hover:bg-slate-50"
                  >

                    {/* CODE */}

                    <td className="p-4 font-bold">
                      {employee.employeeCode}
                    </td>

                    {/* NAME */}

                    <td className="p-4">

                      <div className="font-bold">
                        {employee.name}
                      </div>

                    </td>

                    {/* USERNAME */}

                    <td className="p-4">
                      {employee.username}
                    </td>

                    {/* POSITION */}

                    <td className="p-4">
                      {employee.position}
                    </td>

                    {/* BRANCH */}

                    <td className="p-4">
                      {employee.branch}
                    </td>

                    {/* ROLE */}

                    <td className="p-4 text-center">

                      <span
                        className={
                          role ===
                          "ผู้ดูแลระบบ"
                            ? "bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                            : role ===
                              "ผู้จัดการ"
                            ? "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                            : "bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
                        }
                      >
                        {role}
                      </span>

                    </td>

                    {/* STATUS */}

                    <td className="p-4 text-center">

                      <button
                        type="button"
                        onClick={() =>
                          toggleStatus(
                            employee.id
                          )
                        }
                        className={
                          employee.status ===
                          "เปิดใช้งาน"
                            ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                            : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                        }
                      >
                        {employee.status}
                      </button>

                    </td>

                    {/* ACTION */}

                    <td className="p-4">

                      <div className="flex justify-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(
                              employee
                            )
                          }
                          className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
                          title="แก้ไข"
                        >
                          ✏️
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteEmployee(
                              employee.id
                            )
                          }
                          className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition"
                          title="ลบ"
                        >
                          🗑️
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

        {filteredEmployees.length ===
          0 && (
          <div className="text-center py-12 text-slate-400">
            ไม่พบพนักงาน
          </div>
        )}

      </div>

      {/* ==================================================
          FORM MODAL
      ================================================== */}

      {showForm && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-[650px] max-h-[90vh] overflow-y-auto p-7 shadow-xl">

            {/* TITLE */}

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                {editingEmployee
                  ? "✏️ แก้ไขพนักงาน"
                  : "➕ เพิ่มพนักงาน"}
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="text-xl text-slate-500 hover:text-red-500"
              >
                ✕
              </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* EMPLOYEE CODE */}

              <div>

                <label className="block mb-2 font-medium">
                  รหัสพนักงาน
                </label>

                <input
                  type="text"
                  name="employeeCode"
                  value={
                    form.employeeCode
                  }
                  onChange={handleChange}
                  placeholder="เช่น EMP003"
                  className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* NAME */}

              <div>

                <label className="block mb-2 font-medium">
                  ชื่อ-นามสกุล
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="ชื่อพนักงาน"
                  className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* USERNAME */}

              <div>

                <label className="block mb-2 font-medium">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={
                    form.username
                  }
                  onChange={handleChange}
                  placeholder="Username สำหรับเข้าสู่ระบบ"
                  className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* PASSWORD */}

              <div>

                <label className="block mb-2 font-medium">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={
                      form.password
                    }
                    onChange={handleChange}
                    placeholder="รหัสผ่าน"
                    className="w-full border rounded-lg p-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 top-3"
                  >
                    {showPassword
                      ? "🙈"
                      : "👁️"}
                  </button>

                </div>

              </div>

              {/* POSITION */}

              <div>

                <label className="block mb-2 font-medium">
                  ตำแหน่ง
                </label>

                <select
                  name="position"
                  value={
                    form.position
                  }
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="พนักงานขาย">
                    พนักงานขาย
                  </option>

                  <option value="Counter Staff">
                    Counter Staff
                  </option>

                  <option value="Play Area Staff">
                    Play Area Staff
                  </option>

                  <option value="ผู้จัดการ">
                    ผู้จัดการ
                  </option>

                  <option value="ผู้ดูแลระบบ">
                    ผู้ดูแลระบบ
                  </option>

                </select>

              </div>

              {/* BRANCH */}

              <div>

                <label className="block mb-2 font-medium">
                  สาขา
                </label>

                <select
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  {branches.length >
                  0 ? (
                    branches.map(
                      (branch) => (
                        <option
                          key={
                            branch.id
                          }
                          value={
                            branch.name
                          }
                        >
                          {
                            branch.name
                          }
                        </option>
                      )
                    )
                  ) : (
                    <option value="สาขาหลัก">
                      สาขาหลัก
                    </option>
                  )}

                </select>

              </div>

              {/* ROLE */}

              <div className="col-span-1 md:col-span-2">

                <label className="block mb-2 font-medium">
                  สิทธิ์การใช้งาน
                </label>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="พนักงาน">
                    พนักงาน
                  </option>

                  <option value="ผู้จัดการ">
                    ผู้จัดการ
                  </option>

                  <option value="ผู้ดูแลระบบ">
                    ผู้ดูแลระบบ
                  </option>

                </select>

              </div>

            </div>

            {/* ==================================================
                ROLE INFO
            ================================================== */}

            <div className="bg-blue-50 rounded-xl p-4 mt-5 text-sm text-blue-700">

              <p className="font-bold mb-2">
                🔐 สิทธิ์การใช้งาน
              </p>

              <p>
                • พนักงาน: Dashboard, หน้าคิดเงิน และสมาชิก
              </p>

              <p>
                • ผู้จัดการ: สินค้า สต๊อก สมาชิก โปรโมชั่น จัดซื้อ และ Audit Log
              </p>

              <p>
                • ผู้ดูแลระบบ: สามารถจัดการระบบและพนักงานทั้งหมด
              </p>

            </div>

            {/* ==================================================
                BUTTON
            ================================================== */}

            <div className="flex gap-3 mt-7">

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingEmployee(null);
                }}
                className="flex-1 border rounded-lg py-3 hover:bg-slate-100 transition"
              >
                ยกเลิก
              </button>

              <button
                type="button"
                onClick={saveEmployee}
                className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-bold hover:bg-blue-700 transition"
              >
                💾 บันทึก
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
