import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ShiftWindowContext } from "../contexts/SharedContext";
import { getProfile } from "../features/userFeatures/profileView";
import { clearUserSettings, updateUserProfileSettings } from "../features/userFeatures/userInfo";
import Message from "./Message";
import QuestionTag from "./QuestionTag";
import SliderCheckbox from "./SliderCheckbox";



function UserSettings() {

    const dispatch = useDispatch()
    let { profileUsername } = useParams()

    const { csrftoken } = useContext(ShiftWindowContext) 

    const { userInfo, userSettings, } = useSelector((state) => state.userInfo)

    const { profileInfo } = useSelector((state) => state.profileInfo)
    
    
    const [firstNameSeetings, setFirstNameSeetings] = useState(Object.keys(userSettings).length > 0 && userSettings.user_settings.first_name ? userSettings.user_settings.first_name : '')
    const [lastNameSeetings, setLastNameSeetings] = useState(Object.keys(userSettings).length > 0 && userSettings.user_settings.last_name ? userSettings.user_settings.last_name : '')
    const [emailSettings, setEmailSettings] = useState(Object.keys(userSettings).length > 0 && userSettings.user_settings.email ? userSettings.user_settings.email : '')
    const [telegramLinkSettings, setTelegramLinkSettings] = useState(Object.keys(userSettings).length > 0 && userSettings.user_settings.telegram_link ? userSettings.user_settings.telegram_link : '')
    
    const [showEmail, setShowEmail] = useState(Object.keys(userSettings).length > 0 && userSettings.user_prefs.showEmailInProfile ? userSettings.user_prefs.showEmailInProfile : false)
    const [showName, setShowName] = useState(Object.keys(userSettings).length > 0 && userSettings.user_prefs.showNameInsteadUsername ? userSettings.user_prefs.showNameInsteadUsername : false)
    const [showTelegramLink, setShowTelegramLink] = useState(Object.keys(userSettings).length > 0 && userSettings.user_prefs.showTelegramLink ? userSettings.user_prefs.showTelegramLink : false)
    
    function handleSubmit(e) {
        e.preventDefault()
        dispatch(updateUserProfileSettings({userInfo, firstNameSeetings, lastNameSeetings, emailSettings, telegramLinkSettings, showEmail, showName, showTelegramLink, csrftoken}))
    }

    function setNameToShow() {
        setShowName(!showName)
        document.getElementById('firstNameSeetings').removeAttribute('required')
        
    }

    function setEmailToShow() {
        setShowEmail(!showEmail)
        document.getElementById('emailSettings').removeAttribute('required')
        
    }

    function setTelegramLinkToShow() {
        setShowTelegramLink(!showTelegramLink)
        document.getElementById('telegramLinkSettings').removeAttribute('required')
        
    }

    useEffect(() => {
        
        
        setFirstNameSeetings(Object.keys(userSettings).length > 0 && userSettings.user_settings.first_name ? userSettings.user_settings.first_name : '')
        setLastNameSeetings(Object.keys(userSettings).length > 0 && userSettings.user_settings.last_name ? userSettings.user_settings.last_name : '')
        setEmailSettings(Object.keys(userSettings).length > 0 && userSettings.user_settings.email ? userSettings.user_settings.email : '')
        setTelegramLinkSettings(Object.keys(userSettings).length > 0 && userSettings.user_settings.telegram_link ? userSettings.user_settings.telegram_link : '')
        
        
        setShowEmail(Object.keys(userSettings).length > 0 && userSettings.user_prefs.showEmailInProfile ? userSettings.user_prefs.showEmailInProfile : false)
        setShowName(Object.keys(userSettings).length > 0 && userSettings.user_prefs.showNameInsteadUsername ? userSettings.user_prefs.showNameInsteadUsername : false)
        setShowTelegramLink(Object.keys(userSettings).length > 0 && userSettings.user_prefs.showTelegramLink ? userSettings.user_prefs.showTelegramLink : false)
    }, [userSettings])
    

    useEffect(() => {
        if (showTelegramLink && telegramLinkSettings.length < 1) {
            document.getElementById('telegramLinkSettings').setAttribute('required', '')
        }
        if (showName && !firstNameSeetings){
            document.getElementById('firstNameSeetings').setAttribute('required', '')
        }
        if (showEmail && !emailSettings) {
            document.getElementById('emailSettings').setAttribute('required', '')
        }

        return () => { 
            
            
            
            
            
            
            
            
        }

    }, [userSettings, showTelegramLink, showName, showEmail, userInfo, telegramLinkSettings, firstNameSeetings, emailSettings, ])
    


    const toggleSettingHint = () => {
        let currentFormStyle = window.getComputedStyle(document.getElementsByClassName('settingsHint')[0]).getPropertyValue('max-height')
        if (currentFormStyle !== `0px`) {
            document.getElementsByClassName('settingsHint')[0].style.maxHeight = '0px'
        } else {
            document.getElementsByClassName('settingsHint')[0].style.maxHeight = `${document.getElementsByClassName('insideSettingsHint')[0].offsetHeight}px`
        }
    }

    const [rightSettingsContainer, setRightSettingsContainer] = useState('Profile')

    function toggleHighlight(e) {
        
        setRightSettingsContainer(e.target.innerHTML)

        let highlightedElem = document.querySelector('.added-border-bottom')
        if (highlightedElem) {
            highlightedElem.classList.remove('added-border-bottom')
        }

        e.target.classList.add('added-border-bottom')        
    }

    return (
        <div className="settingsContainer">
            <div className="settingsLeft">
                <span onClick={toggleHighlight} className="added-border-bottom">Profile</span>
                {/* <span onClick={toggleHighlight}>Preferences</span> */}
            </div>
                <div className="settingsRight">
                    {rightSettingsContainer === 'Profile' ?
                        (<div id="profileSettings">
                            <form onSubmit={(e) => handleSubmit(e)}>

                            <div className="profile-settings-input-cont">
                                    <label htmlFor="firstNameSeetings">
                                        First name:
                                    </label>
                                    <input
                                    type="text"
                                    id="firstNameSeetings"
                                    name="firstNameSeetings"
                                    maxLength="100"
                                    value={firstNameSeetings} onChange={(e) => setFirstNameSeetings(e.target.value)}>
                                        
                                    </input>
                                </div>

                                <div className="profile-settings-input-cont">
                                    <label htmlFor="lastNameSeetings">
                                        Last name:
                                    </label>
                                    <input
                                    type="text"
                                    id="lastNameSeetings"
                                    name="lastNameSeetings"
                                    maxLength="100"
                                    value={lastNameSeetings} onChange={(e) => setLastNameSeetings(e.target.value)}>
                                    </input>
                                </div>

                                <div className="profile-settings-input-cont">
                                    <label htmlFor="emailSettings">
                                        Email:
                                    </label>
                                    <input
                                    type="email"
                                    id="emailSettings"
                                    name="emailSettings"
                                    minLength="6"
                                    maxLength="100"
                                    value={emailSettings ? emailSettings : ''} onChange={(e) => setEmailSettings(e.target.value)}>
                                    </input>
                                </div>

                                <div className="profile-settings-input-cont">
                                    <label htmlFor="telegramLinkSettings">
                                        Telegram link:
                                    </label>
                                    <input
                                    type="text"
                                    id="telegramLinkSettings"
                                    name="telegramLinkSettings"
                                    minLength="18"
                                    maxLength="100"
                                    value={telegramLinkSettings ? telegramLinkSettings : ''} onChange={(e) => setTelegramLinkSettings(e.target.value)}
                                    
                                    >
                                    </input>
                                </div>

                                <div className="profile-settings-input-cont-sec">
                                    <label htmlFor="showEmailSettings" className='slider-checkbox-label'>
                                        Show email in profile?:
                                    </label>
                                    <SliderCheckbox
                                        checkboxId="showEmailSettings"
                                        checkedState={showEmail} changeStateFunc={setEmailToShow}>
                                    </SliderCheckbox>
                                </div>

                                <div className="profile-settings-input-cont-sec">
                                    <label htmlFor="preferredNameSettings" className='slider-checkbox-label'>
                                        Show name instead of username?:
                                    </label>
                                    <div onClick={toggleSettingHint} style={{cursor: 'pointer'}}>
                                        <QuestionTag/>
                                    </div>
                                    <SliderCheckbox
                                        checkboxId="preferredNameSettings"
                                        checkedState={showName} changeStateFunc={setNameToShow}>
                                    </SliderCheckbox>
                                    <div className="settingsHint">
                                        <div className="insideSettingsHint">
                                            <p>This will show your first and last name in your profile and will apply to all your works as well.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-settings-input-cont-sec">
                                    <label htmlFor="showTelegramSettings" className='slider-checkbox-label'>
                                        Show Telegram link in profile?:
                                    </label>
                                    <SliderCheckbox
                                        checkboxId="showTelegramSettings"
                                        checkedState={showTelegramLink} changeStateFunc={setTelegramLinkToShow}>
                                    </SliderCheckbox>
                                </div>
                                <div className="settings-save-btn-container">
                                    <input type="submit" value="SAVE" id="profile-settings-submit-btn"></input>
                                </div>
                            </form>
                        </div>
                        ) : rightSettingsContainer === 'Preferences' && (
                            <div id="preferencesSettings">
                                {/* This is where grid layout and all those other settings would be */}
                            </div>)
                        }
                </div>
        </div>
    )
}

export default UserSettings