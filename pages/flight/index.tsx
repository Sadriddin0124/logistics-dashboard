import FlightTable from '@/components/flight/flight-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Flight = () => {
  return (
    <div className=" container mx-auto">
      <div className="flex w-full justify-end gap-8">
        <Link
          href={"/flight/flight-info"}
          className="flex justify-end my-4"
        >
          <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md">
            Добавить заправку
          </Button>
        </Link>
      </div>
      <FlightTable />
    </div>
  )
}

export default Flight
