import { db } from "@/db/drizzle";
import { specialties } from "@/db/schema";
import Image from "next/image";
import Link from "next/link";

import { IoCallOutline } from "react-icons/io5";

export default async function Home() {
  const allSpecialties = await db.select().from(specialties)
  return (
    <main>
      <section id="hero" className="">
        <Image src={"/hero.png"} height={200} width={1000} alt="Hero Image" className="min-h-screen w-full object-cover" />
        <div className="absolute top-50 text-base font-medium pl-5 md:pl-20">
          <h2 className="text-4xl md:text-7xl font-extrabold mb-5">Book Your Doctor <br /> Appointment Online</h2>
          <p>A Healthier Tomorrow Start Today: Schedule Your Appointment!</p>
          <p>Your Welness, Our Expertise: Set Up Your Appointment Today</p>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <Link href={"/"} className="border bg-blue-600 text-center hover:bg-blue-800 duration-300 px-3 rounded-lg py-2.5 w-56">Book An Appointment</Link>
            <Link href={"/"} className="flex gap-3 items-center border bg-blue-600 text-center hover:bg-blue-800 duration-300 w-40 px-5 py-2.5 rounded-lg"> <IoCallOutline />Call Now</Link>
          </div>
        </div>
      </section>

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
