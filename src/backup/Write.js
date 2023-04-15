import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import MicOne from '../components/MicOne';

const Write = () => {

    const [notes, setNotes] = useState([]);
    const [searchText, setSearchText] = useState([]);
    const [title, setTitle] = useState([]);
    const [text, setText] = useState([]);

    useEffect(() => {
        fetch('/notes/all')
            .then(res => res.json())
            .then(data => {
                console.log(data);
                // const arr = data.sort()
                setNotes(data)
            })
            .catch(err => console.log(err));
    }, []);

    const search = () => {
        fetch(`/notes/search?q=${searchText}`)
            .then(res => res.json())
            .then(data => {
                // const arr = data.sort()
                setNotes(data)
            })
            .catch(err => console.log(err));
    };

    const add = (e) => {
        e.preventDefault()
        fetch(`/notes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, text })
        })
            .then(res => res.json())
            .then(data => setNotes(data))
            .catch(err => console.log(err));
    }

    return (
        <div>
            <h1>notebook</h1>
            <MicOne />
            <div>
                <input type='text' onChange={(e) => setSearchText(e.target.value)} />
                <button onClick={search}>Search</button>
            </div>
            <div>
                <h2>Add</h2>
                <form onSubmit={add}>
                    title:<input type='text' onChange={(e) => setTitle(e.target.value)} /><br />
                    text:<input type='text' onChange={(e) => setText(e.target.value)} />
                    <input type='submit' value='add' />
                </form>
            </div>
            <div>
                <div>
                    <h2>Update</h2>
                    <form onSubmit={update}>
                        title:<input type='text' onChange={(e) => setTitle(e.target.value)} value={title} /><br />
                        text:<input type='text' onChange={(e) => setText(e.target.value)} value={text} />
                        <input type='submit' value='update' />
                    </form>
                </div>
                <h2>Delete</h2>
                <button onClick={del}>Delete</button>
                {
                    note.map(item => {
                        return (
                            <div key={item.id}>
                                <h2>{item.title}</h2>
                                <p>{item.text}</p>
                                <Link to={`/`}> Show ALL</Link>

                            </div>
                        )

                    })
                }
            </div>

            )
        </div>
    )
}

export default Write