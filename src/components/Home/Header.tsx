import Image from "next/image";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="overflow-hidden bg-blue-900 bg-[url('/images/dentist-header-bg.png')] bg-cover bg-center">
          {/* Navbar */}
          <Navbar />

          {/* Hero */}
          <div className="flex flex-col lg:flex-row items-center">
        
               {/* Profile Image */}
               <div className="flex w-full items-end justify-center lg:w-1/2">
                    <Image
                         src="/images/dentist-header-profile.jpg"
                         width={500}
                         height={800}
                         alt="profile"
                         priority
                         className="h-auto w-full max-w-100 sm:max-w-112.5 lg:h-162.5 lg:max-w-none lg:w-auto object-cover"
                    />
               </div>

               {/* Content */}
               <div className="flex w-full flex-col items-start justify-center px-6 py-10 sm:px-10 md:px-14 lg:w-1/2 lg:px-8 xl:px-16">
                    <h2 className="mb-4 text-sm font-medium text-blue-400 sm:mb-5 sm:text-base md:text-lg lg:mb-7">
                         WELCOME TO OUR CLINIC
                    </h2>

                    <h1 className="mb-5 text-4xl font-bold leading-tight text-white sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
                         Make your
                         <br />
                         smile shine
                    </h1>

                    <p className="mb-6 w-full max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
                         Welcome to our clinic.
                         <br />
                         Make your smile shine.
                         <br />
                         Some want to be made mass, not just time euismod in.
                         Morbi eget suscipit libero. Integer nec mattis dolor.
                    </p>

                    <button className="rounded-full bg-blue-600 px-6 py-2.5 text-sm text-white transition hover:bg-blue-500 sm:px-7 sm:py-3 sm:text-base ">
                         MAKE AN APPOINTMENT
                    </button>
               </div>
          </div>
    </header>
  );
}
