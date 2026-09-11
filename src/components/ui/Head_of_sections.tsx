
export default function Head_of_sections(props: {title: string, subtitle: string}) {
     return (
          <div className="w-full text-center">
               <span className="text-blue-400 capitalize text-xl font-bold">{props.subtitle}</span>
               <h1 className="text-4xl text-blue-800 leading-tight font-extrabold">{props.title}</h1>
          </div>
     )
}