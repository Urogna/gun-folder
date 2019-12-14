import { Folders } from "./Folder";
import React, { useState, useEffect } from "react";
import { getPub, useGun, getSet, getId, getUUID } from "nicks-gun-utils";
import { GunContinuousSequence } from "crdt-continuous-sequence";

const Gun = require("gun/gun");
require("gun/sea");
require("gun/lib/radix");
require("gun/lib/radisk");
require("gun/lib/store");
require("gun/lib/rindexed");

export const GunFolder = ({ id, priv, epriv }) => {
  const [gun, setGun] = useState(null);
  const pub = getPub(id);
  const pair = pub && priv && { pub, priv, epriv };
  const [data, onData, put] = useGun(Gun, gun, useState, pair);

  useEffect(() => {
    const gun = Gun({
      localStorage: false,
      peers: ["https://gunjs.herokuapp.com/gun", "http://nmr.io:8765/gun"]
    });
    gun.get(id).on(onData);
    gun
      .get(`${id}.folders`)
      .on(onData)
      .map()
      .on(onData);
    setGun(gun);
  }, []);

  const cs = new GunContinuousSequence(gun);


  if (!gun) {
    return <div>Loading...</div>;
  }

  const folder = {
    ...data[id],
    folders: cs.sort(getSet(data, `${id}.folders`).map(folder => {
      return {
        ...folder
      }})),
  }

  return (
      <Folders
          id={id}
          folders={folder.folders}
          direction={folder.direction}
          onSetDirection={dir => {
            put([id, "direction", dir])
          }}
          onCreateFolder={name => {
            const key = getUUID(gun);
            const folderId = `${id}.folders.${key}`;
            put(
              [folderId, "name", name],
              [`${id}.folders`, key, { "#": folderId }],
            )
          }}
          onSetFolderName={(id, name) => put([id, "name", name])}
          onSetFolderUrl={(id, url) => put([id, "url", url])}
          onSetFolderDirection={(id, dir) => put([id, "direction", dir])}
          onMoveFolder={(id, prev, next) =>
            put([id, "index", JSON.stringify(cs.getIndexBetween(id, prev, next))])
          }
      />
  );
};
