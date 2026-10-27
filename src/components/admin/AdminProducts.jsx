import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Spinner } from "./parts";
import ProductForm from "./ProductForm";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus } from "lucide-react";
import { formatPrice } from "@/lib/brands";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  if (isFormOpen) {
    return (
      <ProductForm
        product={editingProduct}
        onClose={() => setIsFormOpen(false)}
        onSave={() => {
          setIsFormOpen(false);
          fetchProducts();
        }}
      />
    );
  }

  if (loading) return <Spinner />;

  return (
    <div className="bg-white border border-ink/10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-2xl">إدارة المنتجات</h2>
        <Button onClick={handleAddNew} className="bg-royal text-cream rounded-none">
          <Plus className="w-4 h-4 ml-2" /> إضافة منتج
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-ink/5 text-ink/70">
            <tr>
              <th className="px-4 py-3">المنتج</th>
              <th className="px-4 py-3">الفئة</th>
              <th className="px-4 py-3">السعر</th>
              <th className="px-4 py-3">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-ink/[0.02]">
                <td className="px-4 py-3 flex items-center gap-3">
                  {product.images?.[0] && (
                    <img src={product.images[0]} alt="" className="w-10 h-10 object-cover" />
                  )}
                  <span className="font-medium">{product.name}</span>
                </td>
                <td className="px-4 py-3 text-ink/60">{product.category}</td>
                <td className="px-4 py-3">{formatPrice(product.base_price, product.currency)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(product)} className="p-1.5 text-royal hover:bg-royal/10 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="text-center py-8 text-ink/50">لا توجد منتجات حالياً.</p>}
      </div>
    </div>
  );
}