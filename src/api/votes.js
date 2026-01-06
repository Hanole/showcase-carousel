import { supabase } from "../supabaseClient";

export async function submitVote({ lobbyId, playerName, gameId, value }) {
    const { data, error } = await supabase
        .from("votes")
        .insert({
            lobby_id: lobbyId,
            player_name: playerName,
            game_id: gameId,
            value,
        })
        .select()
        .single();
    
    if (error) {
        console.error("feil ved lagring av vote", error);
        throw error;
    }
    return data;
}

export async function fetchVotesForLobby(lobbyId) {
    const { data, error } = await supabase
        .from("votes")
        .select("game_id, value")
        .eq("lobby_id", lobbyId);

    if (error) {
        console.error("feil ved henting av votes:", error);
        throw error;
    }

    return data;
}