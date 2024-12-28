"use client";

import { useState } from "react";

export default function TopicButton() {
  const [isOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  return (
    <>
      <button onClick={openModal}>Create a new topic</button>
      {isOpen && (
        <div>
          <h1>Create a new topic</h1>
          <form>
            <input type="text" placeholder="Title" />
            <textarea placeholder="Description" />
            <button type="submit">Create</button>
          </form>
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      )}
    </>
  );
}
