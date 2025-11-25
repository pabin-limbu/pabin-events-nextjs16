'use client'

import React, {useState} from 'react'

const BookEvent = () => {

    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setTimeout(() => {
            setSubmitted(true);
        }, 1000)

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
