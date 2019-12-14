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
            <button
                className={id === currentId? !direction ? "selected" : "selected tag": !direction? "" : "tag"}
                onClick={() => {
                    setCurrentId(id);
                }}>
                {folder.name}
            </button>
        )
    });

    return ( !direction ?
        (
            <div className={"horizontal-folder"}>
                <div>
                    {tags}
                    <button onClick={() => {
                            onCreateFolder("NewFolder");
                            setCurrentId("this is some hack")
                        }}>
                        +
                    </button>
                </div>
                <div className="content">
                    <Folder 
                        id={currentId}
                        folder={folders.find(folder => getId(folder) === currentId)}
                        setName={onSetFolderName}
                        setUrl={onSetFolderUrl}
                        setDir={onSetFolderDirection}/>
                </div>
                <button
                    className="edit"
                    onClick={() => {onSetDirection(true)}}>
                    switch
                </button>
            </div>
        ) : (
            <div className="vertical-folder">
                <div className="tags">
                    {tags}
                    <button 
                        onClick={() => {onCreateFolder("NewFolder")}}
                        className="add">
                        +
                    </button>
                </div>
                <div className="content">
                    <Folder 
                        id={currentId}
                        folder={folders.find(folder => getId(folder) === currentId)}
                        setName={onSetFolderName}
                        setUrl={onSetFolderUrl}/>
                </div>
                <button
                    className="bottom-l"
                    onClick={() => {onSetDirection(false)}}>
                    switch
                </button>
            </div>
        )
    )
}

const Folder = ({
    id,
    folder,
    setName,
    setUrl,
}) => {
    const pub = getPub(id);
    const [newName, setNewName] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [editable, setEditable] = useState(id)

    return folder?
        (
            folder.url && editable != id?
            (
                <>
                    <iframe src={folder.url} frameBorder="0"/>
                    <button
                        className="edit" 
                        onClick={() => {
                            setEditable(id)
                            setNewUrl(folder.url)
                        }}>
                        edit
                    </button>
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
                            value={newUrl}
                            onChange={e => {
                                setNewUrl(e.target.value);
                            }}
                            placeholder="set tool url"
                        />
                    </form>
                    <button
                        className="edit" 
                        onClick={() => {setEditable("this is a hack")}}>
                        back
                    </button>
                </>
            )
        ) : (
            <></>
        )
}

const Tag = ({name})