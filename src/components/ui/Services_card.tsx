import Image from "next/image";

interface PropsType {
     src: string,
     alt: string,
     head: string,
     body: string,
}

export default function Services_card({src, alt, head, body}: PropsType) {
     return (
          <div className=" relative text-center wrap-break-word w-full my-3 hover:bg-cyan-200 transition-all rounded-4xl mx-2 p-4">
               <div className="mb-8 ">
                    <span>
                         <Image className="m-auto" src={src} width={100} height={100} alt={alt}/>
                    </span>
               </div>
               <div className=" text-center">
                    <h4 className=" font-semibold text-blue-900 text-2xl">{head}</h4>
                    <p className="text-lg">{body}</p>
               </div>
          </div>
     )
}