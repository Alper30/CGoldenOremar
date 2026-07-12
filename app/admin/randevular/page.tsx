import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BookingsList, type Booking } from "@/components/admin/BookingsList";

export const metadata = { title: "Randevular · Yönetim" };

export default async function AdminBookingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("bookings")
    .select("id, experience_type, guests, booking_date, booking_time, name, email, phone, notes, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return <BookingsList bookings={(data ?? []) as unknown as Booking[]} />;
}
