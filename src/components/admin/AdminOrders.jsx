import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Spinner } from "./parts";
import { formatMultiCurrency } from "@/lib/brands";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUSES = ["قيد الانتظار", "تم تأكيد الدفع", "قيد التجهيز", "تم الشحن", "تم التسليم", "ملغي"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);
    
    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } else {
      alert("حدث خطأ أثناء تحديث الحالة");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-white border border-ink/10 p-6">
      <h2 className="font-heading text-2xl mb-6">إدارة الطلبات</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-ink/10 p-4 rounded bg-ink/[0.02]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold text-lg">{order.customer_name}</p>
                <p className="text-sm text-ink/60" dir="ltr">{order.phone}</p>
                <p className="text-sm text-ink/60">{order.address}</p>
              </div>
              <div className="text-left">
                <p className="text-xs text-ink/50 mb-1">إجمالي الطلب</p>
                <p className="font-heading text-xl">{formatMultiCurrency({ [order.currency]: order.total })}</p>
                <p className="text-xs text-ink/50 mt-1">{new Date(order.created_at).toLocaleDateString('ar-EG')}</p>
              </div>
            </div>

            <div className="bg-white p-3 text-sm border mb-4 whitespace-pre-wrap">
              {order.items_summary}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">حالة الطلب:</span>
              <select 
                value={order.status} 
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="border p-2 text-sm bg-white rounded"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-center py-8 text-ink/50">لا توجد طلبات حتى الآن.</p>}
      </div>
    </div>
  );
}