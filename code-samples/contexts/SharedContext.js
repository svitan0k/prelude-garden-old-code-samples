import axios from 'axios'
import React, { createContext, useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { dispatchInfoNotification } from '../features/interfaceFeatures/message'
import { getUserSettings } from '../features/userFeatures/userInfo'
import { getAnonWorks } from '../features/worksFeatures/anonWorks'
import { clearCommentsState } from '../features/worksFeatures/comments'
import { clearWorkState, getWork } from '../features/worksFeatures/getWork'
import { clearWorksState, listWorks } from '../features/worksFeatures/listWorks'
import { getUserLikes, getWorkAttributes } from '../features/worksFeatures/workActions'


export const ShiftWindowContext = createContext()

function ShiftWindowContextProvider(props) {
    
    const dispatch = useDispatch()
    
    let { profileUsername } = useParams()

    const { userInfo, } = useSelector((state) => state.userInfo)

    const [commentsOpen, setCommentsOpen] = useState(null)
    const [secNavBodyMode, setSecNavBodyMode] = useState(null)
    const [showCommentsState, setShowCommentsState] = useState(true)

    function showMenuFunc() {
        let navOverlay = document.getElementById('navOverlay')
        let navCurrentStyle = window.getComputedStyle(navOverlay)
        let navWidth = document.getElementById('navOverlay').offsetWidth
        let menuButton = document.getElementById('menu-button')
        let mainBody = document.getElementById('main')
        let secNavBodyMode = document.getElementsByClassName('sec-nav-body-container')[0]

        if (navCurrentStyle.getPropertyValue('transform') === `matrix(1, 0, 0, 1, -${navWidth}, 0)`) {
            menuButton.style.transform = `translateX(${document.getElementById('navOverlay').offsetWidth}px)`
            mainBody.style.transform = `translateX(${Math.ceil(document.getElementById('navOverlay').offsetWidth-(document.getElementById('navOverlay').offsetWidth*0.5))}px)`
            navOverlay.style.transform = `translateX(0px)`
            navOverlay.style.visibility = `visible`
            secNavBodyMode.style.transform = `translateX(${Math.ceil(document.getElementById('navOverlay').offsetWidth-(document.getElementById('navOverlay').offsetWidth*0.5))}px)`
        } else {
            navOverlay.style.transform = `translateX(-${document.getElementById('navOverlay').offsetWidth}px)`
            mainBody.style.transform = `translateX(0px)`
            menuButton.style.transform = `translateX(0px)`
            secNavBodyMode.style.transform = `translateX(0px)`
        }

        // give focus to the slid out element
        document.getElementById("topNavFocus").focus()
    } 

    function keyFunction() { // this function exists to allow smooth transition of the nav bar when using keyboard keys
        let navOverlay = document.getElementById('navOverlay')
        let menuButton = document.getElementById('menu-button')
        let mainBody = document.getElementById('main')
        let secNavBodyMode = document.getElementsByClassName('sec-nav-body-container')[0]

        menuButton.style.transform = `translateX(${document.getElementById('navOverlay').offsetWidth}px)`
        mainBody.style.transform = `translateX(${(Math.ceil(document.getElementById('navOverlay').offsetWidth-(document.getElementById('navOverlay').offsetWidth*0.5)))}px)`
        navOverlay.style.transform = `translateX(0px)`
        navOverlay.style.visibility = `visible`
        secNavBodyMode.style.transform = `translateX(${Math.ceil(document.getElementById('navOverlay').offsetWidth-(document.getElementById('navOverlay').offsetWidth*0.5))}px)`

        document.getElementById("topNavFocus").focus()
    }

    function clickedOut() { // this function exists to allow smooth transition of the nav bar when using keyboard keys
        document.getElementById('navOverlay').style.transform = `translateX(-${document.getElementById('navOverlay').offsetWidth}px)`
        document.getElementById('menu-button').style.transform = `translateX(0px)`
        document.getElementById('main').style.transform = `translateX(0px)`
        document.getElementsByClassName('sec-nav-body-container')[0].style.transform = `translateX(0px)`

        //Lose focus on sliding back in
        document.getElementById("topNavFocus").blur()
    }


    // Second nav DOM mutations
    async function showSecNavFunc(args) {
        if (args) {
            var { funcToDispatch, workid } = args
        }
        if (workid) {
            dispatch(getWork({workid}))
        }

        if (funcToDispatch) {
            if(funcToDispatch.length > 1) {
            funcToDispatch.forEach(func => {
                dispatch(func)
            })} else {
                dispatch(funcToDispatch)
            }
        }
        
        document.getElementsByClassName('sec-nav-body')[0].scrollTop = 0
        document.getElementsByClassName('sec-nav-backdrop')[0].style.opacity = 0.8
        document.getElementsByClassName('sec-nav-body-container')[0].style.opacity = 1
        document.getElementsByClassName('sec-nav-container')[0].style.opacity = 1
        document.getElementById('secNavCloseButton').style.opacity = 1
        document.getElementsByClassName('sec-nav-body')[0].style.opacity = 1
        
        document.getElementsByClassName('sec-nav-backdrop')[0].style.visibility = 'visible'
        document.getElementsByClassName('sec-nav-container')[0].style.visibility = 'visible'
        document.getElementsByClassName('sec-nav-body-container')[0].style.visibility = 'visible'
        document.getElementById('secNavCloseButton').style.visibility = 'visible'
        document.getElementsByClassName('sec-nav-body')[0].style.visibility = 'visible'

    }

    function hideSecNav(showCommentsState, setShowCommentsState, setEdit) {
        
        document.getElementsByClassName('sec-nav-container')[0].style.opacity = 0
        document.getElementsByClassName('sec-nav-backdrop')[0].style.opacity = 0
        document.getElementsByClassName('sec-nav-body-container')[0].style.opacity = 0
        document.getElementsByClassName('sec-nav-body')[0].style.opacity = 0
        document.getElementById('secNavCloseButton').style.opacity = 0

        
        
        hideCommentsFunc()
        
        if (commentsOpen === 'open' && showCommentsState === true) {
            setShowCommentsState(true)
        } else if (commentsOpen === 'hidden' && showCommentsState === false) {
            setShowCommentsState(true)
        } else if (commentsOpen === 'open' && showCommentsState === false) {
            setShowCommentsState(true)
        }
        
        setTimeout(() => {
            document.getElementById('secNavCloseButton').style.visibility = 'hidden'
            document.getElementsByClassName('sec-nav-body')[0].style.visibility = 'hidden'
            document.getElementsByClassName('sec-nav-container')[0].style.visibility = 'hidden'
            document.getElementsByClassName('sec-nav-backdrop')[0].style.visibility = 'hidden'
            document.getElementsByClassName('sec-nav-body-container')[0].style.visibility = 'hidden'
            dispatch(clearWorkState())
            dispatch(clearCommentsState())
        }, 350)
        if(setEdit){setEdit(false)}
        setCommentsOpen(null)
    }

    function closeCommentsForm(showCommentsState, setShowCommentsState) { 
        if (commentsOpen === 'open' && showCommentsState === true) {
            setShowCommentsState(false)
        } else if (commentsOpen === 'hidden' && showCommentsState === false) {
            setShowCommentsState(true)
        }
    }


    function showCommentsFunc() {
        if (window.innerWidth <= 768) {
            document.getElementById('secNavCloseButton').style.opacity = 0
            document.getElementById('secNavCloseButton').style.visibility = 'hidden'
        }
        
        if (document.querySelector(`#commentsContainer`)) {
            document.querySelector(`#commentsContainer`).style.visibility = 'visible'
            document.querySelector(`#commentsContainer`).style.opacity = 1
        }
    }
    
    function hideCommentsFunc() {
        if (window.innerWidth <= 768) {
            document.getElementById('secNavCloseButton').style.opacity = 1
            document.getElementById('secNavCloseButton').style.visibility = 'visible'
        }

        if (document.querySelector(`#commentsContainer`)) {
            document.querySelector(`#commentsContainer`).style.visibility = 'hidden'
            document.querySelector(`#commentsContainer`).style.opacity = 0
        }
    }

    function showHelperOptions() {
        document.getElementById('helperOptionsList').style.visibility = 'visible'
        document.getElementById('helperOptionsList').style.opacity = 1
    }

    function hideHelperOptions() {
        document.getElementById('helperOptionsList').style.visibility = 'hidden'
        document.getElementById('helperOptionsList').style.opacity = 0
    }



    async function deletePost(args) {
        const { userInfo, workid, showCommentsState, setShowCommentsState, } = args

        const config = {
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        if (window.confirm("Are you sure you want to delete this work?")) {
            await axios.delete(`api/works/delete/${workid}/`, config).then(() => {
                hideSecNav(showCommentsState, setShowCommentsState)
                dispatch(dispatchInfoNotification('Work successfully deleted.'))
                dispatch(clearWorksState()) 
                dispatch(listWorks({'userInfo': userInfo ? true : false, sortWorkType: 'all', sortWorkTime: 'newer_works', username: profileUsername ? profileUsername : null}))
            })
        }
    }
    
    

    function shiftWindow(event) {
        const et = event.target.tagName
        const etid = event.target
        if (et !== "INPUT" && et !== "TEXTAREA" && !etid.hasAttribute('contenteditable')) {
            if (event.ctrlKey !== true) {
                if (event.defaultPrevented) {
                    return {}
                }
                
                switch(event.key) {
                    case "Right":
                    case "ArrowRight":
                        keyFunction()
                        break;
                    case "Esc":
                    case "Escape":
                        hideSecNav()
                    case "Left":
                    case "ArrowLeft":
                        clickedOut()
                        break;
                    default:
                        return {};
                }
                event.preventDefault()
            }
        }
    }

    // Nav transition function for touchscreens
    let clientX, clientY

    function getFirstTouch(event) {
        // event.preventDefault();
        clientX = event.touches[0].clientX
        clientY = event.touches[0].clientY
    }

    function getLastTouch(event) {
        let deltaX, deltaY

        deltaX = event.changedTouches[0].clientX - clientX
        deltaY = event.changedTouches[0].clientY - clientY

    
    

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 100){ // if left
                showMenuFunc()
            } else if(deltaX < -100) { // if right
                clickedOut()
            }
        }

    }


    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');


    useLayoutEffect(() => {
        document.getElementById('menu-button').style.transform = `translateX(0px)`
        document.getElementById('main').style.transform = `translateX(0px)`
        document.getElementById('navOverlay').style.transform = `translateX(-${document.getElementById('navOverlay').offsetWidth}px)`
        document.getElementById('navOverlay').style.visibility = `hidden`
    })


    useEffect(() => {
        window.addEventListener("keydown", shiftWindow, false)
        window.addEventListener("touchstart", getFirstTouch, false)
        window.addEventListener("touchend", getLastTouch, false)

        if (userInfo) {
            dispatch(getUserLikes({userInfo, csrftoken}))
            dispatch(getAnonWorks({'userid': userInfo.id, csrftoken}))
        } else {
            dispatch(getWorkAttributes())
        }

        return () => {
            window.removeEventListener('keydown', shiftWindow);
            window.removeEventListener('touchstart', getFirstTouch)
            window.removeEventListener('touchend', getLastTouch)
        }
    }, [userInfo, deletePost])
    
    useEffect(() => {
        if (userInfo) {
            dispatch(getUserSettings({userInfo}))
        }
    }, [userInfo,])

    return (
        <ShiftWindowContext.Provider value={{
            showCommentsState,
            csrftoken,
            commentsOpen,
            secNavBodyMode,
            clickedOut,
            showMenuFunc,
            showSecNavFunc,
            hideSecNav,
            showCommentsFunc,
            hideCommentsFunc,
            closeCommentsForm,
            showHelperOptions,
            hideHelperOptions,
            deletePost,
            hideShowPost,
            setSecNavBodyMode,
            setCommentsOpen,
            setShowCommentsState,
        }}>
            {props.children}
        </ShiftWindowContext.Provider>
    )
}

export default ShiftWindowContextProvider