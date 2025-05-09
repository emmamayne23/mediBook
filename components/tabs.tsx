import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import DoctorsPage from "@/components/DoctorsPage"
import AppointmentPage from "@/components/AppointmentPage"

interface ParamsProps {
  params: { id: string }
}
export function TabsDemo({ params }: ParamsProps) {
  return (
    <Tabs defaultValue="doctor" className="w-[400px] mt-25 mx-auto">
      <TabsList className="w-full mx-auto">
        <TabsTrigger value="doctor">Doctor Details</TabsTrigger>
        <TabsTrigger value="appointment">Book Appointment</TabsTrigger>
      </TabsList>
      <TabsContent value="doctor">
        <DoctorsPage params={params} />
      </TabsContent>
      <TabsContent value="appointment">
        <AppointmentPage params={params}/>
      </TabsContent>
    </Tabs>
  );
}
// export function TabsDemo() {
//   return (
//     <Tabs defaultValue="doctor" className="w-[400px]">
//       <TabsList>
//         <TabsTrigger value="doctor">Doctor Details</TabsTrigger>
//         <TabsTrigger value="appointment">Book Appointment</TabsTrigger>
//       </TabsList>
//       <TabsContent value="doctor">
//         <DoctorsPage params={ } />
//       </TabsContent>
//       <TabsContent value="appointment">
//         <AppointmentPage params={}/>
//       </TabsContent>
//     </Tabs>
//   );
// }
