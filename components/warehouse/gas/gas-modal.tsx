import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface GasStation {
  id?: number
  name: string
  remainingGas: string
  lastPaymentDate: string
}

interface GasStationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (gasStation: GasStation) => void
  gasStation?: GasStation
}

export function FuelModal({ isOpen, onClose, onSave, gasStation }: GasStationModalProps) {
  const [formData, setFormData] = useState<GasStation>({
    name: '',
    remainingGas: '',
    lastPaymentDate: ''
  })

  useEffect(() => {
    if (gasStation) {
      setFormData(gasStation)
    } else {
      setFormData({ name: '', remainingGas: '', lastPaymentDate: '' })
    }
  }, [gasStation])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white'>
        <DialogHeader>
          <DialogTitle>{gasStation ? 'Редактировать заправку' : 'Добавить заправку'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Название
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remainingGas" className="text-right">
                Остаточный газ
              </Label>
              <Input
                id="remainingGas"
                name="remainingGas"
                value={formData.remainingGas}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastPaymentDate" className="text-right">
                День оплаты
              </Label>
              <Input
                id="lastPaymentDate"
                name="lastPaymentDate"
                value={formData.lastPaymentDate}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

