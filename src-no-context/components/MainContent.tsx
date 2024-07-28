import React from "react";

const MainContent = ({ children }: { children: React.ReactNode }) => {
	return <main className="main">{children}</main>;
};

export default MainContent;
