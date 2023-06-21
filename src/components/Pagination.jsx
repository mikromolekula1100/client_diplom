import React from "react";

const Pagination = (eventsPerPage, totalEvents) => {
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(totalEvents / eventsPerPage); i++){
        pageNumbers.push(i);
    }

    return(
        <></>
    );
}

export default Pagination;