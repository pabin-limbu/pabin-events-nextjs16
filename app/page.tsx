import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import {EventDocument} from "@/database";
import {cacheLife} from "next/cache";


const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const Page = async () => {
    'use cache'
    cacheLife('hours')
    console.log("a")

    const response = await fetch(`${BASE_URL}/api/events`);

    const {events} = await response.json();


    return (
        <section>
            <h1 className={'text-center'}>Events</h1>
            <p className={'text-center mt-5'}>meetup, socials and conferences</p>
            <ExploreBtn/>

            <div className="mt-20 space-y-7">
                <h3>Featured</h3>
                <ul className={"events"}>
                    {
                        events && events.length > 0 && events.map((event: EventDocument, index: number) => {
                            return (
                                <li key={event.title} className="list-none">
                                    {/*<EventCard image={event.image} title={event.title} />*/}
                                    <EventCard {...event} />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </section>
    )
}
export default Page
