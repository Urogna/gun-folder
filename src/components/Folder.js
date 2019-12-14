import React, { useState, useEffect } from "react";
import { getId, getPub } from "nicks-gun-utils";

export const Folders = ({
    id,
    folders,
    direction,
    onSetDirection,
    onCreateFolder,
    onSetFolderUrl,
    onSetFolderName,
    onSetFolderDirection,
    onMoveFolder
}) => {

    let tags = []
    const [currentId, setCurrentId] = useState()
    const [hoverId, setHoverId] = useState()
    const [editId, setEditId] = useState()

    useEffect(() => {
        if(!currentId) {
            setCurrentId(getId(folders[0]))
        } else {
            setCurrentId(getId(folders[folders.length - 1]))
        }
    }, getId(folders[folders.length - 1]))

    folders.forEach((folder, i) => {
        const id = getId(folder)
        tags.push(
            <div
                className="module"
                onMouseEnter={() => { setHoverId(id) }} 
                onMouseLeave={() => { setHoverId("this is a hack") }}>
                <button
                    className={
                        (id === currentId? !direction ? "selected" : "selected tag": !direction? "" : "tag")
                        + " module-button"
                    }
                    onClick={() => {
                        setCurrentId(id);
                        setEditId("this is a hack")
                    }}>
                    {folder.name}
                </button>
                {hoverId === id && hoverId == currentId? (
                    <button
                        className="special"
                        onClick={() => {
                        setEditId(id);
                    }}>
                        e
                    </button>
                ) : (
                    <>
                    </>
                )}
            </div>
        )
    });

    return ( !direction ?
        (
            <>
                <div className={"horizontal-bar"}>
                    {tags}
                    <div className="special-container">
                        <button
                            className="special"
                            onClick={() => {
                                onCreateFolder("NewFolder");
                                setCurrentId("this is a hack")
                            }}>
                            +
                        </button>
                        <button
                            className="special"
                            onClick={() => {onSetDirection(true)}}>
                            s
                        </button>
                    </div>
                </div>
                <div className="content">
                    <Folder 
                        id={currentId}
                        editId={editId}
                        folder={folders.find(folder => getId(folder) === currentId)}
                        setName={onSetFolderName}
                        setUrl={onSetFolderUrl}
                        setDir={onSetFolderDirection}/>
                </div>
            </>
        ) : (
            <div className="vertical">
                <div className="vertical-bar">
                    <div className="tags">
                        {tags}
                        <div className="special-container">
                            <button 
                                onClick={() => {onCreateFolder("NewFolder")}}
                                className="special">
                                +
                            </button>
                            <button
                                className="special"
                                onClick={() => {onSetDirection(false)}}>
                                s
                            </button>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <Folder 
                        id={currentId}
                        editId={editId}
                        folder={folders.find(folder => getId(folder) === currentId)}
                        setName={onSetFolderName}
                        setUrl={onSetFolderUrl}/>
                </div>
            </div>
        )
    )
}

const Folder = ({
    id,
    editId,
    folder,
    setName,
    setUrl,
}) => {
    const [newName, setNewName] = useState("");
    const [newUrl, setNewUrl] = useState("");

    return folder?
        (
            folder.url && editId != id?
            (
                <>
                    <iframe src={folder.url} frameBorder="0"/>
                </>
            ) : (
                <>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            setName(id, newName);
                            setNewName("");
                        }}
                    >
                        <input
                            autoFocus
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            placeholder="set folder name"
                        />
                    </form>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            setUrl(id, newUrl);
                            setNewUrl("")
                        }}
                    >
                        <input
                            autoFocus
                            value={newUrl? newUrl : folder.url}
                            onChange={e => {
                                setNewUrl(e.target.value);
                            }}
                            placeholder="set tool url"
                        />
                    </form>
                </>
            )
        ) : (
            <></>
        )
}

const Tag = ({name})