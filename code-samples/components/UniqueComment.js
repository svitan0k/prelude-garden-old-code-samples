import React, { useContext, useRef, } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ShiftWindowContext } from '../contexts/SharedContext'
import { Link } from 'react-router-dom'
import { changeCommentAnonState, deleteComment } from '../features/worksFeatures/comments';
import { clearScrollState } from '../features/worksFeatures/listWorks';
import HoverTooltip from './HoverTooltip';

function UniqueComment({comment}) {
    
    const dispatch = useDispatch()

    const { csrftoken, } = useContext(ShiftWindowContext)
    const { userInfo } = useSelector((state) => state.userInfo)
    const { workDetails, } = useSelector((state) => state.workDetails)
    const { anonComments } = useSelector((state) => state.comments)
    

    const editor = useRef(null)

    function focusEditor() {
        editor.current.focus()
    }


    function commentAuthorshipFunc() {
        dispatch(changeCommentAnonState({'workid': workDetails.id, userInfo, 'commentid': comment.id, csrftoken}))
    }

    const authorshipState = useRef('') 
    
    function showHelperOptions() {
        document.querySelector(`.comment-helper-options-${comment.id}`).style.visibility = 'visible'
        document.querySelector(`.comment-helper-options-${comment.id}`).style.opacity = 1
    }

    function hideHelperOptions() {
        document.querySelector(`.comment-helper-options-${comment.id}`).style.visibility = 'hidden'
        document.querySelector(`.comment-helper-options-${comment.id}`).style.opacity = 0
    }

    return (
        <div className="commentEntry">
            <div className='comment_info'>
            <div className='comment-username-container'>
                <div id={`comment-key-${comment.id}`}>
                    <Link to={
                        `/profile/${userInfo ?
                                        anonComments.includes(comment.id) ? 
                                            authorshipState.current = ("anonymouswriter") 
                                            : authorshipState.current = (comment.author_username)
                                        : (comment.anon_comment_state ?
                                            authorshipState.current = ("anonymouswriter")
                                            : authorshipState.current = (comment.author_username))
                                    }` }>
                        {userInfo ? 
                            userInfo.id === comment.true_author ?
                                anonComments.includes(comment.id) ?
                                    <i className="anon-work-authorship-link">Anonymous Writer</i>
                                : <i className="anon-work-authorship-link">{comment.author}</i>
                            : comment.anon_comment_state ? 
                                <i className="anon-work-authorship-link">Anonymous Writer</i>
                                : <i className="anon-work-authorship-link">{comment.author}</i> 
                        : comment.anon_comment_state ? 
                            <i className="anon-work-authorship-link">Anonymous Writer</i>
                            : <i className="anon-work-authorship-link">{comment.author}</i>
                        }
                    </Link>

                    {userInfo ? 
                        (userInfo.id === comment.true_author &&
                            anonComments.includes(comment.id)) &&
                                <Link to={`/profile/${comment.author_username}`} onClick={() => {dispatch(clearScrollState()); }}>
                                    <i className="anon-work-authorship-link">(you)</i>
                                </Link>
                        : null
                    }
                    </div>
                </div>
                <div> {comment.posted_date}</div>
                { userInfo && userInfo.id === comment.true_author && 
                    <div className='downarrow-container' onMouseOver={() => showHelperOptions()} onMouseOut={() => hideHelperOptions()}>
                        <div className='downarrow'></div>
                        <ul className={`comment-helper-options comment-helper-options-${comment.id}`}>
                            { userInfo.id === comment.true_author && <li onClick={() => dispatch(deleteComment({userInfo, 'workid': workDetails.id, commentid: comment.id, csrftoken}))}>Delete</li>}
                        </ul>
                    </div>}
            </div>
            {
                userInfo &&
                    userInfo.id === comment.true_author &&
                    <HoverTooltip parentElement={`comment-key-${comment.id}`}>
                        <div onClick={() => commentAuthorshipFunc()} className='anon-comment-authorship-switch'>
                            {anonComments.includes(comment.id) ? "Claim authorship" : "Make anonymous"}
                        </div>
                    </HoverTooltip>
            }
            <div className="comment-entry-body">
                <p>{comment.content}</p>
            </div>
        </div>
    )
}

export default UniqueComment