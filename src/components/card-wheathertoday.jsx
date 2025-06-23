import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'
const WheatherToday = ({temp,date}) => {
    return (
        <>
            <div className="bg-[#AECADF]  w-1/4 rounded-2xl text-black">
                    <div className="flex flex-row p-5 justify-between">
                        <p>{date}</p>
                        <p>11:45 AM</p>
                    </div>
                        <div className="flex flex-col bg-[#BBD7EC] w-full rounded-b-2xl p-5">
                            <div className='flex flex-row justify-between items-center w-full mb-5'>
                                <h2 className='text-4xl'>{temp}</h2>
                                <FontAwesomeIcon className='text-4xl' icon={faSun} />
                            </div>
                            <div className='gap-4 flex-col flex'>
                                <p>Arah angin <span className='font-bold'>7kt U</span></p>
                                <p>RH <span className='font-bold'>87%</span></p>
                                <p>Tinggi Gelombang <span className='font-bold'>1.02m</span></p>

                            </div>
                        </div>
            </div>
        </>
    )
}
export default WheatherToday