import { useState } from "react";
import './Lobby.css';

function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Lobby({ lobbyId, players, playerName, isHost, onStart, onJoin, onCreate }) {
    const [slug, setSlug] = useState("");
    const [localName, setLocalName] = useState("");
    const [copied, setCopied] = useState(false);

    const handleCreate = async () => {
        if (!slug.trim() || !localName.trim()) return;
        await onCreate({ slug: slug.trim(), name: localName.trim() });
    }

    const handleJoin = async () => {
        if (!localName.trim()) return;
        await onJoin({ name: localName.trim() });
    }

    const copyToClipboard = () => {
      navigator.clipboard.writeText(lobbyId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="lobby">
        {!lobbyId ? (
          <div className="create-lobby">
            <h2>Opprett ny lobby</h2>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Collection slug fra RAWG"
            />
            <input
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Ditt navn"
            />
            <button onClick={handleCreate} disabled={!slug || !localName}>
              Create lobby
            </button>
          </div>
        ) : (
          <div>
            {isHost ? (
              <div>

                  {lobbyId && (
                    <h2>
                      Lobby-id:{" "}
                      <span onClick={copyToClipboard} className="lobby-id-code">
                        {lobbyId} {copied && "(kopiert!)"}
                      </span>
                    </h2>
                  )}

                <p>Navn: {capitalizeFirst(playerName)}</p>
              </div>
            ) : (
              <div>
                <h2>Bli med i lobby</h2>
                <p>Lobby-ID: {lobbyId}</p>
                <input
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                  placeholder="Ditt navn"
                />
                <button onClick={handleJoin} disabled={!localName}>
                  Join lobby
                </button>
              </div>
            )}
          </div>
        )}

        <h3>Spillere i lobbyen:</h3>
        <ul>
          {players.map((p) => (
            <li key={p.id}>{capitalizeFirst(p.name)}</li>
          ))}
        </ul>
        {lobbyId && isHost && (
          <button onClick={() => onStart(slug || null)} disabled={!slug}>
            Start game
          </button>
        )}
      </div>
    );
}