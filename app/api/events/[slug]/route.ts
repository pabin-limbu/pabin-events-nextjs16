import {NextRequest, NextResponse} from 'next/server';
import type {NextResponseInit} from 'next/server';

import {connectToDatabase} from '@/lib/mongodb';
import {Event} from '@/database';
import type {EventDocument} from '@/database';

// Shape of the successful response payload returned to clients.
interface EventResponse {
    id: string;
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

// Helper for building JSON error responses with a consistent shape.
const jsonError = (message: string, status: number): NextResponse<unknown> => {
    const init: NextResponseInit = {status}; // keep headers extensible
    return NextResponse.json({error: message}, init);
};

// Type for route params in the App Router.
interface RouteContext {
    params: Promise<{ slug?: string }>;

}

export async function GET(_request: NextRequest, context: RouteContext): Promise<NextResponse> {
    const {slug: rawSlug} = await context.params;

    // Validate that slug is provided and not just whitespace.
    if (typeof rawSlug !== 'string' || rawSlug.trim().length === 0) {
        return jsonError('Slug parameter is required', 400);
    }

    const slug = rawSlug.trim();

    try {
        // Ensure a single, cached database connection is available.
        await connectToDatabase();

        // Look up the event document by its unique slug.
        const event: EventDocument | null = await Event.findOne({slug}).exec();

        if (!event) {
            return jsonError('Event not found', 404);
        }

        // Map the Mongoose document to a plain JSON-friendly DTO.
        const payload: EventResponse = {
            id: event._id.toString(),
            title: event.title,
            slug: event.slug,
            description: event.description,
            overview: event.overview,
            image: event.image,
            venue: event.venue,
            location: event.location,
            date: event.date,
            time: event.time,
            mode: event.mode,
            audience: event.audience,
            agenda: event.agenda,
            organizer: event.organizer,
            tags: event.tags,
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString(),
        };

        return NextResponse.json({event: payload}, {status: 200});
    } catch (error: unknown) {
        // Log server-side for observability; avoid leaking internals to clients.
        // eslint-disable-next-line no-console
        console.error('Error fetching event by slug:', error);

        return jsonError('An unexpected error occurred while fetching the event', 500);
    }
}
