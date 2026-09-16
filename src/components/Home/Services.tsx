import Link from "next/link";
import Head_of_sections from "../ui/Head_of_sections";
import Services_card from "../ui/Services_card";

export default function Services() {
     return (
          <section className="container w-full m-auto my-8">
               <Head_of_sections title="General services at Bedentist Clinic" subtitle="Services"/>
               <div className="flex-col my-16 flex items-center justify-between md:flex-row">
                    <Services_card src="/images/dentist-services-1.png" alt="dentist-services-1" head="Schedule online" body="Pellentesque gravida tellus et lorem consectetur, ac accumsan nunc ultrices"/>
                    <Services_card src="/images/dentist-services-2.png" alt="dentist-services-2" head="Cosmetic feeling" body="Duis ornare felis eget mauris semper, vel tincidunt turpis accumsan."/>
                    <Services_card src="/images/dentist-services-3.png" alt="dentist-services-3" head="Implants placement" body="Pellentesque gravida tellus et lorem consectetur, ac accumsan nunc ultrices"/>
               </div>
               <div className="mx-auto py-0 text-center">
                    <Link href={'/services'} className="bg-blue-900 text-white text-lg px-8 py-4 rounded-full border-blue-900 transition-all hover:bg-blue-600">ALL SERVICES</Link>
               </div>
          </section>
     )
}