import React from "react";

import { GridContainer } from "../atoms";
import NavBar from "./NavBar";

const TopBarContainer = ({children}: {children: React.ReactNode}) => {
    return (
        <GridContainer>
        <div className="col-span-6 md:col-span-12 flex w-full border-2 bg-white/50 border-white/80 backdrop-blur-sm rounded-full p-2">
            {children}
        </div>
        </GridContainer>
    );
}

const TopBar = () => {
    return (
        <div className="absolute top w-full flex z-20 justify-center">
        <TopBarContainer>
            <NavBar />
        </TopBarContainer>
        </div>
    );
}

export default TopBar;