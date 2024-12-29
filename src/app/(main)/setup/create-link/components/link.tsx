"use client";

import { useState } from "react";
import { validateLink } from "@/server/actions/link-restrictions";
import { setLink } from "@/server/actions/set-link";

export default function LinkInput() {
  // Capitalized component name
  const [exists, setExists] = useState<boolean | undefined>(undefined); // Added initial value
  const [getLink, setGetLink] = useState("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [errors, setErrors] = useState<string | null>(""); // Added initial value
  const [success, setSuccess] = useState<string | null>(""); // Added initial value
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await setLink(getLink); // Set username for the user
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row">
          <h1>woah.page/</h1>
          <input
            type="text"
            name="username"
            onChange={async (e) => {
              // see if username exists
              const validator = await validateLink(e.target.value);

              if (validator.isValid === true) {
                setExists(false);
                setIsDisabled(false);
                setGetLink(e.target.value);
                setSuccess(validator.success);
                console.log("available");
              }

              if (validator.isValid === false) {
                setExists(true);
                setIsDisabled(true);
                setErrors(validator.error);
                console.log("not available");
              }
            }}
          />
        </div>
        {exists === true && <p>{errors}</p>}
        {exists === false && <p>{success}</p>}
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
