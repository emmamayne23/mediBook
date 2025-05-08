import Image from "next/image";
import Link from "next/link";
import { db } from "@/db/drizzle";
import { specialties } from "@/db/schema";

import { IoCallOutline } from "react-icons/io5";

export default async function Home() {
  const allSpecialties = await db.select().from(specialties);
  return (
    <main>
      <section id="hero" className="">
        <Image
          src={"/hero.png"}
          height={200}
          width={1000}
          alt="Hero Image"
          className="min-h-screen w-full object-cover"
        />
        <div className="absolute top-50 text-base font-medium pl-5 md:pl-20">
          <h2 className="text-4xl md:text-7xl font-extrabold mb-5">
            Book Your Doctor <br /> Appointment Online
          </h2>
          <p>A Healthier Tomorrow Start Today: Schedule Your Appointment!</p>
          <p>Your Welness, Our Expertise: Set Up Your Appointment Today</p>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <Link
              href={"/"}
              className="border bg-blue-600 text-center hover:bg-blue-800 border-blue-600 duration-300 px-3 rounded-lg py-2.5 w-56"
            >
              Book An Appointment
            </Link>
            <Link
              href={"/"}
              className="flex gap-3 items-center border bg-blue-600 text-center border-blue-600 hover:bg-blue-800 duration-300 w-40 px-5 py-2.5 rounded-lg"
            >
              {" "}
              <IoCallOutline className="text-lg" />
              Call Now
            </Link>
          </div>
        </div>
      </section>
      <section className="text-center p-5 my-5 w-[90%] mx-auto max-w-[600px]">
        <h2 className="text-4xl font-bold mb-5">How It Works!</h2>
        <p className="text-gray-600">
          Discover, book and experience personalized healthcare effortlessly
          with our user-friendly Doctor Appointment Website 🏥.
        </p>
      </section>
      <section className="flex gap-5 flex-col md:flex-row my-5 mb-20">
        <div className="text-center">
          <div className="text-3xl mx-auto w-12 h-12 flex items-center justify-center rounded-lg shadow-current shadow relative">
            👨‍⚕️
            <span className="text-white bg-blue-600 rounded-full text-[11px] px-[8px] py-[3px] absolute -right-2 -top-2">
              1
            </span>
          </div>
          <h2 className="text-2xl font-semibold mb-2 my-3 ">Find A Doctor</h2>
          <p className="text-gray-600">Discover Doctors based on specialization and location</p>
        </div>
        <div className="flex flex-col"></div>
        <div className="text-center ">
          <p className="text-2xl mx-auto w-12 h-12 flex items-center justify-center rounded-lg shadow-current shadow relative">
            📅
            <span className="text-white bg-blue-600 rounded-full text-[11px] px-[8px] py-[3px] absolute -right-2 -top-2">
              2
            </span>
          </p>
          <h2 className="text-2xl font-semibold mb-2 my-3">Book Appoinment</h2>
          <p className="text-gray-600">
            Effortlessly Book Appointments at your own convenience
          </p>
        </div>
        <div></div>
        <div className="text-center">
          <div className="text-2xl mx-auto w-12 h-12 flex items-center justify-center rounded-lg shadow-current shadow relative">
            ⚕️
            <span className="text-white bg-blue-600 rounded-full text-[11px] px-[8px] py-[3px] absolute -right-2 -top-2">
              3
            </span>
          </div>
          <h2 className="text-2xl font-semibold mb-2 my-3">Get Services</h2>
          <p className="text-gray-600">Receive personalized healthcare services tailord to your needs</p>
        </div>
      </section>

      <section id="specialties" className="py-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Specialty Departments
        </h1>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-5">
          {allSpecialties.map((specialty) => (
            <Link
              href={`/specialties/${specialty.id}`}
              key={specialty.id}
              className="group  shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow duration-300 border"
            >
              <div className="flex justify-center mb-4">
                <Image
                  src={specialty.icon_url || ""}
                  width={100}
                  height={100}
                  alt="icon"
                  className="rounded-full border object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold text-center group-hover:text-blue-600 transition-colors duration-300">
                {specialty.specialty}
              </h2>
              <p className="text-sm text-center text-gray-500 mt-2">
                {specialty.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
