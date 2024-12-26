import FlightInfoForm from '@/components/flight/flight-info-form'
import ExpenseHistory from '@/components/flight/flight-info-table'
import React from 'react'

const FlightInfo = () => {
  return (
    <div className='flex flex-col gap-10'>
      <FlightInfoForm/>
      <ExpenseHistory/>
    </div>
  )
}

export default FlightInfo
