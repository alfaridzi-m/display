import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

const WsevernDays = ({date, temp}) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <>
            <div 
                className={`flex flex-col bg-[#1B1B1D] p-4 min-w-[150px] gap-4 justify-between rounded-4xl h-full text-2xl text-center border-1 ${isHovered ? 'border-blue-400' : 'border-gray-700'} transition-all duration-300 transform ${isHovered ? 'scale-105' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <h1 className='border-b-1 border-gray-500 font-semibold'>{date}</h1>
                <FontAwesomeIcon 
                    className={`text-5xl ${isHovered ? 'text-yellow-400 animate-pulse' : ''} transition-colors duration-300`} 
                    icon={faSun} 
                />
                <h1 className={`text-2xl font-bold ${isHovered ? 'text-blue-300' : ''} transition-colors duration-300`}>{temp}°</h1>
            </div>
        </>
    )
}

export default WsevernDays