import { useEffect } from "react";
import { useState } from "react";

export const useTrackOrder = (propertyId: string, clientId: string) => {
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        // Establish SSE connection
        if (propertyId && clientId) {
            console.log("propertyId", propertyId);
            console.log("clientId", clientId);
            const eventSource = new EventSource(`https://test.fandora.app/api/v2/events/?project_id=${propertyId}&client_id=${clientId}`);
            // Handle incoming messages
            console.log("eventSource", eventSource);
            eventSource.onmessage = (event) => {
                const newEvent = JSON.parse(event.data); // Parse JSON data from server
                setEvents(prev => [...prev, newEvent]);
                
            };
            eventSource.onerror = (error) => {
                console.error("SSE connection error:", error);
                eventSource.close(); // Close connection on error
            };
            return () => {
                eventSource.close();
            };
        }
    }, [propertyId, clientId]);

    console.log("events", events);

    return { events };
};