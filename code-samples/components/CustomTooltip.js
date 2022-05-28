import React, { useEffect } from 'react'


function Tooltip({parentElement, children}) {

    const showTooltip = () => {
        let tooltip = document.getElementById(`${parentElement + "hover"}`)
        tooltip.style.opacity = 1
        tooltip.style.visibility = 'visible'
        tooltip.style.display = 'inline-block'
    }

    const hideTooltip = () => {
        let tooltip = document.getElementById(`${parentElement + "hover"}`)
        tooltip.style.opacity = 0
        tooltip.style.visibility = 'hidden'
        tooltip.style.display = 'none'
    }

    function trackCursor(e) {
        let tooltip = document.getElementById(parentElement + "hover")
        
        let x = e.clientX
        let y = e.clientY

        tooltip.style.left = x + window.scrollX + 'px'
        tooltip.style.top = y + 30 + window.scrollY + 'px'
    }

    useEffect(() => {
        // adding hover event
        document.getElementById(`${parentElement}`).addEventListener("mouseenter", showTooltip)
        document.getElementById(`${parentElement}`).addEventListener("mouseleave", hideTooltip)

        // adding listen to track tolltip position
        document.getElementsByTagName('body')[0].addEventListener("mousemove", trackCursor)

        document.getElementsByTagName('body')[0].appendChild(document.getElementById(parentElement + "hover"))

        if (document.getElementById(parentElement + "hover").width > window.innerWidth) {
            document.getElementById(parentElement + "hover").style.maxWidth = window.innerWidth
        }
        
        document.getElementById(parentElement + "hover").style.transition = "all 0.3s"
        document.getElementById(parentElement + "hover").style.zIndex = "35"
        

        return () => { // cleaning up
            if (document.getElementById(`${parentElement}`)) {
                document.getElementById(`${parentElement}`).removeEventListener("mouseenter", showTooltip)
                document.getElementById(`${parentElement}`).removeEventListener("mouseleave", hideTooltip)
            }
            document.getElementsByTagName('body')[0].removeEventListener("onmousemove", trackCursor)
        }
    }, [])

    
    return (
        <div className='hover-tooltip-container' id={parentElement + "hover"}>
            {children}
        </div>
    )
}

export default Tooltip