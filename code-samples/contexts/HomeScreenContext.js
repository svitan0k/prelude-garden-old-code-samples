import React, { createContext, useState } from 'react'

export const HomeScreenContext = createContext()

function HomeScreenContextProvider(props) {

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [showCaptchaFallback, setShowCaptchaFallback] = useState(false)


    function toggleForm() {
        let currentFormStyle = window.getComputedStyle(document.getElementById('top-div')).getPropertyValue('max-height')

        if (currentFormStyle !== '0px') { // "if open"
            if (document.getElementById('work-form')) {
                document.getElementById('work-form').classList.remove('work-form-animation') // remove animation
            }
            document.getElementById('top-div').style.maxHeight = '0px' // collapse
        } else { // "if closed"
            if (document.getElementById('work-form')) { // "if it's a 'write' form"
                document.getElementById('work-form').classList.add('work-form-animation') // add animation
                document.getElemzentById('top-div').style.maxHeight = document.getElementById('top-div').firstChild.scrollHeight + document.getElementById('insideAnonHint').scrollHeight + 'px' // expand
            } else { // "else if it's a login form"
                document.getElementById('top-div').style.maxHeight = document.getElementById('top-div').firstChild.scrollHeight + 'px' // expand
            }
        }

        if (!document.querySelector('.captcha-fallback')) {
            setTimeout(() => {
                setShowCaptchaFallback(true)       
            }, 2500)
        }
        setIsFormOpen(!isFormOpen)
    }
    
    function openForm() {
        let currentFormStyle = window.getComputedStyle(document.getElementById('top-div')).getPropertyValue('max-height')

        if (document.getElementById('work-form')) {
            document.getElementById('top-div').style.maxHeight = document.getElementById('top-div').firstChild.scrollHeight + document.getElementById('insideAnonHint').scrollHeight + 'px'
        } else {
            document.getElementById('top-div').style.maxHeight = document.getElementById('top-div').firstChild.scrollHeight + 'px'
        }

        if (currentFormStyle !== '0px') {
            if (document.getElementById('work-form')) {
                document.getElementById('work-form').classList.remove('work-form-animation')
            }
        } else {
            if (document.getElementById('work-form')) {
                document.getElementById('work-form').classList.add('work-form-animation')
            }
        }

        if (!document.querySelector('.captcha-fallback')) {
            setTimeout(() => {
                setShowCaptchaFallback(true)       
            }, 2500)
        }
        setIsFormOpen(true)
    }

    const toggleAnonHint = () => {
        let currentFormStyle = window.getComputedStyle(document.getElementById('anonHint')).getPropertyValue('max-height')

        if (currentFormStyle !== `0px`) {
            document.getElementById('anonHint').style.maxHeight = '0px'
        } else {
            openForm()
            document.getElementById('anonHint').style.maxHeight = document.getElementById('insideAnonHint').scrollHeight + 'px'
        }
    }

    function openAnonHint() {
        document.getElementById('anonHint').style.maxHeight = document.getElementById('insideAnonHint').scrollHeight + 'px'
        openForm()
    }
    
    function adjustAnonHintOnResize() {
        if (window.getComputedStyle(document.getElementById('anonHint')).getPropertyValue('max-height') !== '0px') {
            openAnonHint()
        }
    }


    return (
        <HomeScreenContext.Provider value={{
            isFormOpen,
            showCaptchaFallback,
            setShowCaptchaFallback,
            setIsFormOpen,
            toggleAnonHint,
            adjustAnonHintOnResize,
            toggleForm,
            openForm,
        }}>
            {props.children}
        </HomeScreenContext.Provider>
  )
}

export default HomeScreenContextProvider