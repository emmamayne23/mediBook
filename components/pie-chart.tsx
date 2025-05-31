import { PieChart } from "@mui/x-charts/PieChart";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function AdminPieChart() {
    const usersCount = await db.select().from(users).then((res) => res.length);
    const patientsCount = await db.select().from(users).where(eq(users.role, "patient")).then((res) => res.length);
    const doctorsCount = await db.select().from(users).where(eq(users.role, "doctor")).then((res) => res.length);
    const receptionistsCount = await db.select().from(users).where(eq(users.role, "receptionist")).then((res) => res.length);
    const adminsCount = await db.select().from(users).where(eq(users.role, "admin")).then((res) => res.length);
    
    const data = [
        { id: 0, value: 10, label: "Testers" },
        { id: 1, value: patientsCount, label: "Patients" },
        { id: 2, value: doctorsCount, label: "Doctors" },
        { id: 3, value: 8, label: "Receptionists" },
        { id: 4, value: adminsCount, label: "Admins" },
        { id: 4, value: usersCount, label: "Users" },
    ];
  return (
    <PieChart
      series={[
        {
          data: data,
          innerRadius: 13,
          outerRadius: 100,
          paddingAngle: 3,
          cornerRadius: 5,
          startAngle: 0,
          endAngle: 360,
          cx: 150,
          cy: 150,
        },
      ]}
      width={300}
      height={300}
    />
  );
}
