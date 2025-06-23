import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'
import WsevernDays from './components/card-wsevenday'
import WheatherToday from './components/card-wheathertoday'

const Mainpage = () => {
  return (
    <> 
    <div className="bg-black w-full h-full p-8">
        <div className="text-white flex justify-center text-5xl font-bold">
            <h1>Location Pelabuhan Mana</h1>
        </div>
        <div className="text-white flex flex-col w-full ">
            <div className="flex flex-row gap-5 p-5">
                <p>Hari ini</p>
                <p>Besok</p>
                <p>7 Hari kedepan</p>
            </div>
            <div className="flex flex-row w-full gap-5">
                <WheatherToday temp={'15'} date={'Jumat'} />
                <div className=" flex flex-row w-1/2 gap-5 justify-between">
                    <WsevernDays temp={'15'} date={'17'} />
                    <WsevernDays temp={'16'} date={'18'} />
                    <WsevernDays temp={'17'} date={'19'} />
                    <WsevernDays temp={'18'} date={'20'} />
                    <WsevernDays temp={'19'} date={'21'} />
                    <WsevernDays temp={'20'} date={'22'} />
                    <WsevernDays temp={'21'} date={'23'} />

                </div>

                <div className="bg-amber-300 w-1/4 rounded-2xl text-2xl"> text
                </div>

            </div>
        </div>
    </div>
    </>
  )
}

export default Mainpage
