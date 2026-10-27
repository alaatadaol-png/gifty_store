import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";

export default function Account() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    // جلب طلبات الزبون بناءً على الإيميل أو الهاتف
    supabase
      .from("orders")
      .select("*")
      .eq("customer_email", user.email) // تأكد من وجود عمود customer_email في جدول orders
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data || []);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-32 text-center">
        <p className="font-heading text-2xl">يرجى تسجيل الدخول أولاً</p>
        <Link to="/login">
          <Button className="mt-6 rounded-none bg-royal text-cream">تسجيل الدخول</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <div className="flex items-center justify-between border-b border-ink/10 pb-6">
        <div>
          <h1 className="font-heading text-3xl">حسابي</h1>
          <p className="mt-1 text-sm text-ink/50">{user.email}</p>
        </div>
        <Button onClick={logout} variant="outline" className="rounded-none border-ink/20">
          تسجيل الخروج
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-xl">طلباتي</h2>
        {loading ? (
          <p className="mt-4 text-sm text-ink/40">جارٍ التحميل...</p>
        ) : orders.length === 0 ? (
          <p className="mt-4 text-sm text-ink/40">لا توجد طلبات سابقة.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-ink/10 bg-white p-4">
                <div className="flex justify-between">
                  <p className="font-medium">طلب رقم: {order.id}</p>
                  <p className="text-sm text-gold">{order.status}</p>
                </div>
                <p className="mt-2 text-sm text-ink/60">{order.items_summary}</p>
                <p className="mt-2 text-sm font-bold">الإجمالي: {order.total} {order.currency}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}