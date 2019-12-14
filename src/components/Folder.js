import React, { useState } from "react";
import { getId, getPub } from "nicks-gun-utils";

export const Folders = ({
    id,
    folders,
    onCreateFolder,
    onSetFolderUrl,
    onSetFolderName,
    onMoveFolder
}) => {

    let tags = []
    const [currentId, setCurrentId] = useState(getId(folders[0]))
    if(!folders) {onCreateFolder("NewFolder")}

    folders.forEach((folder, i) => {
        const id = getId(folder)
        tags.push(
            <button
                className={id === currentId? "selected" : ""} 
                onClick={() => {
                    setCurrentId(id);
                }}>
                {folder.name}
            </button>
        )
    });

    return (
        <div className="folder">
            <div>
                {tags}
                <button onClick={() => {onCreateFolder("NewFolder")}}>
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
        </div>
    )
}

const Folder = ({
    id,
    folder,
    setName,
    setUrl
}) => {
    const pub = getPub(id);
    const [newName, setNewName] = useState("");
    const [newUrl, setNewUrl] = useState("");

    return folder && folder.url?
        (
            <iframe src={folder.url} frameBorder="0"/>
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
                        onChange={e => setNewUrl(e.target.value)}
                        placeholder="set tool url"
                    />
                </form>
            </>
        )
}

const Tag = ({name})