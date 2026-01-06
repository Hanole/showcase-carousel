import { useState, useEffect, useRef } from "react";
import "./GameCarousel.css";

import ParticleBackground from "./ParticleBackground";
import { fetchCollection } from "../api/rawgApi";
import { submitVote, fetchVotesForLobby } from "../api/votes";

export default function GameCarousel({ collectionSlug, lobbyId, playerName }) {
  const [active, setActive] = useState(0);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [playingClip, setPlayingClip] = useState(null);
  const mediaRef = useRef(null);

  const [currentScreenshotIndices, setCurrentScreenshotIndices] = useState({});

  // Screenshot Timer
  useEffect(() => {
    if (!games.length) return;

    const activeGame = games[active];
    const activeGameId = activeGame.id;
    const screenshots = activeGame.short_screenshots || [];

    if (screenshots.length === 0) {
      setCurrentScreenshotIndices((prev) => ({
        ...prev,
        [activeGameId]: 0,
      }));
      return;
    }

    const timerId = setInterval(() => {
      setCurrentScreenshotIndices((prev) => {
        const currentIndex = prev[activeGameId] || 0;
        return {
          ...prev,
          [activeGameId]: (currentIndex + 1) % screenshots.length,
        };
      });
    }, 3000);

    setCurrentScreenshotIndices((prev) => ({
      ...prev,
      [activeGameId]: 0,
    }));

    return () => clearInterval(timerId);
  }, [active, games]);

  // Video playback toggling
  const togglePlay = (gameId) => {
    if (playingClip === gameId) {
      setPlayingClip(null);
    } else {
      setPlayingClip(gameId);
    }
  };

  useEffect(() => {
    setPlayingClip(null);
  }, [active]);

  useEffect(() => {
    if (!collectionSlug) return;

    setLoading(true);
    setError(null);
    async function loadGames() {
      try {
        const rawgGames = await fetchCollection(collectionSlug);

        let gamesWithVotes = rawgGames;

        if (lobbyId) {
          const votes = await fetchVotesForLobby(lobbyId);

          gamesWithVotes = rawgGames.map((game) => {
            const votesForGame = votes.filter((v) => v.game_id === game.id);
            const upvotes = votesForGame.filter((v) => v.value === 1).length;
            const downvotes = votesForGame.filter((v) => v.value === -1).length;

            return { ...game, upvotes, downvotes };
          });
        } else {
          gamesWithVotes = rawgGames.map((game) => ({
            ...game,
            upvotes: 0,
            downvotes: 0,
          }));
        }

        setGames(gamesWithVotes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadGames();
  }, [collectionSlug, lobbyId]);

  const updateSlideStyle = (index) => {
    let rootElement = document.querySelector(":root");
    rootElement.style.setProperty("--carousel-index", index);
  };

  // Slide nav logic

  const prevSlide = () => {
    setActive((prev) => {
      const nextPrev = prev === 0 ? games.length - 1 : prev - 1;
      updateSlideStyle(nextPrev);
      return nextPrev;
    });
  };

  const nextSlide = () => {
    setActive((prev) => {
      const nextPrev = prev === games.length - 1 ? 0 : prev + 1;
      updateSlideStyle(nextPrev);
      return nextPrev;
    });
  };

  // Voting handlers
  const handleUpvote = async (gameId) => {
    if (!lobbyId || !playerName) return;
    try {
      await submitVote({ lobbyId, playerName, gameId, value: 1 });
      setGames((prevGames) =>
        prevGames.map((game) =>
          game.id === gameId ? { ...game, upvotes: game.upvotes + 1 } : game
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownvote = async (gameId) => {
    if (!lobbyId || !playerName) return;
    try {
      await submitVote({ lobbyId, playerName, gameId, value: -1 });
      setGames((prevGames) =>
        prevGames.map((game) =>
          game.id === gameId ? { ...game, downvotes: game.downvotes + 1 } : game
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const trackRef = useRef(null);

  // const currentIdx = screenshotIdx[game.id] || 0;
  // const screenshotUrl = game.short_screenshots?.[currentIdx]?.image || game.image;

  if (loading) return <div>Loading games...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ "--active-index": active }}>
      <ParticleBackground />
      <div className="carousel-container">
        <div className="carousel-wrapper">
          <div className="carousel-nav-gradient left" onClick={prevSlide}>
            <span className="nav-arrow">&lt;</span>
          </div>
          <div ref={trackRef} className="carousel-track">
            {games.map((game, idx) => {
              const indexForGame = currentScreenshotIndices[game.id] || 0;
              const screenshots = game.short_screenshots || [];
              const screenshotUrl =
                screenshots[indexForGame]?.image || game.background_image;

              return (
                <div
                  key={game.id}
                  className={`carousel-slide ${idx === active ? "active" : ""}`}
                >
                  {playingClip === game.id && game.clip ? (
                    <video
                      src={
                        typeof game.clip === "string"
                          ? game.clip
                          : game.clip?.clip
                      }
                      autoPlay
                      controls
                      onEnded={() => setPlayingClip(null)}
                      onPause={() => setPlayingClip(null)}
                      style={{ width: "100%", borderRadius: "16px" }}
                    />
                  ) : (
                    <img
                      src={screenshotUrl}
                      alt={game.name}
                      style={{ cursor: game.clip ? "pointer" : "default" }}
                      onClick={() =>
                        game.clip && togglePlay(game.id, game.clip)
                      }
                    />
                  )}
                  <h2>{game.name}</h2>
                  <p className="release-date">Release: {game.released}</p>
                  <p className="rating">Rating: {game.rating}</p>
                  <div className="genres-container">
                    <p className="genres-label">
                      Genres:{" "}
                      <span className="genres-list">
                        {game.genres.map((genre) => (
                          <span key={genre.id} className="genre-box">
                            {genre.name}
                          </span>
                        ))}
                      </span>
                    </p>
                  </div>

                  <a href={game.link} target="_blank" rel="noopener noreferrer">
                    Learn more about "{game.name}"
                  </a>
                  <div className="button-container">
                    <button
                      className="carousel-button"
                      onClick={() => handleUpvote(game.id)}
                    >
                      👍 {game.upvotes}
                    </button>
                    <button
                      className="carousel-button"
                      onClick={() => handleDownvote(game.id)}
                    >
                      👎 {game.downvotes}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="carousel-nav-gradient right" onClick={nextSlide}>
            <span className="nav-arrow">&gt;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
