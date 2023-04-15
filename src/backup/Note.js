import { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import React from 'react';
import { Context } from '../App';
// import React from "react";
// import "./styles.css";
import { EmailShareButton, WhatsappShareButton } from "react-share";
import { EmailIcon, WhatsappIcon } from "react-share";
import { AiFillEdit, AiFillDelete, AiFillHome, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

const Note = () => {
    const { notes, setNotes, edit, setEdit } = useContext(Context);
    const [note, setNote] = useState([]);
    const params = useParams();
    const [title, setTitle] = useState([]);
    const [text, setText] = useState([]);
    const [color, setColor] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`/notes/n/${params.id}`)
            .then(res => res.json())
            .then(data => {
                // const arr = data.sort()
                setNote(data)
                setTitle(data[0].title);
                setText(data[0].text)
                setColor(data[0].color)
            })
            .catch(err => console.log(err));
    }, []);

    const handleChange = (e) => {
        setColor(e.target.value)
    }

    const update = (e) => {
        setEdit(false)
        e.preventDefault()
        fetch(`/notes/${params.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, text, color })
        })
            .then(res => res.json())
            .then(data => {
                setNote(data);

            })
            .catch(err => console.log(err));
    }

    const noUpdate = (e) => {
        e.preventDefault()
        setTitle(note[0].title)
        setText(note[0].text)
        setColor(note[0].color)
        setEdit(false)
    }

    const del = (e) => {
        e.preventDefault()
        fetch(`/notes/${params.id}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => {
                navigate('/')
            })
            .catch(err => console.log(err));
        // setNote(notes)
    }

    const editMode = () => {
        setEdit(true)
    }

    return (
        <div>

            {
                note.map(item => {
                    return (
                        edit ?
                            <div key={item.id} id='editable' style={{ backgroundColor: color }}>
                                <form onSubmit={update}>
                                    <input type='text' onChange={(e) => setTitle(e.target.value)} value={title} />
                                    <textarea type='text' onChange={(e) => setText(e.target.value)} value={text} />
                                    <label className="white">
                                        <input type="radio" name="color" value="white" onChange={handleChange} />
                                        <div className="button"><span></span></div>
                                    </label>
                                    <label className="lightcoral">
                                        <input type="radio" name="color" value="lightcoral" onChange={handleChange} />
                                        <div className="button"><span></span></div>
                                    </label>
                                    <label className="lightblue">
                                        <input type="radio" name="color" value="lightblue" onChange={handleChange} />
                                        <div className="button"><span></span></div>
                                    </label>
                                    <label className="yellow">
                                        <input type="radio" name="color" value="yellow" onChange={handleChange} />
                                        <div className="button"><span></span></div>
                                    </label>

                                    <button className="submit f6 grow no-underline br-pill ph3 pv2 mb2 dib black bg-light-gray" type='submit' ><AiOutlineCheck /></button>
                                    <button className="submit f6 grow no-underline br-pill ph3 pv2 mb2 dib black bg-light-gray" onClick={noUpdate} ><AiOutlineClose /></button>

                                </form>
                            </div>
                            :
                            <div key={item.id} style={{ backgroundColor: item.color }}>
                                <h2>{item.title}</h2>
                                <p>{item.text}</p>
                                <Link to={`/`}> <a className="f6 grow no-underline br-pill ph3 pv2 mb2 dib black bg-light-gray"><AiFillHome /></a></Link>
                                <a className="f6 grow no-underline br-pill ph3 pv2 mb2 dib black bg-light-gray" onClick={editMode}><AiFillEdit /></a>
                                <a className="f6 grow no-underline br-pill ph3 pv2 mb2 dib black bg-light-gray" onClick={del}><AiFillDelete /></a>
                                <div className="share">
                                    <EmailShareButton
                                        url={""}
                                        subject={item.title}
                                        body={item.text + "\n\n(sent from 'notesbook')"}
                                        className="mail"
                                    >
                                        <EmailIcon size={32} round />
                                    </EmailShareButton>
                                    <br />
                                    <WhatsappShareButton
                                        title={`*${item.title}*\n${item.text}`}
                                        body={item.text + "\n\n(sent from 'notesbook')"}

                                        url={"\n\n(sent from 'notesbook')"}
                                        className="wa"

                                    >
                                        <WhatsappIcon size={32} round />
                                    </WhatsappShareButton>
                                </div>
                            </div>
                    )

                })
            }
        </div>

    )
}

export default Note

