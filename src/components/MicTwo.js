import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import React from 'react';
import { useRef, useState, useContext } from "react";
import { Context } from '../App';

import { AiTwotoneAudio, AiOutlineCheck } from "react-icons/ai";

const MicTwo = () => {
    const { notes, setNotes, isNew, setIsNew } = useContext(Context);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const add = (e) => {
        e.preventDefault()
        SpeechRecognition.stopListening()
        console.log(notes[notes.length - 1].id);

        fetch(`/notes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: `Voice Note`, text: transcript, color: 'white', index: notes.length })
        })
            .then(res => res.json())
            .then(data => {
                notes.unshift(data[0])
                setNotes([...notes])
                resetTranscript();
            })
            .catch(err => console.log(err));
    }

    return (
        <div>
            {listening ?
                <a className=" white bg-black" onClick={add}><AiOutlineCheck /></a>
                :
                <a className=" white bg-black" onClick={SpeechRecognition.startListening}><AiTwotoneAudio /></a>
            }
        </div>
    );
};
export default MicTwo;