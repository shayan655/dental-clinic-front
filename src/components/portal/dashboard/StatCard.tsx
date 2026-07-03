type AccentColor = 'blue' | 'green' | 'amber' | 'indigo'

const accentClasses: Record<AccentColor, { bg: string; text: string }> = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-600'   },
  green:  { bg: 'bg-green-50',  text: 'text-green-600'  },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-600'  },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
}

type StatCardProps = {
  label: string
  value: number
  icon: string
  accent: AccentColor
}

export default function StatCard({ label, value, icon, accent }: StatCardProps) {
  const { bg, text } = accentClasses[accent]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 shadow-xl">
      <div className={`${bg} ${text} text-2xl rounded-lg p-2`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  )
}