'use client'

import React, {useState} from 'react'
import {createBooking} from "@/lib/actions/booking.action";
import posthog from "posthog-js";

const BookEvent = ({eventId, slug}: { eventId: string, slug: string }) => {

    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const {success, error} = await createBooking({eventId, slug, email});

        if (success) {
            setSubmitted(true);
            posthog.capture('event booked', {eventId, slug, email});
        } else {
            console.error('booking creation failed')
            posthog.captureException('booking creation failed')
        }


        // try {
        //     const response = await fetch('/api/book-event', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({email}),
        //     });
        // } catch (error) {
        //     console.log(error)
        //
        // }
    }


    return (
        <div id={"book-event"}>
            {submitted ? (<p className={"text-sm"}>Thanks for signing up.</p>) : (<form onSubmit={handleSubmit}>
                    <div>

                        <label htmlFor={"email"}>Email Address</label>
                        <input type={"email"} value={email} onChange={(e) => {
                            setEmail(e.target.value);
                        }} id={"email"} placeholder={"Input your Email Address"}/>

                    </div>

                    <button type={"submit"} className={"button-submit"}>Submit</button>
                </form>

            )}

        </div>
    )
}
export default BookEvent
