import styled from 'styled-components';
import React from 'react';

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

const ActiveBarButton = styled(BarButton)`
    background-color:white;
    color:black;
    border-radius:1000px;
`;


//props
    //curentPageIndex
    //totalNumPages
    //pagesPerGroup
    //setPage()
class PageBar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const pageGroup = Math.floor(this.props.currentPageIndex/this.props.pagesPerGroup);
        const pageStart = pageGroup * this.props.pagesPerGroup;
        const pageEnd = Math.min(this.props.totalNumPages, pageStart + this.props.pagesPerGroup);
        var pages = [];
        for(var i=pageStart; i<=pageEnd; i++) {
            pages.push(i);
        }
        //console.log(this.props);
        //console.log([pageStart,pageEnd]);
        //console.log(pages);
        return(
            <BarContainer>
                <BarButton onClick={() => {this.props.setPage(this.props.currentPageIndex-1)}}><i className="fa-solid fa-chevron-left"></i></BarButton>
                {
                    pages.map((pageIndex,arrIndex) => {
                        return(
                            pageIndex == this.props.currentPageIndex ? 
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