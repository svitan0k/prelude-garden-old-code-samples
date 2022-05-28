import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react'
import ContentPart from '../components/ContentPart'
import { useSelector } from "react-redux";
import { v4 as uuid } from 'uuid';
import Loader from '../components/Loader';
import FilterOptions from '../components/FilterOptions';
import WriteForm from '../components/WriteForm';
import LoginForm from '../components/LoginForm';
import NothingPage from '../components/NothingPage';
import { HomeScreenContext } from '../contexts/HomeScreenContext';


function HomeScreen() {


    const { openForm, toggleForm } = useContext(HomeScreenContext)

    const { works, listWorksLoading, } = useSelector((state) => state.worksList)
    const { userInfo } = useSelector((state) => state.userInfo)
    
    const timesRendered = useRef(0)

    useEffect(() => {
        if (timesRendered.current > 0) {
            openForm()
        }
        timesRendered.current += 1
    }, [userInfo])


    useLayoutEffect(() => {
        resizeAllGridItems()
    })


    function resizeItem(item) {
        let grid = document.getElementById('bodyBox')
        let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'))
        let rowHeight = 20

        /*
        * Spanning for any brick = S
        * Grid's row-gap = G
        * Size of grid's implicitly create row-track = R
        * Height of item content = H
        * Net height of the item = H1 = H + G
        * Net height of the implicit row-track = T = G + R
        * S = H1 / T
        */  


        var rowSpan = Math.ceil(Math.ceil(item.getBoundingClientRect().height+rowGap)/(rowHeight+rowGap))
        
        /* Set the spanning as calculated above (S) */
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

    function addClassAndResize() {
        let allItems = document.getElementsByClassName('inside-post')

        for (let i = 0; i < allItems.length; i++) {
            resizeItem(allItems[i])
        }
    }
    
    function adjustWriteFormOnResize() {
        if (window.getComputedStyle(document.getElementById('top-div')).getPropertyValue('max-height') !== '0px') {
            openForm()
        }
    }

    useEffect(() => {
        window.addEventListener("resize", addClassAndResize)
        window.addEventListener("resize", adjustWriteFormOnResize)

        return () => {
            window.removeEventListener("resize", addClassAndResize)
            window.removeEventListener("resize", adjustWriteFormOnResize)
        }
    }, [works])


    if (works && works.length !== 0) {
        return (
            <>
            <div className='main-container'>
                <h1 onClick={() => toggleForm()} id="write-heading-container">
                    <div id="write-heading">Write</div>
                </h1>
                <div id="top-div">
                    { 
                    userInfo ? 
                        <div onFocus={openForm}>
                            <WriteForm />
                        </div> 
                    : 
                        <LoginForm/>
                    }
                </div>
                        <FilterOptions work={works} showAnonOptions={false}/>
                        <div id="bodyBox">
                            {works.map(arrayOfWorks => (
                                arrayOfWorks.map((work) => (
                                    <ContentPart work={work} key={uuid()}/>
                                )))
                            )}
                        </div>
                        {<div style={{ width: 'auto', zIndex: 30,}}>{listWorksLoading && <Loader/>}</div>}
                </div>
            </>
        )
    } else if (works && works.length === 0 && !listWorksLoading) {
        return (
            <>
                <div className='main-container'>
                    <h1 onClick={() => toggleForm()} id="write-heading-container">
                        <div id="write-heading">Write</div>
                    </h1>
                    <div id="top-div">
                        { 
                        userInfo ? 
                            <div onFocus={openForm}>
                                <WriteForm />
                            </div> 
                        : <LoginForm/>
                        }
                    </div>
                <FilterOptions work={works} showAnonOptions={false}/>
                <div id="bodyBox" style={{display: 'flex', flexFlow: 'row', justifyContent: 'center', alignContent: 'center', textShadow: '0 0 15px #e7eff3'}}>
                    <NothingPage/>
                </div>
            </div>
            </>
        )
    } else {
        return (
        <>
        <div className='main-container'>
                <h1 onClick={() => toggleForm()} id="write-heading-container" style={{fontSize: '1.1em'}}>
                    <Loader />
                </h1>
                <div id="top-div">
                </div>
            <FilterOptions work={works} showAnonOptions={false}/> 
            <div id="bodyBox" style={{display: 'flex', flexFlow: 'row', justifyContent: 'center', alignContent: 'center', textShadow: '0 0 15px #e7eff3'}}>
                <Loader/>
            </div>
        </div>
        </>
        )
    }
}

export default HomeScreen