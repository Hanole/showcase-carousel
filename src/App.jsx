import GameCarousel from './components/GameCarousel'
import Lobby from './components/Lobby';
import './App.css'

import { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";
import { fetchPlayers } from './api/players';


function App() {
  const [currentView, setCurrentView] = useState("lobby");
  const [collectionSlug, setCollectionSlug] = useState("");
  const [lobbyId, setLobbyId] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]);

  async function createLobby({ slug, name }) {
    const { data, error } = await supabase
      .from("lobbies")
      .insert({
        collection_slug: slug,
        host_name: name,
        status: "waiting",  
      })
      .select()
      .single();

    if (error) {
      console.error("Feil ved opprettelse av lobby:", error);
      throw error;
    }

    return data;
  }

  async function joinLobby({ lobbyId, name }) {
    const { data, error } = await supabase
      .from("players")
      .insert({
        lobby_id: lobbyId,
        name,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Feil ved join:", error);
      throw error;
    }

    return data;
  }

  useEffect(() => {
    if (!lobbyId) return;

    async function loadPlayers() {
      try {
        const data = await fetchPlayers(lobbyId);
        setPlayers(data);
      } catch (e) {
        console.error(e);
      }
    }
    loadPlayers();
  }, [lobbyId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lobbyFromUrl = params.get("lobby");
    if (lobbyFromUrl) {
      setLobbyId(lobbyFromUrl);
    }
  }, []);


  return (
    <div>
      <div className="headliner">
        <h1>GAME SUGGESTIONS FOR MY BOYS</h1>
      </div>

      {currentView === "lobby" ? (
        <Lobby
          lobbyId={lobbyId}
          players={players}
          playerName={playerName}
          isHost={isHost}

          onCreate={async ({ slug, name }) => {
            console.log("onCreate:", { slug, name });
            try {
              const lobby = await createLobby({ slug, name })
              setCollectionSlug(slug);
              setPlayerName(name);
              setIsHost(true);
              setLobbyId(lobby.id);

              await joinLobby({ lobbyId: lobby.id, name });
            } catch (e) {
              console.error(e);
            }
          }}
          onJoin={ async ({ name }) => {
            console.log("onJoin:", { lobbyId, name });
            if (!lobbyId) return;
            try {
              await joinLobby({ lobbyId, name });
              setPlayerName(name);
              setIsHost(false);
            } catch (e) {
              console.error(e);
            }

          }}
          onStart={(slugFromLobby) => {
            if (slugFromLobby) {
              setCollectionSlug(slugFromLobby)
            }
              setCurrentView("game");
            }
          }
        />
      ) : (
        <GameCarousel 
          collectionSlug={collectionSlug}
          lobbyId={lobbyId}
          playerName={playerName} 
          />
      )}
    </div>
  );
}


export default App;
