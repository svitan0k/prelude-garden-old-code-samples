import React, { memo, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { v4 as uuid } from 'uuid';
import { ShiftWindowContext } from "../contexts/SharedContext";
import { Link } from "react-router-dom";
import OverlayPart from "./OverlayPart";
import { useDispatch, useSelector } from "react-redux";
import { getAnonComments, getComments } from "../features/worksFeatures/comments";
import { getWork } from "../features/worksFeatures/getWork";
import { changeAuthAnonState } from "../features/worksFeatures/anonWorks";
import HoverTooltip from "./HoverTooltip";
import { clearScrollState, clearWorksState } from "../features/worksFeatures/listWorks";
import { getProfile } from "../features/userFeatures/profileView";


function ContentPart({work}) {
    
    const dispatch = useDispatch()

    const { anonWorks } = useSelector((state) => state.anonWorksList)

    const { showSecNavFunc, setSecNavBodyMode, setCommentsOpen, csrftoken } = useContext(ShiftWindowContext)

    const { userInfo } = useSelector((state) => state.userInfo)


    function getCommentsContainerFunc() {
        setCommentsOpen('open')
        showSecNavFunc({'funcToDispatch': [getComments({'workid': work.id}), getAnonComments({'workid': work.id})], 'workid': work.id}) 
        setSecNavBodyMode('post')
    }

    function getWorkContainerFunc() {
        setCommentsOpen('hidden')
        showSecNavFunc({'workid': work.id})
        setSecNavBodyMode('post') 
    }

    function authorshipFunc() {
        dispatch(changeAuthAnonState({'workid': work.id, userInfo, csrftoken}))
    }

    const authorshipState = useRef('')


    useLayoutEffect(() => {
        resizeAllGridItems()
    })

    function resizeItem(item) {
        let grid = document.getElementById('bodyBox')
        let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'))
        let rowHeight = 20
        var rowSpan = Math.ceil(Math.ceil(item.getBoundingClientRect().height+rowGap)/(rowHeight+rowGap))
        item.parentNode.style.gridRowEnd = 'span ' + rowSpan;
    }

    function resizeAllGridItems() {
        let allItems = document.getElementsByClassName('inside-post')

        for (let i = 0; i < allItems.length; i++) {
            allItems[i].classList.add('inside-post-pre')
            resizeItem(allItems[i])
            allItems[i].classList.remove('inside-post-pre')
        }
    }

    return (
        <div className={work.body.length >= 500 ? "postContainer grid-col-span-2" : "postContainer grid-col-span-1"}
        partid={work.id}
        author={work.author}
        key={uuid()}>
                <div className="inside-post">
                    <h2 onClick={() => getWorkContainerFunc()}>{work.title}</h2>
                    <h3>
                        <span className="postWorkType">{work.work_type}</span> by <div id={`post-key-${work.id}`}>
                            <Link to={
                            `/profile/${userInfo ?
                                            anonWorks.includes(work.id) ? 
                                                authorshipState.current = ("anonymouswriter") 
                                                : authorshipState.current = (work.author_username)
                                            : (work.published_anonymously ?
                                                authorshipState.current = ("anonymouswriter")
                                                : authorshipState.current = (work.author_username))
                                        }` }>
                            {userInfo ? 
                                userInfo.id === work.true_author ?
                                    anonWorks.includes(work.id) ?
                                        <i className="anon-work-authorship-link">Anonymous Writer</i>
                                    : <i className="anon-work-authorship-link">{work.author}</i>
                                : work.published_anonymously ? 
                                    <i className="anon-work-authorship-link">Anonymous Writer</i>
                                    : <i className="anon-work-authorship-link">{work.author}</i> 
                            : work.published_anonymously ? 
                                <i className="anon-work-authorship-link">Anonymous Writer</i>
                                : <i className="anon-work-authorship-link">{work.author}</i>
                            }
                        </Link>

                        {userInfo ? 
                            (userInfo.id === work.true_author &&
                                anonWorks.includes(work.id)) &&
                                    <Link to={`/profile/${work.author_username}`} onClick={() => {dispatch(clearScrollState()); }}>
                                        <i className="anon-work-authorship-link">(you)</i>
                                    </Link>
                            : null
                        }
                        </div>

                        { userInfo ? 
                            (userInfo.id === work.true_author &&
                                <HoverTooltip parentElement={`post-key-${work.id}`}>
                                    <div onClick={() => authorshipFunc()} className='anon-work-authorship-switch'>
                                        {anonWorks.includes(work.id) ? "Claim authorship" : "Make anonymous"}
                                    </div>
                                </HoverTooltip>)
                            : null
                        }
                    </h3>
                        <p>{work.body}{work.body.length >= 500 ? <i className="read-on-link" onClick={() => getWorkContainerFunc()}>...read on.</i> : null }</p>
                </div>
                <OverlayPart work={work} funcToDispatch={getCommentsContainerFunc} showdots={null}/>
        </div>
    )
}

export default memo(ContentPart)