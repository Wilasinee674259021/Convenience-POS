import { useEffect, useMemo, useState } from "react";

export default function POS() {
  // =========================
  // PRODUCTS
  // =========================

  const products = [
    {
      id: 1,
      code: "P001",
      name: "น้ำดื่ม 600ml",
      price: 7,
      category: "เครื่องดื่ม",
      stock: 50,
    },
    {
      id: 2,
      code: "P002",
      name: "กาแฟกระป๋อง",
      price: 20,
      category: "เครื่องดื่ม",
      stock: 30,
    },
    {
      id: 3,
      code: "P003",
      name: "ขนมปัง",
      price: 25,
      category: "อาหาร",
      stock: 25,
    },
    {
      id: 4,
      code: "P004",
      name: "นม UHT",
      price: 15,
      category: "เครื่องดื่ม",
      stock: 40,
    },
    {
      id: 5,
      code: "P005",
      name: "มันฝรั่งทอด",
      price: 30,
      category: "ขนม",
      stock: 20,
    },
    {
      id: 6,
      code: "P006",
      name: "ช็อกโกแลต",
      price: 35,
      category: "ขนม",
      stock: 15,
    },
    {
      id: 7,
      code: "P007",
      name: "ไอศกรีม",
      price: 25,
      category: "ขนม",
      stock: 20,
    },
    {
      id: 8,
      code: "P008",
      name: "น้ำส้ม",
      price: 25,
      category: "เครื่องดื่ม",
      stock: 25,
    },
    {
      id: 9,
      code: "P009",
      name: "ข้าวเกรียบ",
      price: 20,
      category: "ขนม",
      stock: 20,
    },
  ];

  // =========================
  // STATE
  // =========================

  const [cart, setCart] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("ทั้งหมด");

  const [memberPhone, setMemberPhone] = useState("");

  const [member, setMember] = useState(null);

  // ดึงสมาชิกจาก localStorage
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem("pos_members");

      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("ไม่สามารถอ่านข้อมูลสมาชิกได้", error);
      return [];
    }
  });

  const [usePoints, setUsePoints] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState(null);

  const [cashReceived, setCashReceived] = useState("");

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [receiptNumber, setReceiptNumber] = useState("");

  // =========================
  // LOAD MEMBERS
  // =========================

  useEffect(() => {
    const loadMembers = () => {
      try {
        const saved = localStorage.getItem("pos_members");

        if (saved) {
          setMembers(JSON.parse(saved));
        } else {
          setMembers([]);
        }
      } catch (error) {
        console.error("ไม่สามารถโหลดสมาชิกได้", error);
        setMembers([]);
      }
    };

    loadMembers();

    // รับข้อมูลเมื่อ localStorage เปลี่ยน
    window.addEventListener("storage", loadMembers);

    return () => {
      window.removeEventListener("storage", loadMembers);
    };
  }, []);

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const keyword = search.toLowerCase().trim();

      const matchSearch =
        product.name.toLowerCase().includes(keyword) ||
        product.code.toLowerCase().includes(keyword);

      const matchCategory =
        category === "ทั้งหมด" ||
        product.category === category;

      return matchSearch && matchCategory;
    });
  }, [search, category]);

  // =========================
  // CART
  // =========================

  const addToCart = (product) => {
    const existing = cart.find(
      (item) => item.id === product.id
    );

    if (existing) {
      if (existing.qty >= product.stock) {
        alert("สินค้าในสต็อกมีไม่เพียงพอ");
        return;
      }

      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          qty: 1,
        },
      ]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) => {
        if (item.id !== id) return item;

        if (item.qty >= item.stock) {
          alert("สินค้าในสต็อกมีไม่เพียงพอ");
          return item;
        }

        return {
          ...item,
          qty: item.qty + 1,
        };
      })
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: item.qty - 1,
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart(
      cart.filter((item) => item.id !== id)
    );
  };

  // =========================
  // TOTAL
  // =========================

  const totalItems = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  // =========================
  // PROMOTION
  // =========================

  let promotionDiscount = 0;
  let promotionText = "";

  // ซื้อครบ 100 บาท ลด 10 บาท
  if (subtotal >= 100) {
    promotionDiscount = 10;
    promotionText = "ซื้อครบ ฿100 ลด ฿10";
  }

  // ซื้อช็อกโกแลต 2 ชิ้น ราคา 60 บาท
  const chocolate = cart.find(
    (item) => item.id === 6
  );

  if (chocolate && chocolate.qty >= 2) {
    const sets = Math.floor(
      chocolate.qty / 2
    );

    const normalPrice =
      sets * 2 * chocolate.price;

    const promoPrice = sets * 60;

    const discount =
      normalPrice - promoPrice;

    if (discount > promotionDiscount) {
      promotionDiscount = discount;
      promotionText =
        "ช็อกโกแลต 2 ชิ้น ฿60";
    }
  }

  // =========================
  // POINT DISCOUNT
  // =========================

  const afterPromotion = Math.max(
    subtotal - promotionDiscount,
    0
  );

  const pointDiscount =
    usePoints && member
      ? Math.min(
          Number(member.points || 0),
          afterPromotion
        )
      : 0;

  const netTotal = Math.max(
    afterPromotion - pointDiscount,
    0
  );

  // =========================
  // CASH CHANGE
  // =========================

  const change =
    Number(cashReceived || 0) -
    netTotal;

  // =========================
  // MEMBER SEARCH
  // =========================

  const searchMember = () => {
    const phoneNumber = memberPhone.trim();

    if (!phoneNumber) {
      alert("กรุณากรอกเบอร์โทรสมาชิก");
      return;
    }

    // โหลดข้อมูลล่าสุดจาก localStorage ก่อนค้นหา
    let currentMembers = members;

    try {
      const saved =
        localStorage.getItem("pos_members");

      if (saved) {
        currentMembers = JSON.parse(saved);
        setMembers(currentMembers);
      }
    } catch (error) {
      console.error(error);
    }

    const result = currentMembers.find(
      (item) =>
        String(item.phone).trim() === phoneNumber
    );

    if (result) {
      setMember(result);
      setUsePoints(false);
    } else {
      setMember(null);
      setUsePoints(false);

      alert(
        "ไม่พบสมาชิกจากเบอร์โทรนี้"
      );
    }
  };

  // =========================
  // CLEAR MEMBER
  // =========================

  const clearMember = () => {
    setMember(null);
    setMemberPhone("");
    setUsePoints(false);
  };

  // =========================
  // PAYMENT
  // =========================

  const handlePayment = () => {
    if (cart.length === 0) {
      alert("กรุณาเพิ่มสินค้าก่อน");
      return;
    }

    if (!paymentMethod) {
      alert(
        "กรุณาเลือกช่องทางชำระเงิน"
      );
      return;
    }

    if (
      paymentMethod === "cash" &&
      Number(cashReceived) < netTotal
    ) {
      alert("จำนวนเงินไม่เพียงพอ");
      return;
    }

    const number =
      "RC" +
      Date.now().toString().slice(-8);

    setReceiptNumber(number);

    setPaymentSuccess(true);
  };

  // =========================
  // RESET
  // =========================

  const resetSale = () => {
    setCart([]);
    setMember(null);
    setMemberPhone("");
    setUsePoints(false);
    setPaymentMethod(null);
    setCashReceived("");
    setPaymentSuccess(false);
    setReceiptNumber("");
    setSearch("");
    setCategory("ทั้งหมด");

    // โหลดสมาชิกใหม่อีกครั้ง
    try {
      const saved =
        localStorage.getItem("pos_members");

      setMembers(
        saved ? JSON.parse(saved) : []
      );
    } catch (error) {
      setMembers([]);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          🛒 หน้าคิดเงิน
        </h1>

        <p className="text-slate-500 mt-1">
          POS - Point of Sale
        </p>
      </div>

      {/* MAIN */}

      <div className="grid grid-cols-3 gap-6">

        {/* LEFT */}

        <div className="col-span-2 space-y-6">

          {/* MEMBER */}

          <div className="bg-white rounded-2xl shadow-sm p-5">

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-xl font-bold">
                👤 สมาชิก
              </h2>

              {member && (
                <button
                  onClick={clearMember}
                  className="text-red-500 text-sm"
                >
                  ยกเลิกสมาชิก
                </button>
              )}

            </div>

            <div className="flex gap-3">

              <input
                value={memberPhone}
                onChange={(e) => {
                  const value =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setMemberPhone(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchMember();
                  }
                }}
                placeholder="กรอกเบอร์โทรสมาชิก"
                maxLength={10}
                className="flex-1 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={searchMember}
                className="bg-blue-600 text-white px-6 rounded-lg font-medium hover:bg-blue-700"
              >
                🔎 ค้นหา
              </button>

            </div>

            {member && (
              <div className="mt-4 bg-blue-50 rounded-xl p-4">

                <div className="flex justify-between">

                  <div>

                    <div className="font-bold text-lg">
                      👤 {member.name}
                    </div>

                    <div className="text-sm text-slate-500 mt-1">
                      Member ID: {member.id}
                    </div>

                    <div className="text-sm text-slate-500">
                      📞 {member.phone}
                    </div>

                  </div>

                  <div className="text-right">

                    <div className="text-3xl font-bold text-yellow-600">
                      ⭐{" "}
                      {Number(
                        member.points || 0
                      ).toLocaleString()}
                    </div>

                    <div className="text-sm text-slate-500">
                      Points
                    </div>

                  </div>

                </div>

                <label className="flex items-center gap-2 mt-4 cursor-pointer">

                  <input
                    type="checkbox"
                    checked={usePoints}
                    onChange={(e) =>
                      setUsePoints(
                        e.target.checked
                      )
                    }
                  />

                  <span className="font-medium">
                    ใช้แต้มเป็นส่วนลด
                  </span>

                </label>

              </div>
            )}

          </div>

          {/* PRODUCT SEARCH */}

          <div className="bg-white rounded-2xl shadow-sm p-5">

            <div className="flex gap-3 mb-5">

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="🔍 ค้นหาชื่อสินค้า / รหัสสินค้า..."
                className="flex-1 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() =>
                  setSearch("")
                }
                className="border px-5 rounded-lg hover:bg-slate-50"
              >
                ล้าง
              </button>

            </div>

            {/* CATEGORY */}

            <div className="flex gap-2 mb-5 flex-wrap">

              {[
                "ทั้งหมด",
                "เครื่องดื่ม",
                "อาหาร",
                "ขนม",
              ].map((item) => (

                <button
                  key={item}
                  onClick={() =>
                    setCategory(item)
                  }
                  className={
                    category === item
                      ? "bg-blue-600 text-white px-4 py-2 rounded-lg"
                      : "bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200"
                  }
                >
                  {item}
                </button>

              ))}

            </div>

            <h2 className="font-bold text-xl mb-4">
              สินค้า
            </h2>

            <div className="grid grid-cols-3 gap-4">

              {filteredProducts.map(
                (product) => (

                  <button
                    key={product.id}
                    onClick={() =>
                      addToCart(product)
                    }
                    className="border border-slate-200 rounded-xl p-4 text-left hover:border-blue-500 hover:bg-blue-50 transition"
                  >

                    <div className="text-4xl mb-3">

                      {product.category ===
                      "เครื่องดื่ม"
                        ? "🥤"
                        : product.category ===
                          "อาหาร"
                        ? "🍞"
                        : "🍫"}

                    </div>

                    <div className="font-bold">
                      {product.name}
                    </div>

                    <div className="text-xs text-slate-400 mt-1">
                      {product.code}
                    </div>

                    <div className="text-sm text-slate-500 mt-1">
                      {product.category}
                    </div>

                    <div className="text-blue-600 font-bold text-lg mt-2">
                      ฿
                      {product.price.toLocaleString()}
                    </div>

                    <div className="text-xs text-slate-400 mt-1">
                      คงเหลือ {product.stock}
                    </div>

                  </button>

                )
              )}

            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                ไม่พบสินค้าที่ค้นหา
              </div>
            )}

          </div>

        </div>

        {/* CART */}

        <div className="bg-white rounded-2xl shadow-sm p-5 h-fit">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-bold">
              รายการสินค้า
            </h2>

            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
              {totalItems} ชิ้น
            </span>

          </div>

          {cart.length === 0 ? (

            <div className="text-center py-12 text-slate-400">

              <div className="text-6xl mb-3">
                🛒
              </div>

              <p>
                ยังไม่มีสินค้า
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="border-b pb-4"
                >

                  <div className="flex justify-between">

                    <div>

                      <div className="font-medium">
                        {item.name}
                      </div>

                      <div className="text-sm text-slate-500">
                        ฿
                        {item.price.toLocaleString()}
                        {" "} / ชิ้น
                      </div>

                    </div>

                    <button
                      onClick={() =>
                        removeItem(item.id)
                      }
                      className="text-red-500"
                    >
                      🗑️
                    </button>

                  </div>

                  <div className="flex justify-between items-center mt-3">

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() =>
                          decreaseQty(item.id)
                        }
                        className="w-8 h-8 border rounded-lg"
                      >
                        −
                      </button>

                      <span className="font-bold">
                        {item.qty}
                      </span>

                      <button
                        onClick={() =>
                          increaseQty(item.id)
                        }
                        className="w-8 h-8 bg-blue-600 text-white rounded-lg"
                      >
                        +
                      </button>

                    </div>

                    <div className="font-bold">
                      ฿
                      {(
                        item.price *
                        item.qty
                      ).toLocaleString()}
                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

          {/* SUMMARY */}

          <div className="border-t mt-6 pt-5">

            <div className="flex justify-between mb-2">

              <span>
                ยอดรวม
              </span>

              <span>
                ฿
                {subtotal.toLocaleString()}
              </span>

            </div>

            <div className="flex justify-between mb-2">

              <span>
                🏷️ โปรโมชั่น
              </span>

              <span className="text-red-500">
                - ฿
                {promotionDiscount.toLocaleString()}
              </span>

            </div>

            {promotionText && (
              <div className="text-xs text-green-600 mb-3">
                ✓ {promotionText}
              </div>
            )}

            <div className="flex justify-between mb-2">

              <span>
                ⭐ ส่วนลดจากแต้ม
              </span>

              <span className="text-red-500">
                - ฿
                {pointDiscount.toLocaleString()}
              </span>

            </div>

            <div className="flex justify-between text-xl font-bold mt-4">

              <span>
                ยอดสุทธิ
              </span>

              <span className="text-blue-600">
                ฿
                {netTotal.toLocaleString()}
              </span>

            </div>

            <button
              disabled={cart.length === 0}
              onClick={() =>
                setPaymentMethod("select")
              }
              className="w-full bg-green-600 disabled:bg-slate-300 text-white py-4 rounded-xl mt-5 font-bold text-lg hover:bg-green-700"
            >
              💳 ชำระเงิน
            </button>

          </div>

        </div>

      </div>

      {/* =========================
          PAYMENT SELECT
      ========================= */}

      {paymentMethod === "select" && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[500px] p-7 shadow-xl">

            <div className="flex justify-between mb-6">

              <h2 className="text-2xl font-bold">
                เลือกช่องทางชำระเงิน
              </h2>

              <button
                onClick={() =>
                  setPaymentMethod(null)
                }
                className="text-slate-500 text-xl"
              >
                ✕
              </button>

            </div>

            <div className="bg-slate-100 rounded-xl p-5 mb-6 text-center">

              <p className="text-slate-500">
                ยอดที่ต้องชำระ
              </p>

              <div className="text-4xl font-bold text-blue-600 mt-2">
                ฿
                {netTotal.toLocaleString()}
              </div>

            </div>

            <div className="grid grid-cols-3 gap-3">

              <button
                onClick={() =>
                  setPaymentMethod("cash")
                }
                className="border-2 rounded-xl p-5 hover:border-green-500 hover:bg-green-50"
              >
                <div className="text-3xl">
                  💵
                </div>

                <div className="font-bold mt-2">
                  เงินสด
                </div>
              </button>

              <button
                onClick={() =>
                  setPaymentMethod("qr")
                }
                className="border-2 rounded-xl p-5 hover:border-blue-500 hover:bg-blue-50"
              >
                <div className="text-3xl">
                  📱
                </div>

                <div className="font-bold mt-2">
                  QR Payment
                </div>
              </button>

              <button
                onClick={() =>
                  setPaymentMethod("card")
                }
                className="border-2 rounded-xl p-5 hover:border-purple-500 hover:bg-purple-50"
              >
                <div className="text-3xl">
                  💳
                </div>

                <div className="font-bold mt-2">
                  บัตร
                </div>
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =========================
          CASH
      ========================= */}

      {paymentMethod === "cash" && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[450px] p-7 shadow-xl">

            <h2 className="text-2xl font-bold mb-6">
              💵 รับเงินสด
            </h2>

            <div className="bg-blue-50 rounded-xl p-5 text-center mb-5">

              <p className="text-slate-500">
                ยอดที่ต้องชำระ
              </p>

              <div className="text-4xl font-bold text-blue-600">
                ฿
                {netTotal.toLocaleString()}
              </div>

            </div>

            <label className="block font-medium mb-2">
              รับเงินจากลูกค้า
            </label>

            <input
              type="number"
              value={cashReceived}
              onChange={(e) =>
                setCashReceived(
                  e.target.value
                )
              }
              placeholder="กรอกจำนวนเงิน"
              className="w-full border rounded-lg p-4 text-xl"
              autoFocus
            />

            <div className="flex justify-between mt-5 text-lg">

              <span>
                เงินทอน
              </span>

              <span
                className={
                  change >= 0
                    ? "font-bold text-green-600"
                    : "font-bold text-red-600"
                }
              >
                ฿
                {Math.max(
                  change,
                  0
                ).toLocaleString()}
              </span>

            </div>

            <div className="flex gap-3 mt-6">

              <button
                onClick={() =>
                  setPaymentMethod("select")
                }
                className="flex-1 border rounded-lg py-3"
              >
                ย้อนกลับ
              </button>

              <button
                onClick={handlePayment}
                className="flex-1 bg-green-600 text-white rounded-lg py-3 font-bold"
              >
                ยืนยันรับเงิน
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =========================
          QR
      ========================= */}

      {paymentMethod === "qr" && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[450px] p-7 shadow-xl text-center">

            <h2 className="text-2xl font-bold mb-5">
              📱 QR Payment
            </h2>

            <p className="text-slate-500">
              ยอดที่ต้องชำระ
            </p>

            <div className="text-3xl font-bold text-blue-600 mt-2">
              ฿
              {netTotal.toLocaleString()}
            </div>

            <div className="bg-slate-100 w-52 h-52 mx-auto mt-6 flex items-center justify-center rounded-xl">

              <div className="text-7xl">
                ▦
              </div>

            </div>

            <p className="text-slate-500 mt-4">
              รอลูกค้าสแกน QR Code
            </p>

            <button
              onClick={handlePayment}
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-5 font-bold"
            >
              ✓ จำลองการชำระเงินสำเร็จ
            </button>

            <button
              onClick={() =>
                setPaymentMethod("select")
              }
              className="w-full border py-3 rounded-lg mt-3"
            >
              ย้อนกลับ
            </button>

          </div>

        </div>

      )}

      {/* =========================
          CARD
      ========================= */}

      {paymentMethod === "card" && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[450px] p-7 shadow-xl text-center">

            <h2 className="text-2xl font-bold mb-5">
              💳 บัตรเครดิต / เดบิต
            </h2>

            <p className="text-slate-500">
              ยอดที่ต้องชำระ
            </p>

            <div className="text-3xl font-bold text-purple-600 mt-2">
              ฿
              {netTotal.toLocaleString()}
            </div>

            <div className="py-12">

              <div className="text-7xl">
                💳
              </div>

              <p className="text-slate-500 mt-4">
                กรุณาแตะ / เสียบบัตรที่เครื่อง EDC
              </p>

            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold"
            >
              ✓ จำลองการชำระเงินสำเร็จ
            </button>

            <button
              onClick={() =>
                setPaymentMethod("select")
              }
              className="w-full border py-3 rounded-lg mt-3"
            >
              ย้อนกลับ
            </button>

          </div>

        </div>

      )}

      {/* =========================
          SUCCESS
      ========================= */}

      {paymentSuccess && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[480px] p-8 shadow-xl">

            <div className="text-center">

              <div className="text-7xl">
                ✅
              </div>

              <h2 className="text-2xl font-bold mt-4">
                ชำระเงินสำเร็จ
              </h2>

              <p className="text-slate-500 mt-2">
                เลขที่ใบเสร็จ
              </p>

              <div className="font-bold text-lg">
                {receiptNumber}
              </div>

            </div>

            <div className="bg-slate-50 rounded-xl p-5 mt-5">

              {member && (
                <div className="flex justify-between mb-3">

                  <span>
                    สมาชิก
                  </span>

                  <span className="font-bold">
                    {member.name}
                  </span>

                </div>
              )}

              <div className="flex justify-between mb-2">

                <span>
                  ยอดรวม
                </span>

                <span>
                  ฿
                  {subtotal.toLocaleString()}
                </span>

              </div>

              <div className="flex justify-between mb-2">

                <span>
                  โปรโมชั่น
                </span>

                <span className="text-red-500">
                  - ฿
                  {promotionDiscount.toLocaleString()}
                </span>

              </div>

              <div className="flex justify-between mb-2">

                <span>
                  แต้ม
                </span>

                <span className="text-red-500">
                  - ฿
                  {pointDiscount.toLocaleString()}
                </span>

              </div>

              <div className="border-t pt-3 mt-3 flex justify-between text-xl font-bold">

                <span>
                  ยอดชำระ
                </span>

                <span className="text-green-600">
                  ฿
                  {netTotal.toLocaleString()}
                </span>

              </div>

              {paymentMethod === "cash" && (

                <div className="flex justify-between mt-3">

                  <span>
                    เงินทอน
                  </span>

                  <span className="font-bold text-green-600">
                    ฿
                    {Math.max(
                      change,
                      0
                    ).toLocaleString()}
                  </span>

                </div>

              )}

            </div>

            <div className="mt-5 text-center text-sm text-slate-500">

              ชำระผ่าน{" "}

              {paymentMethod === "cash"
                ? "💵 เงินสด"
                : paymentMethod === "qr"
                ? "📱 QR Payment"
                : "💳 บัตร"}

            </div>

            <button
              onClick={resetSale}
              className="w-full bg-blue-600 text-white py-4 rounded-xl mt-6 font-bold"
            >
              🧾 เสร็จสิ้น / ขายรายการใหม่
            </button>

          </div>

        </div>

      )}

    </div>
  );
}
