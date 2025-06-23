import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'
const WsevernDays = ({date,temp}) => {
    return (
        <div className="flex flex-col bg-[#1B1B1D] p-4 w-1/6 gap-4 justify-between rounded-xl h-full text-2xl text-center">
            <h1 className='border-b-1 border-gray-500 w-full p-1'>{date}</h1>
            <FontAwesomeIcon className='text-2xl' icon={faSun} />
            <h1 className='text-2xl'>{temp}</h1>
        </div>
    )
}
export default WsevernDays