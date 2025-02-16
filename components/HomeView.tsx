"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useRef, MouseEventHandler, useEffect } from "react"
import Table from "./DataTable";
import { Badge } from "./ui/badge";
import ChatComponent from "./ChatComponent";
import { ArrowLeft, ChevronLeft, Grid2X2, Minimize, Minimize2 } from "lucide-react";

export default function HomeView() {
  const resizableRef = useRef(null);
  const [width, setWidth] = useState<number>(1200);  // initial width of the table
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<DataRow[]>([]);
  const [conversationDetails, setConversationDetails] = useState<ConversationPublic>(() => {
    const storedDetails = typeof window !== "undefined" ? localStorage.getItem('conversationDetails') : null;
    return storedDetails ? JSON.parse(storedDetails) : {
      name: 'Naina',
      id: 123,
      messages:[
        {
            content: 'What this document is about?',
            role: 'user',
            created_at: new Date(1739699321934).toLocaleDateString(),
            updated_at: new Date(1739699321934).toLocaleDateString(),
            conversation_id: 123,
            message_context:  {tabular_data : []},
            id: 144,
        },
        {
            content: 'This document serves as a comprehensive introduction to my personal webpage, designed to provide an overview of who I am, showcase my professional and creative work, and offer an easy way to get in touch. It includes sections about my background, skills, and experiences, a portfolio.',
            role: 'ai',
            created_at: new Date(1739699321934).toLocaleDateString(),
            updated_at: new Date(1739699321934).toLocaleDateString(),
            conversation_id: 123,
            message_context:  {tabular_data : []},
            id: 144, 
        }
      ]      
    };
  });

  useEffect(() => {
    if(typeof window !== "undefined") localStorage.setItem('conversationDetails', JSON.stringify(conversationDetails));
  }, [conversationDetails]);

  const startResize = (e: MouseEventHandler) => {
    const startX = e.clientX;
    const startWidth = resizableRef.current.offsetWidth;

    console.log('out', startX, startWidth);

    const onMouseMove = (moveEvent: MouseEventHandler) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      setWidth(Math.max(300, Math.min(newWidth, window.innerWidth))); 
    };

    const onMouseUp = () => {
      // Clean up mousemove and mouseup events
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
      // Add mousemove and mouseup event listeners
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="font-bold">A79</span>
        </div>
        <div>
          <span className="text-gray-400">Home</span>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-gray-400">Chat Name</span>
        </div>
        <Avatar className="w-8 h-8">
          <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxZMQd0PBAh6kjl02fK2RAVbIqYncA2U9bqw&s" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </header>

      <div className="flex flex-1">
        <div className="pt-4 pl-4 relative">
          <div ref={resizableRef} className="ag-theme-alpine-dark" style={{ height: '95%', width: `${width}px` }}>
            <div className="flex justify-content w-full pr-4">
              <div className="mb-4 flex flex-1 flex-wrap">
                {appliedFilters.length ? appliedFilters.map((chip, index) => (
                  <Badge variant="secondary" className="mr-2">{chip}</Badge>
                )) : <Badge>No Filters Applied</Badge>}
              </div>
              <div className="flex"><ArrowLeft className="h-4 w-4"/><Grid2X2 className="h-4 w-4"/></div>
            </div>
            <Table setAppliedFilters={setAppliedFilters} setSelectedRows={setSelectedRows}/>
          </div>
          <div onMouseDown={startResize} className="absolute right-0 top-0 w-[10px] cursor-ew-resize bg-red h-full">
            {/* <Maximize2 className="w-6 h-6 top-[50%] absolute"/> */}
          </div>
        </div>

        <ChatComponent conversationDetails={conversationDetails} setConversationDetails={setConversationDetails}  selectedRows={selectedRows} setSelectedRows={setSelectedRows}/>
      </div>
    </div>
  );
}
