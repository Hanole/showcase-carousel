import { supabase } from "../supabaseClient";

export async function fetchPlayers(lobbyId) {
    const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("lobby_id", lobbyId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("feil ved henting av players:", error)
        throw error;
    }

    return data;
}