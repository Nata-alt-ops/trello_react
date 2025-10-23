import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './header.scss';
export const Header = () => {
    return(
        <div className="header d-flex justify-content-between align-items-center">
            <div className="board_project d-flex justify-content-start align-items-center">
                <div className="board d-flex justify-content-start align-items-center">
                    <div className="restangle"></div>
                    <p>Board</p>
                </div>
                <div className="line"></div>
                <h1>Project Management</h1>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffffffff" viewBox="0 0 256 256"><path d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96ZM172.53,141.7a12,12,0,0,0-3.84,11.86L181.58,208l-47.29-29.08a12,12,0,0,0-12.58,0L74.42,208l12.89-54.4a12,12,0,0,0-3.84-11.86L41.2,105.24l55.4-4.47a12,12,0,0,0,10.13-7.38L128,41.89l21.27,51.5a12,12,0,0,0,10.13,7.38l55.4,4.47Z">
                    </path></svg>
            </div>
            <button className="d-flex justify-content-center align-items-center flex-row">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffffffff" viewBox="0 0 256 256"><path d="M125.18,156.94a64,64,0,1,0-82.36,0,100.23,100.23,0,0,0-39.49,32,12,12,0,0,0,19.35,14.2,76,76,0,0,1,122.64,0,12,12,0,0,0,19.36-14.2A100.33,100.33,0,0,0,125.18,156.94ZM44,108a40,40,0,1,1,40,40A40,40,0,0,1,44,108Zm206.1,97.67a12,12,0,0,1-16.78-2.57A76.31,76.31,0,0,0,172,172a12,12,0,0,1,0-24,40,40,0,1,0-10.3-78.67,12,12,0,1,1-6.16-23.19,64,64,0,0,1,57.64,110.8,100.23,100.23,0,0,1,39.49,32A12,12,0,0,1,250.1,205.67Z">
                    </path></svg>
                <p>Workspace visible</p>
            </button>
        </div>
    )

}