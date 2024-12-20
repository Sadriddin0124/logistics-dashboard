import FlightForm from '@/components/flight/flight-form'
import ExpenseHistory from '@/components/flight/flight-info-table'
import React from 'react'

const FlightInfo = () => {
  return (
    <div className='flex flex-col gap-10'>
      <FlightForm/>
      <ExpenseHistory/>
    </div>
  )
}

export default FlightInfo
