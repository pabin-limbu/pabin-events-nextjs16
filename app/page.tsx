import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import events from "@/lib/constants";

const Page = () => {
    return (
        <section>
            <h1 className={'text-center'}>Events</h1>
            <p className={'text-center mt-5'}>meetup, socials and conferences</p>
            <ExploreBtn/>

            <div className="mt-20 space-y-7">
                <h3>Featured</h3>
                <ul className={"events"}>
                    {
                        events.map((event: {
                            image: string,
                            title: string,
                            slug: string,
                            location: string,
                            date: string,
                            time: string
                        }, index: number) => {
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
