// import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'

interface CurrencyStatusProps {
  currency: string
  value: string
  change: string
}

export function CurrencyStatus({ currency, value }: CurrencyStatusProps) {
  // const isPositive = Number(change) >= 0

  return (
      <div className="flex items-center space-x-2 rounded-md border border-gray-300 w-full p-2">
        <span className="font-medium">{currency}</span>
        <span>{value} UZS</span>
      </div>
  )
}

