import Image from "next/image";

export default function Hygiene() {
     return (
          <div className="flex flex-col md:flex-row md:items-stretch bg-gray-400/20 bg-[url('/images/dentist-hygiene-bg.png')] bg-cover bg-center">
              <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 lg:p-10">
                    <span className="font-bold capitalize text-blue-300">
                         DENTAL HYGIENE
                    </span>
      
                    <h2 className="my-3 text-3xl font-extrabold leading-tight text-blue-900 sm:text-4xl lg:text-5xl">
                         Do you know how to brush your teeth well?
                    </h2>

                    <p className="my-3 text-lg leading-tight text-black sm:text-lg lg:text-lg">
                         Nec curabitur nec cursus nullam dapibus curae sollicitudin tortor volutpat proin purus donec pretium vehicula tempor
                    </p>

                    <p className="my-3 flex flex-col space-y-3 text-lg leading-tight text-blue-800">
                         <span>Feugiat odio potenti condimentum</span>
                         <span>At vitae suspendisse sem litora</span>
                         <span>Sodales laoreet donec porttitor</span>
                    </p>
      
                    <button className="w-fit rounded-full border border-blue-500 bg-blue-500 px-6 py-3 text-lg text-white transition-all duration-300 hover:bg-blue-900">
                         OUR ADVICES
                    </button>
              </div>
    
              <div className="flex flex-1 items-end justify-center p-6 sm:p-8 lg:p-10">
                    <Image
                         src="/images/dentist-hygiene-1.jpg"
                         width={780}
                         height={890}
                         alt="Dentist"
                         className="h-auto w-full max-w-87.5 object-contain sm:max-w-100 md:max-w-full rounded-full"
                    />
              </div>
          </div>
     )
}