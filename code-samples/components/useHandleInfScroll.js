import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { triggerInfScroll } from '../features/worksFeatures/listWorks'

function useHandleInfScroll() {

    const dispatch = useDispatch()
    const { nextPage, scrollState } = useSelector((state) => state.worksList)
    

    function handleInfScroll(e) {
        if ((window.innerHeight + e.target.scrollTop + 10 >= e.target.scrollHeight) && nextPage) { 
            dispatch(triggerInfScroll())
        }
    }
    useEffect(() => {
        if (scrollState === 'end') {
            document.getElementById('root').removeEventListener('scroll', handleInfScroll, false)
        } else {
            document.getElementById('root').addEventListener('scroll', handleInfScroll, false)
        }
    
        return () => {
            document.getElementById('root').removeEventListener('scroll', handleInfScroll, false)
        }
    })
}

export default useHandleInfScroll