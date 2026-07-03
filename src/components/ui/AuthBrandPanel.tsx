import Link from "next/link"

type BulletItem = {
  icon: string
  text: string
}

type AuthBrandPanelProps = {
  headline: string
  subtext: string
  items: BulletItem[]
}

export default function AuthBrandPanel({ headline, subtext, items }: AuthBrandPanelProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-blue-700 flex-col justify-between p-12 text-white">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
          🦷
        </div>
        <Link href="/" className="text-xl font-bold">DentalCare</Link>
      </div>

      <div>
        <h1 className="text-4xl font-bold leading-snug whitespace-pre-line">{headline}</h1>
        <p className="mt-4 text-blue-200 text-lg">{subtext}</p>

        <div className="mt-12 space-y-4">
          {items.map(item => (
            <div key={item.text} className="flex items-center gap-3 text-blue-100">
              <span className="text-xl">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-blue-300 text-sm">
        © {new Date().getFullYear()} DentalCare. All rights reserved.
      </p>
    </div>
  )
}