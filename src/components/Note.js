import { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import React from 'react';
import { Context } from '../App';
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
                            <div>
                                <div id="up" >
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
                                    <button className="submit f6 grow no-underline br-pill ph3 pv2 mb2 dib black bg-light-gray" onClick={update} ><AiOutlineCheck /></button>
                                    <button className="submit f6 grow no-underline br-pill ph3 pv2 mb2 dib black bg-light-gray" onClick={noUpdate} ><AiOutlineClose /></button>
                                </div>
                                <div id="board">
                                    <div className='oneCard card tc br3 pa3 ma2 dib bw2 shadow-5' key={item.id} id='editable' style={{ backgroundColor: color }}>
                                        <h2>                                        <input className="tc cardTitle" type='text' onChange={(e) => setTitle(e.target.value)} value={title} /></h2>
                                        <p><textarea className="tc cardText" type='text' onChange={(e) => setText(e.target.value)} value={text} /></p>
                                    </div>
                                </div>
                            </div>
                            :
                            <div>
                                <div id="up" >
                                    <Link to={`/`}> <a className="f6 grow no-underline br-pill ph3 pv2 mb2 dib black bg-light-gray"><AiFillHome /></a></Link>
                                    <a className="f6 grow no-underline br-pill ph3 pv2 mb2 dib black bg-light-gray" onClick={editMode}><AiFillEdit /></a>
                                    <a className="f6 grow no-underline br-pill ph3 pv2 mb2 dib black bg-light-gray" onClick={del}><AiFillDelete /></a>
                                    <span className="share">
                                        <a className="f6 grow no-underline br-pill ph3 pv2 mb2 dib "><EmailShareButton
                                            // className='share'
                                            url={""}
                                            subject={item.title}
                                            body={item.text + "\n\n(sent from 'notesbook')"}
                                        >
                                            <EmailIcon size={32} round />
                                        </EmailShareButton></a>
                                        <a className=" f6 grow no-underline br-pill ph3 pv2 mb2 dib "><WhatsappShareButton
                                            title={`*${item.title}*\n${item.text}`}
                                            body={item.text + "\n\n(sent from 'notesbook')"}
                                            url={"\n\n(sent from 'notesbook')"}
                                        >
                                            <WhatsappIcon size={32} round />
                                        </WhatsappShareButton></a>
                                    </span>
                                </div>
                                <div id="board">
                                    <div key={item.id} style={{ backgroundColor: item.color }}
                                        className='oneCard card tc br3 pa3 ma2 dib bw2 shadow-5'>
                                        <h2>{item.title}</h2>
                                        <p>{item.text}</p>
                                    </div>
                                </div>

                            </div >
                    )

                })
            }
        </div >
    )
}

export default Note

