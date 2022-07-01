import styled from 'styled-components';
import React from 'react';

//bottom banner background
const BarContainer = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    padding:20px;
    width:calc(100% - 40px);
    height:40px;
    background-color:#03050A;
    border-top:1px solid black;
`;

//Styling for next/previous buttons, page numbers
const BarButton = styled.button`
    padding:10px;
    margin: 0 5px 0 5px;
    font-size:1em;
    border:0;
    background-color:rgba(0,0,0,0);
    color:white;

    :hover {
        cursor:pointer;
    }
`;

//styling for the active page number (white circle, black text)
const ActiveBarButton = styled(BarButton)`
    background-color:white;
    color:black;
    border-radius:1000px;
`;

/*
    Bottom banner for pages of user images

    Props:
        currentPageIndex: (int) the index of the current page the user is on
        totalNumPages: (int) the total number of pages the user can browse
        pagesPerGroup: (int) how many page numbers are displayed in the bottom bar at a time. 
            -EG: 10 total pages, 5 pages per group = 1-5, 6-10
        setPage: (function) callback function for when user navigates to a new page

*/
class PageBar extends React.Component {
    render() {
        //calculate what group the page belongs to 
            //EG: page 10, with 5 pages per group would be group 2
        const pageGroup = Math.floor(this.props.currentPageIndex/this.props.pagesPerGroup);
        //get the left and right most pages in the group (EG: page 6 and page 10)
        const pageStart = pageGroup * this.props.pagesPerGroup;
        const pageEnd = Math.min(this.props.totalNumPages, pageStart + this.props.pagesPerGroup);
        //array of page numbers to be mapped to buttons
        var pages = [];
        for(var i=pageStart; i<=pageEnd; i++) {
            pages.push(i);
        }
        return(
            <BarContainer>
                <BarButton onClick={() => {this.props.setPage(this.props.currentPageIndex-1)}}><i className="fa-solid fa-chevron-left"></i></BarButton>
                {
                    pages.map((pageIndex,arrIndex) => {
                        return(
                            pageIndex === this.props.currentPageIndex ? 
                                <ActiveBarButton onClick={() => {this.props.setPage(pageIndex)}}>{pageIndex+1}</ActiveBarButton> :
                                <BarButton onClick={() => {this.props.setPage(pageIndex)}}>{pageIndex+1}</BarButton>
                        );
                    })
                }
                <BarButton onClick={() => {this.props.setPage(this.props.currentPageIndex+1)}}><i className="fa-solid fa-chevron-right"></i></BarButton>
            </BarContainer>
        );
    }
}

export default PageBar;