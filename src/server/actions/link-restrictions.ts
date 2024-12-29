"use server"
import { db } from "@/db"
import { userTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function linkExists(username: string): Promise<boolean> {
    const results = await db
        .select({ username: userTable.username })
        .from(userTable)
        .where(eq(userTable.username, username));
    
    // SQL queries typically return an empty array if no matches are found
    return results.length > 0;
}

export async function validateLink(username: string): Promise<{ isValid: boolean; error: string | null; success: string | null }> {
  // Remove any whitespace from the beginning and end
  const trimmedUsername = username.trim();
  
  // Check for minimum length
  if (trimmedUsername.length < 3) {
    return {
      isValid: false,
      error: "Must be at least 3 characters long!",
      success: null
    };
  }
  
  // Check for maximum length
  if (trimmedUsername.length > 8) {
    return {
      isValid: false,
      error: "Cannot be longer than 8 characters!",
      success: null
    };
  }
  
  // Check for special characters using regex
  // This regex allows only letters, numbers, and underscores
  const validLinkRegex = /^[a-zA-Z0-9_]+$/;
  
  if (!validLinkRegex.test(trimmedUsername)) {
    return {
      isValid: false,
      error: "Link can only contain letters, numbers, and underscores",
      success: null
    };
  }

  const existingLink = await linkExists(trimmedUsername);

  if(existingLink) {
    return {
      isValid: false,
      error: "Link already exists, try another one!",
      success: null
    };
  }
  
  // If all validations pass
  return {
    isValid: true,
    error: null,
    success: "Link is available!"
  };
}

