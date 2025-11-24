'use server';

import {connectToDatabase} from "@/lib/mongodb";
import {Event, EventDocument, EventType} from "@/database/event.model";
import mongoose from "mongoose";


export const getSimilarEventsBySlug = async (slug: string): Promise<EventType[]> => {
    try {
        await connectToDatabase();
        const event: EventDocument | null = await Event.findOne({slug});
        return await Event.find({
            _id: {$ne: event?._id},
            tags: {$in: event?.tags}
        }).lean();


    } catch (error) {
        return []
    }

}

