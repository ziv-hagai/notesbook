import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import MicTwo from '../components/MicTwo';
import { Context } from '../App';
import { AiFillCaretDown, AiFillCaretUp, AiOutlineClockCircle, AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";

import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveMutable } from 'array-move';



const HomeTwo = () => {
    const { notes, setNotes, isNew, setIsNew, edit, setEdit } = useContext(Context);
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/notes/all')
            .then(res => res.json())
            .then(data => {
                setNotes(data)
                setEdit(false)
            })
            .catch(err => console.log(err));
    }, []);

    const handleDrop = (droppedItem) => {
        if (!droppedItem.destination) return;
        var updatedList = [...notes];
        const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
        updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
        setNotes(updatedList);
        updatedList.forEach((item, i) => {
            fetch(`/notes/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ index: updatedList.length - i })
            })
                .then(res => res.json())
                .catch(err => console.log(err));
        })
    };

    const reset = () => {
        fetch('/notes/all')
            .then(res => res.json())
            .then(data => {
                setNotes(data)
                setEdit(false)
            })
            .catch(err => console.log(err));
    }

    const reverse = () => {
        isNew ?
            notes.sort(function (a, b) {
                const keyA = new Date(a.date),
                    keyB = new Date(b.date);
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            })
            :
            notes.sort(function (a, b) {
                const keyA = new Date(a.date),
                    keyB = new Date(b.date);
                if (keyA > keyB) return -1;
                if (keyA < keyB) return 1;
                return 0;
            })
        setIsNew(!isNew)
    }

    const search = (text) => {
        fetch(`/notes/search?q=${text}`)
            .then(res => res.json())
            .then(data => {
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
            body: JSON.stringify({ title: `New Note`, text: '', color: 'white', index: notes.length })
        })
            .then(res => res.json())
            .then(data => {
                notes.push(data[0])
                setNotes([...notes])
                setEdit(true)
                navigate(`/${notes[notes.length - 1].id}`)
            })
            .catch(err => console.log(err));
    }


    const SortableItem = SortableElement(({ value }) => {
        return (
            <li
                className="item-container">
                <Link style={{ backgroundColor: value.color }} to={`/${value.id}`} className='card tc grow bg-whitesmoke br3 pa3 ma2 dib bw2 shadow-5'>
                    <div >
                        <h3 >{value.title}</h3>
                        <p>{value.text}</p>
                        <h6>{value.date.slice(0, 10).replace('-0', '.').replace('-', '.')}</h6>
                    </div>
                </Link>
            </li>
        )
    });


    const SortableList = SortableContainer(({ items }) => {
        return (
            <ul>
                {notes.map((value, index) => (
                    <SortableItem key={`item-${value.id}`} index={index} value={value} />
                ))}
            </ul>
        );
    });

    const onSortEnd = ({ oldIndex, newIndex }) => {
        console.log(oldIndex, newIndex);
        setNotes(({ notes }) => ({
            notes: arrayMoveMutable(notes, oldIndex, newIndex),
        }));
        console.log(notes);
    }


    return (
        <div >
            <div id="up" >
                <a className="f6 grow no-underline br-pill ph3 pv2 mb2 dib black bg-light-gray" onClick={reverse}>{isNew ? <AiFillCaretDown /> : <AiFillCaretUp />}</a>
                <a className="f6 grow no-underline br-pill ph3 pv2 mb2 dib black bg-light-gray" onClick={reset}>
                    <AiOutlineClockCircle />
                </a>
                <div id='search' className="f6 br-pill ph3 pv2 mb2 dib black black bg-light-gray">
                    <input type='text' onChange={(e) => search(e.target.value)} />
                    <AiOutlineSearch />
                </div>
                <div className="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-black" ><MicTwo /></div>
                <a className="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-black" onClick={add}><AiOutlinePlus /></a>
            </div>
            <div id="board">
                <SortableList items={notes} onSortEnd={onSortEnd} />;
            </div>
        </div >
    )
}

export default HomeTwo