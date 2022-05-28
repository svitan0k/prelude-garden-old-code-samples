import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ShiftWindowContext } from '../contexts/SharedContext'
import QuestionTag from './QuestionTag'
import {convertFromHTML, convertFromRaw, convertToRaw, Editor, EditorState, RichUtils} from 'draft-js';
import { submitWork } from '../features/worksFeatures/workActions';
import HoverTooltip from './HoverTooltip';
import SliderCheckbox from './SliderCheckbox';
import { dispatchInfoNotification, dispatchNotification } from '../features/interfaceFeatures/message';
import HCaptcha from "@hcaptcha/react-hcaptcha";
import axios from 'axios';
import { HomeScreenContext } from '../contexts/HomeScreenContext';





function WriteForm() {

    const dispatch = useDispatch()
    
    const { csrftoken } = useContext(ShiftWindowContext)
    const { isFormOpen, showCaptchaFallback, adjustAnonHintOnResize, toggleAnonHint, openForm } = useContext(HomeScreenContext)

    const { userInfo } = useSelector((state) => state.userInfo)

    
    const [title, setTitle] = useState('')
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty(),);
    const [workType, setWorkType] = useState('Thoughts')
    const [anonPublish, setAnonPublish] = useState(false)
    const captchaRef = useRef(null);
    const editor = useRef(null)

    
    const theDate = new Date()
    const todaysDate = theDate.getFullYear() + "-" + ('0' + (theDate.getMonth()+1)).slice(-2) + "-" +  ('0' + theDate.getDate()).slice(-2) 
    const [dateWritten, setDateWritten] = useState(todaysDate)
    

    function editorFocus() {
        editor.current.focus()
    }

    function makeBold() {
        const nextState = RichUtils.toggleInlineStyle(editorState, "BOLD")
        setEditorState(nextState)
    }


    const handleEditorChange = (state) => {
        setEditorState(state)
    }
    
    const timesRendered = useRef(0)

    useEffect(() => { 
        if (timesRendered.current > 0) { 
            openForm()
        }
        timesRendered.current += 1
    }, [editorState])



    useEffect(() => {
        window.addEventListener("resize", adjustAnonHintOnResize)

        return () => {
            window.removeEventListener("resize", adjustAnonHintOnResize)
        }
    })

    function publishAnonFunc() { 
        setAnonPublish(!anonPublish)
    }




    

    const [captchaSuccess, setCaptchaSuccess] = useState(null)

    const captchaDiv = (
            <div className='inside-captcha-div'>
                {showCaptchaFallback && <p className='captcha-fallback'>Please allow hCaptcha if an extension is blocking it.</p>}
                <HCaptcha
                    sitekey="0f3ff3a8-8b3e-459b-8322-f1a2b16ef1fe"
                    onVerify={(token) => handleCaptchaSubmit(token)}
                    onError={(e) => dispatch(dispatchNotification('Captcha returned an error, please try again.'))}
                    ref={captchaRef}
                    theme={'dark'}
                    size={window.innerWidth <= 424 && 'compact'}
                />
            </div>
    )

    function handleSubmit(e){
        e.preventDefault()
        if (editorState.getCurrentContent().getPlainText('').length > 0) {
            if (captchaSuccess) {
                dispatch(submitWork({userInfo, title, editorState, dateWritten, workType, anonPublish, csrftoken}))
                setEditorState(() => EditorState.createEmpty(),)
                setTitle('')
                captchaRef.current.resetCaptcha()
                setCaptchaSuccess(null)
            } else {
                
                captchaRef.current.resetCaptcha()
                dispatch(dispatchInfoNotification('Please solve captcha to proceed'))
                setCaptchaSuccess(null)
            }
        } else {
            dispatch(dispatchNotification('The content must not be empty'))
        }
    }

    
    async function handleCaptchaSubmit(token) {

        const config = {
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
            }
        }

        let { data } = await axios.post('api/captcha/verify/', {
            'token': token,
        }, config)


        let jsonData = JSON.parse(data)

        setCaptchaSuccess(jsonData['success'])
    }
    

    useLayoutEffect(() => {
        if (isFormOpen) {
            if (window.innerWidth <= 424) {
                document.getElementsByClassName('captcha-div')[0].style.height = '144px' 
                document.getElementsByClassName('captcha-div')[0].style.maxHeight = '144px'
            } else {
                document.getElementsByClassName('captcha-div')[0].style.height = '78px' 
                document.getElementsByClassName('captcha-div')[0].style.maxHeight = '78px'
            }
        }
    
    }, [isFormOpen])
    

    return (
        <>
            <div id="top-div-form">
                <form method="POST" action="" id="work-form" onSubmit={(e) => handleSubmit(e)}>
                    <label htmlFor="title"><i className='write-form-emdash'>Title:</i> </label>
                    <input
                    type="text"
                    name="title"
                    id="title"
                    maxLength="200"
                    required
                    value={title}
                    
                    onChange={(e) => setTitle(e.target.value)}></input>
                    

                    <div><i className='write-form-emdash'>Content:</i> </div>
                    <div id="formBody" onClick={() => editorFocus()}>
                        
                        <Editor
                        ref={editor}
                        editorState={editorState}
                        onChange={handleEditorChange}
                        />
                    </div>

                    <label htmlFor="pub_date"><i className='write-form-emdash'>Publication Date:</i> </label>
                    <input
                    className='pub_date'
                    placeholder="Publication Date"
                    name="pub_date"
                    id="pub_date"
                    value={todaysDate + " ( Today )"}
                    disabled></input>
                    
                    <label htmlFor="date_written"><i className='write-form-emdash'>Date Written:</i> </label>
                    <input
                    type="date"
                    name="date_written"
                    id="date_written"
                    value={dateWritten}
                    max={todaysDate}
                    onChange={(e) => setDateWritten(e.target.value)}></input>
                    
                    <label htmlFor="work_type"><i className='write-form-emdash'>Type:</i> </label>
                    <select
                    name="work_type"
                    id="work_type"
                    form="work-form"
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}>
                        <option value="Poem">Poem</option>
                        <option value="Short story">Short story</option>
                        <option value="Essay">Essay</option>
                        <option value="Critique">Critique</option>
                        <option value="Review">Review</option>
                        <option value="Thoughts">Thoughts</option>
                    </select>

                    <div id="anonPubDiv">
                        <label htmlFor="publish_anonymously" id='anonPubLabel'>Publish anonymously?:</label>
                        <div id="anonOptionsRight">
                            <SliderCheckbox
                                checkboxId="publish_anonymously"
                                checkedState={anonPublish} changeStateFunc={publishAnonFunc}>
                            </SliderCheckbox>
                            <div onClick={toggleAnonHint} id='hover-anon-hint'>
                                <QuestionTag/>
                            </div>
                        </div>
                    </div>
                    <div id='anonHint'>
                        <div id='insideAnonHint'>
                            <p>"Anonymous Writer" will be shown instead of your name.<br/>You can later claim authorship by hovering over the name of the author.</p>
                        </div>
                    </div>
                    
                    <div className='captcha-div'>
                        {isFormOpen && captchaDiv}
                    </div>
                    <input type="submit" value="submit"/>
                </form>
            </div>
        </>
    )
}

export default WriteForm