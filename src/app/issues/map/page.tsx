"use client";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/map"), {
  ssr: false,
});

const IssuesMapPage = () => {
	return <MapComponent 
        center={[48.1486, 17.1077]} 
        zoom={20} 
        style={{ height: 500 }} 
        initialMarkers={[]} 
        canCreateMarker={false} 
    />;
};

export default IssuesMapPage;
