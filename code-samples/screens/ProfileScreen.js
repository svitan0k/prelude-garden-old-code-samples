import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router'
import ContentPart from '../components/ContentPart';
import { v4 as uuid } from 'uuid';
import Loader from '../components/Loader';
import { useParams } from 'react-router';
import FilterOptions from '../components/FilterOptions';
import NothingPage from '../components/NothingPage';
import { clearProfileView, getProfile } from '../features/userFeatures/profileView';
import { updateWithSwitchToEdit } from '../features/userFeatures/userInfo';
import { ShiftWindowContext } from '../contexts/SharedContext';
import { getHiddenWorks } from '../features/worksFeatures/hideWork';
import { dispatchNotification } from '../features/interfaceFeatures/message';


function ProfileScreen() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    // dependancies
    let { profileUsername } = useParams()

    const { userInfo, userSettings, updateProfileInfoError, } = useSelector((state) => state.userInfo)
    const { works, listWorksLoading } = useSelector((state) => state.worksList)
    const { profileInfo } = useSelector((state) => state.profileInfo)
    const { anonWorks } = useSelector((state) => state.anonWorksList)
    const { hiddenWorks } = useSelector((state) => state.hiddenWorksList)
    const { getProfileError, getProfileLoading } = useSelector((state) => state.profileInfo)
    const { csrftoken } = useContext(ShiftWindowContext)
    
    // profile fetures
    const [showAnonWorks, setShowAnonWorks] = useState(false)
    const [showHiddenWorks, setShowHiddenWorks] = useState(false)
    const [switchToEdit, setSwitchToEdit] = useState(false)
    let worksSeen = 0

    // profile info edit
    const [editProfileEmail, setEditProfileEmail] = useState('')
    const [editProfileFirstName, setEditProfileFirstName] = useState('')
    const [editProfileLastName, setEditProfileLastName] = useState('')
    const [editProfileUsername, setEditProfileUsername] = useState('')
    const [editProfileTelegramLink, setEditProfileTelegramLink] = useState('')


    // 404 page errors here
    if (getProfileError) {
        navigate('/404')
    }

    useEffect(() => {
        if (profileUsername) {
            dispatch(getProfile({profileUsername}))
            if (userInfo) {
                dispatch(getHiddenWorks({userid: userInfo.id, userInfo, csrftoken}))
            }
        }
    }, [profileUsername])

    useEffect(() => {
        if (profileUsername) {
            dispatch(getProfile({profileUsername}))
        } else 
        if (userInfo) {
            navigate(`/profile/${userInfo.username}`)
        } else {
            navigate(`/login`)
        }
        
    }, [profileUsername, userSettings, userInfo, profileInfo.username])


    useEffect(() => {
        setEditProfileEmail(profileInfo && profileInfo.email ? profileInfo.email : '')
        setEditProfileFirstName(profileInfo && profileInfo.first_name ? profileInfo.first_name : '')
        setEditProfileLastName(profileInfo && profileInfo.last_name ? profileInfo.last_name : '')
        setEditProfileUsername(profileInfo && profileInfo.username ? profileInfo.username : '')
        setEditProfileTelegramLink(profileInfo && profileInfo.telegram_link ? profileInfo.telegram_link : '')

        if (!userInfo) {
            setSwitchToEdit(false)
        }
    }, [profileInfo, userInfo, updateProfileInfoError])

    useEffect(() => {
        return () => {
            dispatch(clearProfileView())
        }
    }, [])

    const handleSwitchToEdit = () => {
        setSwitchToEdit(!switchToEdit)
        if (switchToEdit === true) {
            if ((/[ `!@#$%^&*()_+\\=\[\]{};':"\\|,.<>\/?~]/).test(editProfileUsername)) {
                dispatch(dispatchNotification("Username may only contain dashes(' - ') as special characters"))
            } else {
                dispatch(updateWithSwitchToEdit({userInfo, editProfileUsername, editProfileFirstName, editProfileLastName, editProfileEmail, editProfileTelegramLink, 'showEmail': userSettings.user_prefs.showEmailInProfile, csrftoken}))
            }
        }
    }

    const gridObserver = new MutationObserver(function(mutations_list) {
        mutations_list.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(added_node) {
                resizeItem(added_node)
            })
        })
        resizeAllGridItems()
        gridObserver.disconnect()
    })
    
    useLayoutEffect(() => {
        if (document.getElementById('bodyBox')) {
            gridObserver.observe(document.getElementById('bodyBox'), {childList: true, subtree:false})
        }
    })


    function toggleForm() {
        let currentFormStyle = window.getComputedStyle(document.getElementById('top-div')).getPropertyValue('max-height')


        if (currentFormStyle !== '0px') {
            document.getElementById('top-div').style.maxHeight = '0px'
        } else {
            document.getElementById('top-div').style.maxHeight = `${document.getElementById('top-div').firstChild.offsetHeight}px`
        }
    }
    
    function openForm() {
        let currentFormStyle = window.getComputedStyle(document.getElementById('top-div')).getPropertyValue('max-height')


        if (currentFormStyle === '0px') {
            document.getElementById('top-div').style.maxHeight = `${document.getElementById('top-div').firstChild.offsetHeight}px`
        }
    }




    function resizeItem(item) {
        let grid = document.getElementById('bodyBox')
        let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'))
        let rowHeight = 20
        var rowSpan = Math.ceil(Math.ceil(item.getBoundingClientRect().height+rowGap)/(rowHeight+rowGap))
        
        item.parentNode.style.gridRowEnd = 'span ' + rowSpan;
    }

    function resizeAllGridItems() {
        let allItems = document.getElementsByClassName('insidePost')

        for (let i = 0; i < allItems.length; i++) {
            allItems[i].classList.add('insidePostPre')
            resizeItem(allItems[i])
            allItems[i].classList.remove('insidePostPre')
        }
    }

    function addClassAndResize() {
        let allItems = document.getElementsByClassName('insidePost')

        for (let i = 0; i < allItems.length; i++) {
            resizeItem(allItems[i])
        }
    }
    
    useEffect(() => {
        window.addEventListener("resize", addClassAndResize)


        return () => {
            window.removeEventListener("resize", addClassAndResize)
        }
    })


    useEffect(() => {
        return () => {
            setShowAnonWorks(false)
        }
    }, [profileUsername])

    
    return (
        <>
        {profileInfo ? 
        <div id="profileContainer">
            <div id="topProfilePart">
                <div id="userProfileInfo">
                    {(userInfo && userInfo.username === profileInfo.username) &&
                        userSettings && (userSettings.user_prefs && userSettings.user_prefs.showNameInsteadUsername !== false || userSettings.user_prefs.showEmailInProfile !== false || userSettings.user_prefs.showTelegramLink !== false) &&
                        <div className="edit-icon-container">
                            <i className="fas fa-edit" onClick={handleSwitchToEdit}></i>
                        </div>}

                    {getProfileLoading ? <Loader /> :
                        <div className='switch-to-edit-container'>
                            {switchToEdit ?
                                (userSettings && userSettings.user_prefs.showNameInsteadUsername) ?
                                <div className="switchToEditPart">
                                    <i className="fas fa-feather-alt"></i>
                                    <div className='switchToEditName'>
                                        <label htmlFor="editProfileFirstName"></label>
                                        <input 
                                        type="text"
                                        id="editProfileFirstName"
                                        name="editProfileFirstName"
                                        maxLength="100"
                                        value={editProfileFirstName ? editProfileFirstName : ''} onChange={(e) => setEditProfileFirstName(e.target.value)}
                                        />
                                    
                                        <label htmlFor="editProfileLastName"></label>
                                        <input 
                                        type="text"
                                        id="editProfileLastName"
                                        name="editProfileLastName"
                                        maxLength="100"
                                        value={editProfileLastName ? editProfileLastName : ''} onChange={(e) => setEditProfileLastName(e.ftarget.value)}
                                        />
                                    </div>
                                </div>
                                :  <div className='profile-info-part'>
                                        <i className="fas fa-feather-alt"></i>
                                        {profileInfo.preferred_name}
                                    </div>
                            :  <div className='profile-info-part'>
                                    <i className="fas fa-feather-alt"></i>
                                    {profileInfo.preferred_name}
                                </div>}
                            
                            {profileInfo.email &&
                                switchToEdit ?
                                    (userSettings && userSettings.user_prefs.showEmailInProfile) &&
                                        <div className="switchToEditPart">
                                            <label htmlFor="editProfileEmail"><i className="fas fa-envelope"></i></label>
                                            <input 
                                            type="email"
                                            id="editProfileEmail"
                                            name="editProfileEmail"
                                            minLength="6"
                                            maxLength="100"
                                            value={editProfileEmail ? editProfileEmail : ''} onChange={(e) => setEditProfileEmail(e.target.value)}
                                            />
                                        </div>
                                    : profileInfo.email && 
                                        <div className='profile-info-part'>
                                            <i className="fas fa-envelope"></i>
                                            <a href={`mailto:${profileInfo.email}`}>{profileInfo.email}</a>
                                        </div>
                            }

                            {profileInfo.telegram_link &&
                                switchToEdit ? 
                                    (userSettings && userSettings.user_prefs.showTelegramLink) &&
                                        <div className="switchToEditPart">
                                            <label htmlFor="editProfileTelegramLink"><i className="fas fa-paper-plane"></i></label>
                                            <input
                                            type='text'
                                            id="editProfileTelegramLink"
                                            name="editProfileTelegramLink"
                                            minLength="19"
                                            maxLength="100"
                                            value={editProfileTelegramLink ? editProfileTelegramLink : ''} onChange={(e) => setEditProfileTelegramLink(e.target.value)}
                                            />
                                        </div>
                                    : profileInfo.telegram_link && 
                                        <div className='profile-info-part'>
                                            <i className="fas fa-paper-plane"></i>
                                            <a href={profileInfo.telegram_link}>{profileInfo.telegram_link}</a>
                                        </div>
                            }
                        </div>
                    }
                </div>
            </div>
            <div id="bottomProfilePart">
                <FilterOptions worksSeen={worksSeen} showAnonOptions={true} showAnonWorks={showAnonWorks} setShowAnonWorks={setShowAnonWorks} showHiddenWorks={showHiddenWorks} setShowHiddenWorks={setShowHiddenWorks}  isOwnProfile={profileInfo.username} />
                { getProfileLoading ?
                    <div id="bodyBox" style={{display: 'flex', flexFlow: 'row', justifyContent: 'center', alignContent: 'center', textShadow: '0 0 15px #e7eff3'}}>
                        <Loader/>
                    </div> 
                    :
                    <div id="bodyBox">
                        { works && works.length === 0 && !listWorksLoading ? ( // this is needed if there are no works in db
                                <>
                                    { getProfileLoading ? <Loader/> : <NothingPage/>}
                                </>
                            ) : (
                                <>
                                    { works.map(arrayOfWorks => (
                                            arrayOfWorks.map(work => { // here is the logic to decide when to show what type of works
                                                if (profileUsername !== 'anonymouswriter') {
                                                    if (userInfo) { // if it's a logged in user
                                                        if (showHiddenWorks && !showAnonWorks) { // only if 'show hidden' is pressed and not 'show anon'
                                                            if ((work.hidden && hiddenWorks.includes(work.id)) || (!work.hidden && hiddenWorks.includes(work.id))) { // if the work is (technically or not) hidden
                                                                worksSeen += 1
                                                                return <ContentPart work={work} key={uuid()}/>
                                                            }
                                                        } else if (showAnonWorks && !showHiddenWorks) { // only if 'show anon' is pressed and not 'show hidden'
                                                            if ((work.published_anonymously && anonWorks.includes(work.id)) || (!work.published_anonymously && anonWorks.includes(work.id))) { // if the work is (technically or not) anonymous
                                                                worksSeen += 1
                                                                return <ContentPart work={work} key={uuid()}/>
                                                            }
                                                        } else if (showHiddenWorks && showAnonWorks) { // only if 'show hidden' and 'show anon' are pressed
                                                            if ((work.published_anonymously && work.hidden) || (anonWorks.includes(work.id) && hiddenWorks.includes(work.id))) { // if work is both hidden and published anonymously
                                                                worksSeen += 1
                                                                return <ContentPart work={work} key={uuid()}/>
                                                            }
                                                        } else if (!anonWorks.includes(work.id) && !hiddenWorks.includes(work.id)) { // else if the work is technically no longer hidden and not anon
                                                            worksSeen += 1
                                                            return <ContentPart work={work} key={uuid()}/>
                                                        } // otherwise, do not return the work
                                                    } else { // if it's a non-logged in user
                                                        if (!work.published_anonymously) {
                                                            worksSeen += 1
                                                            return <ContentPart work={work} key={uuid()}/>
                                                        }
                                                    }
                                                } else {
                                                    worksSeen += 1
                                                    return <ContentPart work={work} key={uuid()}/>
                                                }
                                            })
                                    ))}
                                    <> 
                                        {worksSeen === 0 && <NothingPage />}
                                    </>
                                </>
                            )
                        }
                    </div>
                }
            </div>
        </div>
        : // no profile info
            navigate('/404')
        }
        </>
    )
}

export default ProfileScreen