import { useEffect, useRef } from 'react'
import WsevernDays from '../components/card-wsevenday'

const SevendaySection = () => {
  const scrollRef = useRef(null)

  const sevenDaysData = [
    { date: 'Sabtu1', temp: '17' },
    { date: 'Minggu', temp: '18' },
    { date: 'Senin', temp: '19' },
    { date: 'Selasa', temp: '20' },
    { date: 'Rabu', temp: '21' },
    { date: 'Kamis', temp: '22' },
    { date: 'Jumat1', temp: '21' },
  ]

    useEffect(() => {
    const scrollContainer = scrollRef.current
    let intervalId = null

    const startScrolling = () => {
      intervalId = setInterval(() => {
        if (scrollContainer) {
          scrollContainer.scrollLeft += 5

          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
            clearInterval(intervalId)
            scrollContainer.scrollLeft = -100

            setTimeout(() => {
              startScrolling()
            }, 2000)
          }
        }
      }, 30)
    }
    const timeoutId = setTimeout(() => {
      startScrolling()
    }, 2000)
    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="w-full overflow-hidden h-full" ref={scrollRef}>
      <div className="flex whitespace-nowrap w-max h-full">
        {[...sevenDaysData, ...sevenDaysData].map((day, index) => (
          <div key={index} className="mx-2.5 min-w-[120px]">
            <WsevernDays date={day.date} temp={day.temp} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SevendaySection
