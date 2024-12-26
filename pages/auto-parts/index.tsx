import { AutoPartsDelete } from '@/components/auto-parts/auto-parts-delete'
import AutoPartsTable from '@/components/auto-parts/autoparts-table'
import React from 'react'

const AutoParts = () => {
  const [selectedParts, setSelectedParts] = React.useState<string[]>([])
  
  return (
    <div className='p-8 rounded-2xl mt-8 bg-white mx-auto container min-h-screen'>
      <div className="  flex items-center w-full justify-end gap-8">
        <AutoPartsDelete id={selectedParts}/>
      </div>
      <AutoPartsTable setSelectedParts={setSelectedParts} selectedParts={selectedParts}/>
    </div>
  )
}

export default AutoParts
