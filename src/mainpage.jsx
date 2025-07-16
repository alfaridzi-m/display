import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faCloudSunRain, faLocationArrow, faWind, faTemperature0, faCloudMoon } from '@fortawesome/free-solid-svg-icons'
import WeatherChart from './components/linecard'
import WheatherToday from './components/card-wheathertoday'
import SevendaySection from './section/seven-days'


const Mainpage = () => {

  return (
    <> 
    <div className="bg-black w-screen h-screen p-8 flex flex-col">
        <div className="text-white flex justify-center text-5xl font-bold flex-row gap-4 items-center relative">
            <input type="search" placeholder='Cari lokasi'  name='searchbar' className='rounded-xl p-2 text-base w-[400px] border-gray-50 border-2 absolute left-0'/>
            <FontAwesomeIcon icon={faLocationDot}  className='text-4xl'/>
            <h1>Lokasi Pelabuhan Mana</h1>
        </div>
        <div className="text-white flex flex-col w-full">
            <div className="flex flex-row gap-5 p-5 text-xl font-bold">
                <p className='text-gray-500'>Hari ini</p>
                <p>7 Hari kedepan</p>
            </div>
            <div className="flex flex-row w-full gap-5 h-full">
                <WheatherToday temp={'15'} date={'Jumat'} />
                 <SevendaySection />
                <div className=" w-1/4 rounded-2xl text-2xl">
                    <WeatherChart />
                </div>
            </div>
        </div>
        <div className='flex flex-row h-2/3 w-full gap-4 pt-7 '> 
            <div className='w-1/3 rounded-2xl grid grid-cols-2 gap-4'>
                <div className='bg-[#1B1B1D] rounded-3xl border-1 border-gray-700 flex flex-col text-white text-4xl justify-around text-center'>
                    <h2>Wind</h2>
                    <FontAwesomeIcon className='text-9xl' icon={faWind} />
                    <p>Lorem</p>
                </div>
                <div className='bg-[#1B1B1D] rounded-3xl border-1 border-gray-700 flex flex-col text-white text-4xl justify-around text-center'>
                    <h2>Wind</h2>
                    <FontAwesomeIcon className='text-9xl' icon={faLocationArrow} />
                    <p>Lorem</p>
                </div>
                <div className='bg-[#1B1B1D] rounded-3xl border-1 border-gray-700 flex flex-col text-white text-4xl justify-around text-center'>
                    <h2>Wind</h2>
                    <FontAwesomeIcon className='text-9xl' icon={faCloudSunRain} />
                    <p>Lorem</p>
                </div>
                <div className='bg-[#1B1B1D] rounded-3xl border-1 border-gray-700 flex flex-col text-white text-4xl justify-around text-center'>
                    <h2>Wind</h2>
                    <FontAwesomeIcon className='text-9xl' icon={faTemperature0} />
                    <p>Lorem</p>
                </div>
                
            
            </div>
            <div className='w-1/3 rounded-2xl flex flex-col justify-between'>
                <WeatherChart />
                <WeatherChart />
            </div>
            <div className='w-1/3 rounded-2xl flex flex-col gap-5 overflow-hidden now'>
                <div className='bg-[#1B1B1D] rounded-3xl item-center  border-1 border-gray-700 h-[200px] text-4xl text-white p-10 flex flex-row justify-between'>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-gray-400'>Pelabuhan</h2>
                        <h1 className='font-bold'>Jakarta</h1>
                        <p className='text-2xl flex gap-4 items-center'>Suhu Udara <span className='text-4xl'>30C</span></p> 
                    </div>
                    <FontAwesomeIcon icon={faCloudMoon} className='text-8xl' />
                </div>
                <div className='bg-[#1B1B1D] rounded-3xl item-center  border-1 border-gray-700 h-[200px] text-4xl text-white p-10 flex flex-row justify-between'>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-gray-400'>Pelabuhan</h2>
                        <h1 className='font-bold'>Jakarta</h1>
                        <p className='text-2xl flex gap-4 items-center'>Suhu Udara <span className='text-4xl'>30C</span></p> 
                    </div>
                    <FontAwesomeIcon icon={faCloudMoon} className='text-8xl' />
                </div>
                <div className='bg-[#1B1B1D] rounded-3xl item-center  border-1 border-gray-700 h-[200px] text-4xl text-white p-10 flex flex-row justify-between'>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-gray-400'>Pelabuhan</h2>
                        <h1 className='font-bold'>Jakarta</h1>
                        <p className='text-2xl flex gap-4 items-center'>Suhu Udara <span className='text-4xl'>30C</span></p> 
                    </div>
                    <FontAwesomeIcon icon={faCloudMoon} className='text-8xl' />
                </div>
                <div className='bg-[#1B1B1D] rounded-3xl item-center  border-1 border-gray-700 h-[200px] text-4xl text-white p-10 flex flex-row justify-between'>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-gray-400'>Pelabuhan</h2>
                        <h1 className='font-bold'>Jakarta</h1>
                        <p className='text-2xl flex gap-4 items-center'>Suhu Udara <span className='text-4xl'>30C</span></p> 
                    </div>
                    <FontAwesomeIcon icon={faCloudMoon} className='text-8xl' />
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Mainpage
