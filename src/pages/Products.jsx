import { useEffect, useState } from "react";

const defaultProducts = [
  {
    id: 1,
    code: "P001",
    name: "น้ำดื่ม 600ml",
    price: 7,
    cost: 4,
    category: "เครื่องดื่ม",
    stock: 50,
    status: "active",
  },
  {
    id: 2,
    code: "P002",
    name: "กาแฟกระป๋อง",
    price: 20,
    cost: 12,
    category: "เครื่องดื่ม",
    stock: 30,
    status: "active",
  },
  {
    id: 3,
    code: "P003",
    name: "ขนมปัง",
    price: 25,
    cost: 15,
    category: "อาหาร",
    stock: 25,
    status: "active",
  },
  {
    id: 4,
    code: "P004",
    name: "นม UHT",
    price: 15,
    cost: 9,
    category: "เครื่องดื่ม",
    stock: 40,
    status: "active",
  },
  {
    id: 5,
    code: "P005",
    name: "มันฝรั่งทอด",
    price: 30,
    cost: 18,
    category: "ขนม",
    stock: 20,
    status: "active",
  },
];

export default function Products() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("pos_products");

    return saved
      ? JSON.parse(saved)
      : defaultProducts;
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ทั้งหมด");

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [form, setForm] = useState({
    code: "",
    name: "",
    price: "",
    cost: "",
    category: "เครื่องดื่ม",
    stock: "",
  });

  useEffect(() => {
    localStorage.setItem(
      "pos_products",
      JSON.stringify(products)
    );
  }, [products]);

  const filteredProducts = products.filter(
    (product) => {
      const searchText =
        search.toLowerCase();

      const matchSearch =
        product.name
          .toLowerCase()
          .includes(searchText) ||
        product.code
          .toLowerCase()
          .includes(searchText);

      const matchCategory =
        category === "ทั้งหมด" ||
        product.category === category;

      return (
        matchSearch &&
        matchCategory
      );
    }
  );

  const openAddForm = () => {
    setEditingProduct(null);

    setForm({
      code: "",
      name: "",
      price: "",
      cost: "",
      category: "เครื่องดื่ม",
      stock: "",
    });

    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);

    setForm({
      code: product.code,
      name: product.name,
      price: product.price,
      cost: product.cost,
      category: product.category,
      stock: product.stock,
    });

    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveProduct = () => {
    if (
      !form.code ||
      !form.name ||
      !form.price ||
      !form.cost ||
      form.stock === ""
    ) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (editingProduct) {
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                code: form.code,
                name: form.name,
                price: Number(form.price),
                cost: Number(form.cost),
                category: form.category,
                stock: Number(form.stock),
              }
            : product
        )
      );

      alert("แก้ไขสินค้าเรียบร้อย");
    } else {
      const newProduct = {
        id: Date.now(),
        code: form.code,
        name: form.name,
        price: Number(form.price),
        cost: Number(form.cost),
        category: form.category,
        stock: Number(form.stock),
        status: "active",
      };

      setProducts([
        ...products,
        newProduct,
      ]);

      alert("เพิ่มสินค้าเรียบร้อย");
    }

    setShowForm(false);
  };

  const deleteProduct = (id) => {
    const confirmDelete = window.confirm(
      "ต้องการลบสินค้านี้ใช่หรือไม่?"
    );

    if (!confirmDelete) return;

    setProducts(
      products.filter(
        (product) => product.id !== id
      )
    );
  };

  const toggleStatus = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? {
              ...product,
              status:
                product.status === "active"
                  ? "inactive"
                  : "active",
            }
          : product
      )
    );
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-7">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            📦 จัดการสินค้า
          </h1>

          <p className="text-slate-500 mt-1">
            เพิ่ม แก้ไข ลบ และจัดการสต๊อกสินค้า
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700"
        >
          ＋ เพิ่มสินค้า
        </button>

      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-slate-500">
            สินค้าทั้งหมด
          </p>

          <p className="text-3xl font-bold mt-2">
            {products.length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-slate-500">
            สินค้าที่เปิดขาย
          </p>

          <p className="text-3xl font-bold text-green-600 mt-2">
            {
              products.filter(
                (p) =>
                  p.status === "active"
              ).length
            }
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-slate-500">
            สินค้าใกล้หมด
          </p>

          <p className="text-3xl font-bold text-orange-500 mt-2">
            {
              products.filter(
                (p) =>
                  p.stock > 0 &&
                  p.stock <= 10
              ).length
            }
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-slate-500">
            สินค้าหมด
          </p>

          <p className="text-3xl font-bold text-red-500 mt-2">
            {
              products.filter(
                (p) => p.stock === 0
              ).length
            }
          </p>
        </div>

      </div>

      {/* SEARCH */}

      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">

        <div className="flex gap-3">

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="🔍 ค้นหาชื่อสินค้า / รหัสสินค้า"
            className="flex-1 border border-slate-300 rounded-lg px-4 py-3"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="border border-slate-300 rounded-lg px-4"
          >
            <option>ทั้งหมด</option>
            <option>เครื่องดื่ม</option>
            <option>อาหาร</option>
            <option>ขนม</option>
          </select>

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="text-left p-4">
                รหัส
              </th>

              <th className="text-left p-4">
                สินค้า
              </th>

              <th className="text-left p-4">
                หมวดหมู่
              </th>

              <th className="text-right p-4">
                ราคาทุน
              </th>

              <th className="text-right p-4">
                ราคาขาย
              </th>

              <th className="text-center p-4">
                สต๊อก
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

            {filteredProducts.map(
              (product) => (

                <tr
                  key={product.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="p-4 font-medium">
                    {product.code}
                  </td>

                  <td className="p-4">

                    <div className="font-bold">
                      {product.name}
                    </div>

                  </td>

                  <td className="p-4">
                    {product.category}
                  </td>

                  <td className="p-4 text-right">
                    ฿
                    {product.cost.toLocaleString()}
                  </td>

                  <td className="p-4 text-right font-bold text-blue-600">
                    ฿
                    {product.price.toLocaleString()}
                  </td>

                  <td className="p-4 text-center">

                    <span
                      className={
                        product.stock === 0
                          ? "text-red-600 font-bold"
                          : product.stock <= 10
                          ? "text-orange-500 font-bold"
                          : "text-green-600 font-bold"
                      }
                    >
                      {product.stock}
                    </span>

                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() =>
                        toggleStatus(
                          product.id
                        )
                      }
                      className={
                        product.status ===
                        "active"
                          ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                          : "bg-slate-200 text-slate-500 px-3 py-1 rounded-full text-sm"
                      }
                    >
                      {product.status ===
                      "active"
                        ? "เปิดขาย"
                        : "ปิดขาย"}
                    </button>

                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() =>
                          openEditForm(
                            product
                          )
                        }
                        className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() =>
                          deleteProduct(
                            product.id
                          )
                        }
                        className="bg-red-100 text-red-600 px-3 py-2 rounded-lg"
                      >
                        🗑️
                      </button>

                    </div>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            ไม่พบสินค้า
          </div>
        )}

      </div>

      {/* =========================
          FORM MODAL
      ========================= */}

      {showForm && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[550px] p-7 shadow-xl">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                {editingProduct
                  ? "✏️ แก้ไขสินค้า"
                  : "➕ เพิ่มสินค้า"}
              </h2>

              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="text-xl text-slate-500"
              >
                ✕
              </button>

            </div>

            <div className="space-y-4">

              <div>

                <label className="block mb-1 font-medium">
                  รหัสสินค้า
                </label>

                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="เช่น P010"
                  className="w-full border rounded-lg p-3"
                />

              </div>

              <div>

                <label className="block mb-1 font-medium">
                  ชื่อสินค้า
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="ชื่อสินค้า"
                  className="w-full border rounded-lg p-3"
                />

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block mb-1 font-medium">
                    ราคาทุน
                  </label>

                  <input
                    type="number"
                    name="cost"
                    value={form.cost}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                  />

                </div>

                <div>

                  <label className="block mb-1 font-medium">
                    ราคาขาย
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                  />

                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block mb-1 font-medium">
                    หมวดหมู่
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                  >
                    <option>
                      เครื่องดื่ม
                    </option>

                    <option>
                      อาหาร
                    </option>

                    <option>
                      ขนม
                    </option>

                  </select>

                </div>

                <div>

                  <label className="block mb-1 font-medium">
                    จำนวนสต๊อก
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full border rounded-lg p-3"
                  />

                </div>

              </div>

            </div>

            <div className="flex gap-3 mt-7">

              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="flex-1 border rounded-lg py-3"
              >
                ยกเลิก
              </button>

              <button
                onClick={saveProduct}
                className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-bold"
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