import { db } from "@/db/drizzle";
import { specialties } from "@/db/schema";

export default async function Home() {
  const allSpecialties = await db.select().from(specialties)
  return (
    <main>
      <div>Home Page</div>

        { allSpecialties.map((specialty) => (
          <div key={specialty.id}>
            <span>{specialty.specialty}</span>
            <span>{specialty.description}</span>
            <span>{specialty.icon_url}</span>
          </div>
        )) }

    </main>
  );
}
