import React, {Suspense} from 'react'
import {notFound} from "next/navigation";
import EventDetails from "@/components/EventDetails";


const EventDetailsPage = async ({params}: {
    params: Promise<{ slug: string }>
}) => {
    const slug = params.then((p) => p.slug);
    console.log(typeof slug);
    try {
        return (
            <main>
                <Suspense fallback={<div>Loading...</div>}>
                    <EventDetails params={slug}/>
                </Suspense>

            </main>
        )

    } catch (error) {
        return notFound();
    }


}
export default EventDetailsPage
