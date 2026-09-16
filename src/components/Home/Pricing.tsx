import Link from "next/link";
import Head_of_sections from "../ui/Head_of_sections";


export default function Pricing() {
     return (
          <div className="flex flex-col">
               <Head_of_sections subtitle="PRICING" title="Check Out Membership Benefits"/>

               <div className="mx-auto my-6 grid w-full max-w-7xl grid-cols-1 gap-6 px-4 sm:my-8 md:grid-cols-3 md:gap-8">
                    <div className="w-full overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                         <div className="p-6 sm:p-8 md:p-10">
                    
                              {/* Title */}
                              <div className="mb-6">
                                   <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                   Monthly
                                   </h2>

                                   <span className="text-sm font-medium tracking-wider text-gray-500 sm:text-base">
                                   PER MONTH
                                   </span>
                              </div>

                              {/* Price */}
                              <div className="mb-8 flex items-baseline">
                                   <span className="text-xl font-semibold text-blue-600 sm:text-2xl">
                                   $
                                   </span>

                                   <span className="text-6xl font-extrabold leading-none text-blue-600 sm:text-7xl">
                                   50
                                   </span>

                                   <span className="ml-2 text-sm text-gray-400">
                                   / month
                                   </span>
                              </div>

                              {/* Features */}
                              <div className="mb-8">
                                   <ul className="space-y-4">
                                        <li className="flex items-start gap-3 text-sm text-gray-600 sm:text-base">
                                             <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                             ✓
                                             </span>
                                             <span>Praesent dolor euismod convallis</span>
                                        </li>

                                        <li className="flex items-start gap-3 text-sm text-gray-600 sm:text-base">
                                             <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                             ✓
                                             </span>
                                             <span>Sed adipiscing gravida sit</span>
                                        </li>

                                        <li className="flex items-start gap-3 text-sm text-gray-600 sm:text-base">
                                             <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                             ✓
                                             </span>
                                             <span>Aenean aliquet, diam mi non</span>
                                        </li>
                                   </ul>
                              </div>

                              {/* Button */}
                              <div>
                                   <Link
                                   href="/"
                                   className="block w-full rounded-full bg-blue-600 px-6 py-3 text-center text-base font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg sm:py-4 sm:text-lg"
                                   >
                                   CHOOSE
                                   </Link>
                              </div>
                         </div>
                    </div>
                    <div className="w-full overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                         <div className="p-6 sm:p-8 md:p-10">
                    
                              {/* Title */}
                              <div className="mb-6">
                                   <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                   6 Month
                                   </h2>

                                   <span className="text-sm font-medium tracking-wider text-gray-500 sm:text-base">
                                   PER MONTH
                                   </span>
                              </div>

                              {/* Price */}
                              <div className="mb-8 flex items-baseline">
                                   <span className="text-xl font-semibold text-blue-600 sm:text-2xl">
                                   $
                                   </span>

                                   <span className="text-6xl font-extrabold leading-none text-blue-600 sm:text-7xl">
                                   36
                                   </span>

                                   <span className="ml-2 text-sm text-gray-400">
                                   / month
                                   </span>
                              </div>

                              {/* Features */}
                              <div className="mb-8">
                                   <ul className="space-y-4">
                                   <li className="flex items-start gap-3 text-sm text-gray-600 sm:text-base">
                                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                        ✓
                                        </span>
                                        <span>Praesent dolor euismod convallis</span>
                                   </li>

                                   <li className="flex items-start gap-3 text-sm text-gray-600 sm:text-base">
                                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                        ✓
                                        </span>
                                        <span>Sed adipiscing gravida sit</span>
                                   </li>

                                   <li className="flex items-start gap-3 text-sm text-gray-600 sm:text-base">
                                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                        ✓
                                        </span>
                                        <span>Aenean aliquet, diam mi non</span>
                                   </li>
                                   </ul>
                              </div>

                              {/* Button */}
                              <div>
                                   <Link
                                   href="/"
                                   className="block w-full rounded-full bg-blue-600 px-6 py-3 text-center text-base font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg sm:py-4 sm:text-lg"
                                   >
                                   CHOOSE
                                   </Link>
                              </div>
                         </div>
                    </div>
                    <div className="w-full overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                         <div className="p-6 sm:p-8 md:p-10">
                    
                              {/* Title */}
                              <div className="mb-6">
                                   <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                   Yearly
                                   </h2>

                                   <span className="text-sm font-medium tracking-wider text-gray-500 sm:text-base">
                                   PER MONTH
                                   </span>
                              </div>

                              {/* Price */}
                              <div className="mb-8 flex items-baseline">
                                   <span className="text-xl font-semibold text-blue-600 sm:text-2xl">
                                   $
                                   </span>

                                   <span className="text-6xl font-extrabold leading-none text-blue-600 sm:text-7xl">
                                   28
                                   </span>

                                   <span className="ml-2 text-sm text-gray-400">
                                   / month
                                   </span>
                              </div>

                              {/* Features */}
                              <div className="mb-8">
                                   <ul className="space-y-4">
                                   <li className="flex items-start gap-3 text-sm text-gray-600 sm:text-base">
                                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                        ✓
                                        </span>
                                        <span>Praesent dolor euismod convallis</span>
                                   </li>

                                   <li className="flex items-start gap-3 text-sm text-gray-600 sm:text-base">
                                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                        ✓
                                        </span>
                                        <span>Sed adipiscing gravida sit</span>
                                   </li>

                                   <li className="flex items-start gap-3 text-sm text-gray-600 sm:text-base">
                                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                        ✓
                                        </span>
                                        <span>Aenean aliquet, diam mi non</span>
                                   </li>
                                   </ul>
                              </div>

                              {/* Button */}
                              <div>
                                   <Link
                                   href="/"
                                   className="block w-full rounded-full bg-blue-600 px-6 py-3 text-center text-base font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg sm:py-4 sm:text-lg"
                                   >
                                   CHOOSE
                                   </Link>
                              </div>
                         </div>
                    </div>
               </div>
          </div> 
     )
}