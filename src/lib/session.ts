import { supabase } from "../../supabase/supabase";

// Generate a random session ID with a prefix
export function generateSessionId(): string {
  const prefix = "MOVIE";
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomChars}`;
}

// Generate a 4-digit PIN
export function generatePin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Create a new session in the database
export async function createSession(
  userId: string,
  sessionId: string,
  pin: string,
) {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .insert([
        {
          session_id: sessionId,
          pin,
          host_id: userId,
          status: "pending", // Changed from "waiting" to "pending"
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}

// Validate a session ID and PIN
export async function validateSession(sessionId: string, pin: string) {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("session_id", sessionId)
      .eq("pin", pin)
      .in("status", ["pending", "active"]) // Allow joining for both pending and active sessions
      .single();

    if (error) return false;
    return data !== null;
  } catch (error) {
    console.error("Error validating session:", error);
    return false;
  }
}

// Join a session
export async function joinSession(
  sessionId: string,
  userId: string,
  userName: string,
  isHost: boolean = false,
) {
  try {
    console.log(`User ${userName} (${userId}) joining session ${sessionId}`);

    // First check if this user is already in the session
    const { data: existingViewer } = await supabase
      .from("session_viewers")
      .select("*")
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .single();

    // If already joined, just update the connection quality and timestamp
    if (existingViewer) {
      const { data, error } = await supabase
        .from("session_viewers")
        .update({
          connection_quality: "good",
          joined_at: new Date().toISOString(),
        })
        .eq("session_id", sessionId)
        .eq("user_id", userId)
        .select();

      if (error) throw error;
      return data[0];
    }

    // Otherwise insert a new viewer
    const { data, error } = await supabase
      .from("session_viewers")
      .insert([
        {
          session_id: sessionId,
          user_id: userId,
          user_name: userName,
          joined_at: new Date().toISOString(),
          connection_quality: "good",
          status: isHost ? "admitted" : "pending", // Hosts are automatically admitted, others are pending
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error joining session:", error);
    throw error;
  }
}

// Update session status
export async function updateSessionStatus(
  sessionId: string,
  status: "pending" | "active" | "ended",
) {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .update({ status })
      .eq("session_id", sessionId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error updating session status:", error);
    throw error;
  }
}

// Add content to a session
export async function addSessionContent(
  sessionId: string,
  contentType: string,
  contentSource: string,
  contentTitle?: string,
) {
  try {
    console.log(
      `Adding content to session ${sessionId}: ${contentType}, ${contentSource}`,
    );

    // First, delete any existing content for this session to avoid conflicts
    await supabase.from("session_content").delete().eq("session_id", sessionId);

    // Then add the new content
    const { data, error } = await supabase
      .from("session_content")
      .insert([
        {
          session_id: sessionId,
          content_type: contentType,
          content_source: contentSource,
          content_title: contentTitle,
          added_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    // Initialize or reset playback state when adding new content
    await supabase.from("session_playback_state").upsert({
      session_id: sessionId,
      is_playing: false,
      current_time: 0,
      updated_at: new Date().toISOString(),
      updated_by: "system",
    });

    return data[0];
  } catch (error) {
    console.error("Error adding session content:", error);
    throw error;
  }
}

// Get all viewers in a session
export async function getSessionViewers(
  sessionId: string,
  status?: "pending" | "admitted",
) {
  try {
    let query = supabase
      .from("session_viewers")
      .select("*")
      .eq("session_id", sessionId);

    // If status is provided, filter by status
    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting session viewers:", error);
    throw error;
  }
}

// Update viewer connection quality
export async function updateViewerConnectionQuality(
  sessionId: string,
  userId: string,
  quality: "good" | "fair" | "poor" | "offline",
) {
  try {
    const { data, error } = await supabase
      .from("session_viewers")
      .update({ connection_quality: quality })
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error updating viewer connection quality:", error);
    throw error;
  }
}

// Update viewer admission status
export async function updateViewerStatus(
  sessionId: string,
  userId: string,
  status: "pending" | "admitted" | "rejected",
) {
  try {
    const { data, error } = await supabase
      .from("session_viewers")
      .update({ status })
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error updating viewer status:", error);
    throw error;
  }
}

// Remove a viewer from a session
export async function removeSessionViewer(sessionId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("session_viewers")
      .delete()
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error removing session viewer:", error);
    throw error;
  }
}
