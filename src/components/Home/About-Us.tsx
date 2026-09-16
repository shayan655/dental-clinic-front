import Image from "next/image";


export default function About() {
     return (
          <div className="flex flex-col md:flex-row md:items-stretch">
                  
               {/* Left Content */}
               <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 lg:p-10">
               <span className="font-bold capitalize text-blue-300">
                    ABOUT US
               </span>
     
               <h2 className="my-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                    We&apos;ve been taking care of your teeth for over 20 years
               </h2>
     
               <button className="w-fit rounded-full border border-blue-300 bg-blue-300 px-6 py-3 text-lg text-white transition-all duration-300 hover:bg-blue-900">
                    Read More
               </button>
               </div>
     
               {/* Center Image */}
               <div className="flex flex-1 items-end justify-center p-6 sm:p-8 lg:p-10">
               <Image
                    src="/images/dentist-banner-about-section.png"
                    width={780}
                    height={890}
                    alt="Dentist"
                    className="h-auto w-full max-w-87.5 object-contain sm:max-w-100 md:max-w-full"
               />
               </div>
     
               {/* Right Stats */}
               <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 lg:p-10">
               <span className="text-4xl font-bold capitalize text-blue-300 sm:text-5xl">
                    +12K
               </span>
     
               <h3 className="my-3 text-xl font-extrabold leading-tight text-white sm:text-2xl">
                    Our Patient
               </h3>
     
               <p className="text-base leading-7 text-white sm:text-lg sm:leading-8">
                    Pellentesque purus libero, ornare id dolor vitae, vestibulum
                    consequat risus.
               </p>
     
               <hr className="my-4 border-white/20" />
     
               <span className="text-4xl font-bold capitalize text-blue-300 sm:text-5xl">
                    +99.7%
               </span>
     
               <h3 className="my-3 text-xl font-extrabold leading-tight text-white sm:text-2xl">
                    Satisfied patients
               </h3>
     
               <p className="text-base leading-7 text-white sm:text-lg sm:leading-8">
                    Fringilla tempus etiam pharetra per aenean sociosqu habitasse
                    varius sociosqu.
               </p>
               </div>
          </div>
     )
}