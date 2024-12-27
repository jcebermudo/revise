"use client";

import { useState } from "react";
import { usernameExists } from "@/server/actions/username-restrictions";
import { setUsername } from "@/server/actions/set-username";

export default function UsernameInput() {
  // Capitalized component name
  const [exists, setExists] = useState<boolean | undefined>(undefined); // Added initial value

  const [getUsername, setGetUsername] = useState("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await setUsername(getUsername); // Set username for the user
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          onChange={async (e) => {
            const validator = await usernameExists(e.target.value);
            if (validator === false) {
              setExists(false);
              setIsDisabled(false);
              setGetUsername(e.target.value);
              console.log("available");
            }
            if (validator === true) {
              setExists(true);
              setIsDisabled(true);
              console.log("not available");
            }
          }}
        />
        {exists === true && <p>Already taken, try another one!</p>}
        {exists === false && <p>available!</p>}
        {isDisabled === true && (
          <button type="submit" disabled={isDisabled}>
            Save
          </button>
        )}
        {isDisabled === false && (
          <button type="submit" disabled={isDisabled}>
            Save
          </button>
        )}
      </form>
    </div>
  );
}
