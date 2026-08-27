import { useState } from "react";

export default function Members() {
  const [phone, setPhone] = useState("");
  const [member, setMember] = useState(null);

  const members = [
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

  const searchMember = () => {
    const result = members.find(
      (item) => item.phone === phone
    );

    setMember(result || null);
  };

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            👤 สมาชิก
          </h1>

          <p className="text-slate-500 mt-1">
            จัดการสมาชิกและ Loyalty Point
          </p>
        </div>

        <button className="bg-blue-600 text-white px-5 py-3 rounded-lg">
          + สมัครสมาชิก
        </button>

      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">

        <h2 className="font-bold text-lg mb-4">
          ค้นหาสมาชิก
        </h2>

        <div className="flex gap-3">

          <input
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            placeholder="กรอกเบอร์โทรศัพท์"
            className="flex-1 border border-slate-300 rounded-lg px-4 py-3"
          />

          <button
            onClick={searchMember}
            className="bg-blue-600 text-white px-6 rounded-lg"
          >
            🔍 ค้นหา
          </button>

        </div>

      </div>

      {member && (

        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">

          <div className="flex justify-between">

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

          </div>

        </div>

      )}

      {!member && phone && (

        <div className="bg-red-50 text-red-600 rounded-xl p-5 mt-6">
          ไม่พบสมาชิกจากเบอร์โทรนี้
        </div>

      )}

    </div>
  );
}
