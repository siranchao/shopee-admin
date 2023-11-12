"use client"
import { useState, useEffect, useContext, createContext } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import EventModal from "@/components/modals/event-modal"
import axios from "axios"
import { EventColumn, columns } from "./eventTable/Columns"
import EventTable from "./eventTable/EventTable"

interface CalendarPanelProps {
    storeId: string
}

type EventListContextType = {
    events: EventColumn[]
    setEvents: React.Dispatch<React.SetStateAction<EventColumn[]>>
}

export const EventListContext = createContext<EventListContextType>({
    events: [],
    setEvents: () => {}
})

export function CalendarPanel({ storeId }: CalendarPanelProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [open, setOpen] = useState(false)
  const [events, setEvents] = useState<EventColumn[]>([])


  useEffect(() => {
      async function getEvents() {
        const res = await axios.get(`/api/${storeId}/events`)
        setEvents(res.data)
      }
      getEvents()
  }, [storeId])

  return (
    <>
        <EventListContext.Provider value={{ events, setEvents }}>
            <EventModal
                isOpen={open}
                storeId={storeId}
                date={date}
                onClose={() => setOpen(false)}
            />
            <div className="flex flex-col gap-2 xl:flex-row">
                <div className="rounded-md border shadow flex flex-col items-center w-full xl:w-1/2">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                    />
                    <Button variant="default" className="w-4/5 m-4" onClick={() => {setOpen(true)}}>
                        Add Event
                    </Button>
                </div>

                <div className="p-3 rounded-md border shadow flex flex-col w-full xl:w-1/2">
                    <h5 className="text-md font-semibold leading-none tracking-tight mb-2">Upcoming Events</h5>
                    <EventTable columns={columns} data={events}/>
                </div>
            </div>
        </EventListContext.Provider>
    </>
  )
}
