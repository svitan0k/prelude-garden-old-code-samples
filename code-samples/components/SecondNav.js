import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShiftWindowContext } from "../contexts/SharedContext";
import { Link } from "react-router-dom";
import OverlayPart from "./OverlayPart";
import CommentsPart from "./CommentsPart";
import UserSettings from "./UserSettings";
import WorkUpdateForm from "./WorkUpdateForm";
import Loader from "./Loader";
import { useParams } from 'react-router';
import { getAnonComments, getComments } from "../features/worksFeatures/comments";
import { changeHiddenState } from "../features/worksFeatures/hideWork";


function SecondNav() {

    const dispatch = useDispatch()

    const { profileUsername } = useParams()

    const { userInfo } = useSelector((state) => state.userInfo)

    const { workDetails, uniqueWorkLoading, } = useSelector((state) => state.workDetails)

    

    const { hideSecNav, } = useContext(ShiftWindowContext)
    const {
        commentsOpen,
        showCommentsFunc,
        hideCommentsFunc,
        closeCommentsForm,
        deletePost,
        secNavBodyMode,
        showHelperOptions,
        hideHelperOptions,
        
        showCommentsState,
        setShowCommentsState,
    } = useContext(ShiftWindowContext)

    const anonWorksList = useSelector((state) => state.anonWorksList)
    const { anonWorks } = anonWorksList



    function openCommentsForm() {
        
            dispatch(getComments({'workid': workDetails.id}))
            dispatch(getAnonComments({'workid': workDetails.id}))
        
        if (showCommentsState === false) {
            setShowCommentsState(true)
        } else {
            setShowCommentsState(false)
        }
    }

    useEffect(() => {
        if (commentsOpen === 'open' && showCommentsState === true) {
            showCommentsFunc()
        } else if (commentsOpen === 'hidden' && showCommentsState === false) {
            showCommentsFunc()
        } else if (commentsOpen === 'open' && showCommentsState === false) {
            hideCommentsFunc()
        } else if (commentsOpen === 'hidden' && showCommentsState === true) {
            hideCommentsFunc()
        } else {
            hideCommentsFunc()
        }
    })

    const [edit, setEdit] = useState(false)

    function editPost() {
        if (edit === true) {
            setEdit(false)
        } else {
            setEdit(true)
        }
    }

    

    return (
        <div className="sec-nav-container">
            <div className="sec-nav-backdrop" onClick={() => hideSecNav(showCommentsState, setShowCommentsState, setEdit)}></div>
            <div id="secNavCloseButton" onClick={() => hideSecNav(showCommentsState, setShowCommentsState, setEdit)}>&#10005;</div>
            <div className="sec-nav-body-container">

                <div className="inside-sec-nav-body-container">
                    {(workDetails && secNavBodyMode === 'post') && (commentsOpen === "open" || showCommentsState === true || showCommentsState === false) &&
                        <div id="commentsContainer">
                            <CommentsPart workid={workDetails.id} />
                        </div>
                    }
                
                <div className="sec-nav-body" onClick={() => closeCommentsForm(showCommentsState, setShowCommentsState)}>
                    {secNavBodyMode === 'settings' ?
                        <UserSettings />
                    : secNavBodyMode === 'post' ?
                    <>
                    { uniqueWorkLoading ? <Loader/> 
                        :
                        <div className="inside-sec-nav-post-container" >
                            {workDetails && workDetails.hidden && <div id="notice-of-hidden">This work is currently hidden</div>}
                            
                            <div className="post-inside-sec-nav">
                                    <h2>{workDetails.title}</h2>

                                    <div className="inside-post-authorship">
                                        <span className="postWorkType">{workDetails.work_type}</span> by <Link
                                            to={
                                                `/profile/${userInfo ?
                                                                anonWorks.includes(workDetails.id) ?
                                                                    "anonymouswriter" 
                                                                    : workDetails.author_username
                                                            : (workDetails.published_anonymously ?
                                                                "anonymouswriter" 
                                                                : workDetails.author_username)

                                            }`} style={{textAlign: 'center'}}>
                                            {userInfo ? 
                                                userInfo.id === workDetails.true_author && 
                                                    anonWorks.includes(workDetails.id) ? 
                                                        <span>Anonymous Writer</span>
                                                    : userInfo.id === workDetails.true_author ?
                                                        <i className="anon-work-authorship-link">{workDetails.author}</i>
                                                        : workDetails.published_anonymously ? 
                                                            <i className="anon-work-authorship-link">Anonymous Writer</i>
                                                            : <i className="anon-work-authorship-link">{workDetails.author}</i>
                                            : workDetails.published_anonymously ? 
                                                <i className="anon-work-authorship-link">Anonymous Writer</i> 
                                                : <i className="anon-work-authorship-link">{workDetails.author}</i>
                                            }
                                            </Link>
                                    </div>

                                    {edit ?
                                        <WorkUpdateForm setEditState={setEdit} />
                                        : <div className="sec-nav-work-body">{workDetails.body}</div>
                                    }
                            </div>
                        </div>
                        }
                    </>
                    : 
                    <>
                        {/* <Loader/> */}
                    </>}
                </div>
                </div>
                { (workDetails && secNavBodyMode === 'post') &&
                    <OverlayPart work={workDetails} funcToDispatch={openCommentsForm} showdots={(
                        <li onMouseOver={() => showHelperOptions()} onMouseOut={() => hideHelperOptions()} id="helperOptionsContainer">
                            <span id='three-dots-on-post'>&#8942;</span>
                            <ul id="helperOptionsList">
                                <li onClick={() => editPost()}>Edit</li>
                                <li onClick={() => dispatch(changeHiddenState({'workid': workDetails.id, userInfo, profileUsername}))}>{workDetails && (workDetails.hidden ? "Unhide" : "Hide")}</li>
                                <li onClick={() => deletePost({userInfo, 'workid': workDetails.id, showCommentsState, setShowCommentsState})}>Delete</li>
                            </ul>
                        </li>
                    )}/>
                }
            </div>
        </div>
    )
}

export default SecondNav