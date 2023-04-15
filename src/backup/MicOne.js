import { useRef, useState, useContext } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import microPhoneIcon from "./microphone.svg";
import React from 'react';
import { Context } from '../App';

function MicOne() {
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [isListening, setIsListening] = useState(false);
    const microphoneRef = useRef(null);
    const { notes, setNotes } = useContext(Context);

    // if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    //     return (
    //         <div className="mircophone-container">
    //             Browser is not Support Speech Recognition.
    //         </div>
    //     );
    // }

    const handleListing = () => {
        setIsListening(true);
        microphoneRef.current.classList.add("listening");
        SpeechRecognition.startListening({
            continuous: true,
        });
    };

    const stopHandle = () => {
        setIsListening(false);
        microphoneRef.current.classList.remove("listening");
        SpeechRecognition.stopListening();
    };

    const handleReset = () => {
        stopHandle();
        resetTranscript();
    };

    const add = (e) => {
        e.preventDefault()

        console.log(notes[notes.length - 1].id);

        fetch(`/notes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: `Note ${notes[notes.length - 1].id + 1}`, text: transcript })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                notes.push(data[0]);
                setNotes([...notes])
                resetTranscript();

            })
            .catch(err => console.log(err));
    }

    return (
        <div>
            <div className="microphone-wrapper">
                {isListening ?
                    <button className="microphone-stop btn" onClick={stopHandle}>
                        Stop
                    </button>
                    :
                    <div className="microphone-icon-container" ref={microphoneRef} onClick={handleListing}>
                        <img src={microPhoneIcon} className="microphone-icon" />
                    </div>
                }
            </div>
            {transcript && (
                <div className="microphone-result-container">
                    <button className="microphone-reset btn" onClick={handleReset}>
                        Reset
                    </button>
                    <button className="save btn" onClick={add}>
                        save
                    </button>
                </div>
            )}
        </div>

        // <div className="microphone-wrapper">
        //     <div
        //         className="microphone-icon-container"
        //         ref={microphoneRef}
        //         onClick={handleListing}
        //     >
        //         <img src={microPhoneIcon} className="microphone-icon" />
        //     </div>

        //     {isListening && (
        //         <button className="microphone-stop btn" onClick={stopHandle}>
        //             Stop
        //         </button>
        //     )}
        //     {transcript && (
        //         <div className="microphone-result-container">
        //             <button className="microphone-reset btn" onClick={handleReset}>
        //                 Reset
        //             </button>
        //             <button className="save btn" onClick={add}>
        //                 save
        //             </button>
        //         </div>
        //     )}
        // </div>
    );
}
export default MicOne;


