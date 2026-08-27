import { useState } from "react";

const defaultMembers = [
  {
    id: "M001",
    name: "สมชาย ใจดี",
    phone: "0812345678",
    points: 1250,
  },
  {
    id: "M002",
    name: "สมหญิง รักดี",
    phone: "0899999999",
    points: 850,
  },
  {
    id: "M003",
    name: "วิชัย รุ่งเรือง",
    phone: "0866666666",
    points: 420,
  },
];

export default function Members() {
  // =========================
  // MEMBERS
  // =========================

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem("pos_members");

    return saved
      ? JSON.parse(saved)
      : defaultMembers;
  });

  // =========================
  // SEARCH
  // =========================

  const [phone, setPhone] = useState("");
  const [member, setMember] = useState(null);

  // =========================
  // FORM
  // =========================

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  // =========================
  // EDIT
  // =========================

  const [editingMember, setEditingMember] = useState(null);

  // =========================
  // SAVE LOCAL STORAGE
  // =========================

  const saveMembers = (newMembers) => {
    setMembers(newMembers);

    localStorage.setItem(
      "pos_members",
      JSON.stringify(newMembers)
    );
  };

  // =========================
  // SEARCH MEMBER
  // =========================

  const searchMember = () => {
    if (!phone.trim()) {
      alert("กรุณากรอกเบอร์โทรศัพท์");
      return;
    }

    const result = members.find(
      (item) => item.phone === phone.trim()
    );

    setMember(result || null);
  };

  // =========================
  // OPEN ADD FORM
  // =========================

  const openAddForm = () => {
    setEditingMember(null);

    setForm({
      name: "",
      phone: "",
    });

    setShowForm(true);
  };

  // =========================
  // OPEN EDIT FORM
  // =========================

  const openEditForm = (item) => {
    setEditingMember(item);

    setForm({
      name: item.name,
      phone: item.phone,
    });

    setShowForm(true);
  };

  // =========================
  // HANDLE FORM
  // =========================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SAVE MEMBER
  // =========================

  const saveMember = () => {
    if (!form.name.trim()) {
      alert("กรุณากรอกชื่อสมาชิก");
      return;
    }

    if (!form.phone.trim()) {
      alert("กรุณากรอกเบอร์โทรศัพท์");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      alert("กรุณากรอกเบอร์โทรศัพท์ 10 หลัก");
      return;
    }

    // ตรวจเบอร์ซ้ำ
    const duplicatePhone = members.some(
      (item) =>
        item.phone === form.phone.trim() &&
        item.id !== editingMember?.id
    );

    if (duplicatePhone) {
      alert("เบอร์โทรศัพท์นี้เป็นสมาชิกอยู่แล้ว");
      return;
    }

    // =========================
    // EDIT
    // =========================

    if (editingMember) {
      const updatedMembers = members.map(
        (item) =>
          item.id === editingMember.id
            ? {
                ...item,
                name: form.name.trim(),
                phone: form.phone.trim(),
              }
            : item
      );

      saveMembers(updatedMembers);

      // ถ้ากำลังดูสมาชิกคนนี้อยู่
      const updatedMember = updatedMembers.find(
        (item) => item.id === editingMember.id
      );

      setMember(updatedMember);

      alert("แก้ไขข้อมูลสมาชิกเรียบร้อย");

      setShowForm(false);
      return;
    }

    // =========================
    // ADD
    // =========================

    const newIdNumber =
      members.length + 1;

    const newMember = {
      id:
        "M" +
        String(newIdNumber).padStart(3, "0"),
      name: form.name.trim(),
      phone: form.phone.trim(),
      points: 0,
    };

    const newMembers = [
      ...members,
      newMember,
    ];

    saveMembers(newMembers);

    setMember(newMember);

    alert("สมัครสมาชิกเรียบร้อย");

    setShowForm(false);
  };

  // =========================
  // DELETE MEMBER
  // =========================

  const deleteMember = (id) => {
    const confirmDelete = window.confirm(
      "ต้องการลบสมาชิกคนนี้ใช่หรือไม่?"
    );

    if (!confirmDelete) return;

    const newMembers = members.filter(
      (item) => item.id !== id
    );

    saveMembers(newMembers);

    setMember(null);

    setPhone("");

    alert("ลบสมาชิกเรียบร้อย");
  };

  // =========================
  // SHOW ALL MEMBERS
  // =========================

  const showAllMembers = () => {
    setMember(null);
    setPhone("");
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            👤 สมาชิก
          </h1>

          <p className="text-slate-500 mt-1">
            จัดการสมาชิกและ Loyalty Point
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-bold"
        >
          ＋ สมัครสมาชิก
        </button>

      </div>

      {/* =========================
          SUMMARY
      ========================= */}

      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-white rounded-xl shadow-sm p-5">

          <p className="text-slate-500">
            สมาชิกทั้งหมด
          </p>

          <p className="text-3xl font-bold mt-2">
            {members.length}
          </p>

        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">

          <p className="text-slate-500">
            คะแนนรวม
          </p>

          <p className="text-3xl font-bold text-yellow-600 mt-2">
            ⭐{" "}
            {members.reduce(
              (total, item) =>
                total + Number(item.points || 0),
              0
            )}
          </p>

        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">

          <p className="text-slate-500">
            สมาชิกที่มีคะแนน
          </p>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            {
              members.filter(
                (item) =>
                  Number(item.points || 0) > 0
              ).length
            }
          </p>

        </div>

      </div>

      {/* =========================
          SEARCH
      ========================= */}

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

        <h2 className="font-bold text-lg mb-4">
          🔍 ค้นหาสมาชิก
        </h2>

        <div className="flex gap-3">

          <input
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchMember();
              }
            }}
            placeholder="กรอกเบอร์โทรศัพท์"
            className="flex-1 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={searchMember}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-bold"
          >
            🔍 ค้นหา
          </button>

          <button
            onClick={showAllMembers}
            className="border border-slate-300 px-5 rounded-lg hover:bg-slate-50"
          >
            แสดงทั้งหมด
          </button>

        </div>

      </div>

      {/* =========================
          MEMBER RESULT
      ========================= */}

      {member && (

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-500">
                Member ID
              </p>

              <h2 className="text-xl font-bold">
                {member.id}
              </h2>

              <p className="mt-3">
                👤 {member.name}
              </p>

              <p className="text-slate-500">
                📱 {member.phone}
              </p>

            </div>

            <div className="flex items-center gap-5">

              <div className="bg-yellow-50 rounded-xl p-6 text-center">

                <p className="text-slate-500">
                  คะแนนสะสม
                </p>

                <div className="text-4xl font-bold text-yellow-600">
                  ⭐ {member.points}
                </div>

                <p className="text-sm text-slate-500 mt-1">
                  Points
                </p>

              </div>

              <div className="flex flex-col gap-2">

                <button
                  onClick={() =>
                    openEditForm(member)
                  }
                  className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200"
                >
                  ✏️ แก้ไข
                </button>

                <button
                  onClick={() =>
                    deleteMember(member.id)
                  }
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200"
                >
                  🗑️ ลบ
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* =========================
          NOT FOUND
      ========================= */}

      {!member && phone && (

        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-5 mb-6">
          ❌ ไม่พบสมาชิกจากเบอร์โทรนี้
        </div>

      )}

      {/* =========================
          MEMBER TABLE
      ========================= */}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="p-5 border-b">

          <h2 className="font-bold text-lg">
            รายชื่อสมาชิกทั้งหมด
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="text-left p-4">
                  Member ID
                </th>

                <th className="text-left p-4">
                  ชื่อสมาชิก
                </th>

                <th className="text-left p-4">
                  เบอร์โทรศัพท์
                </th>

                <th className="text-center p-4">
                  คะแนน
                </th>

                <th className="text-center p-4">
                  จัดการ
                </th>

              </tr>

            </thead>

            <tbody>

              {members.map((item) => (

                <tr
                  key={item.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="p-4 font-bold">
                    {item.id}
                  </td>

                  <td className="p-4">
                    {item.name}
                  </td>

                  <td className="p-4">
                    {item.phone}
                  </td>

                  <td className="p-4 text-center">

                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                      ⭐ {item.points}
                    </span>

                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() =>
                          setMember(item)
                        }
                        className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200"
                      >
                        👁️ ดู
                      </button>

                      <button
                        onClick={() =>
                          openEditForm(item)
                        }
                        className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() =>
                          deleteMember(item.id)
                        }
                        className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200"
                      >
                        🗑️
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showForm && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg p-7 shadow-2xl">

            {/* TITLE */}

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold text-slate-800">

                {editingMember
                  ? "✏️ แก้ไขสมาชิก"
                  : "➕ สมัครสมาชิก"}

              </h2>

              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="text-xl text-slate-500 hover:text-red-500"
              >
                ✕
              </button>

            </div>

            {/* NAME */}

            <div className="mb-4">

              <label className="block font-medium mb-2">
                ชื่อ-นามสกุล
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="เช่น สมชาย ใจดี"
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* PHONE */}

            <div className="mb-5">

              <label className="block font-medium mb-2">
                เบอร์โทรศัพท์
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={(e) => {
                  const value =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setForm({
                    ...form,
                    phone: value,
                  });
                }}
                maxLength={10}
                placeholder="เช่น 0812345678"
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* INFO */}

            {!editingMember && (

              <div className="bg-yellow-50 text-yellow-700 rounded-lg p-4 text-sm mb-5">

                ⭐ สมาชิกใหม่จะเริ่มต้นที่
                <strong> 0 Points</strong>

              </div>

            )}

            {/* BUTTON */}

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="flex-1 border border-slate-300 rounded-lg py-3 hover:bg-slate-50"
              >
                ยกเลิก
              </button>

              <button
                onClick={saveMember}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-bold"
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
