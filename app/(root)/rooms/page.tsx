import React from "react";
import RoomsList from "./rooms-list";

const page = () => {


  return (
    <div className="min-h-screen pt-20 px-6 pb-4">
      <div className="grid grid-rows-[auto_1fr] gap-4 max-w-2xl mx-auto grid-cols-1">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground/90">Public Rooms</h1>
          <p className="mt-2 text-muted-foreground/80 text-sm">
            List of available public chat rooms will be displayed here.
          </p>
        </div>
        <RoomsList />
      </div>
    </div>
  );
};

export default page;
