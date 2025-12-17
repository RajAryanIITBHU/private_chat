import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

const ANIMALS = [
  "lion",
  "tiger",
  "bear",
  "wolf",
  "eagle",
  "shark",
  "panther",
  "falcon",
  "cobra",
  "rhino",
];

function getRandomUser() {
  const user = `anonymous_${
    ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  }_${nanoid(5)}`;
  return user;
}

export const useUsername = () => {
  const [user, setUser] = useState("");

  useEffect(() => {
    const existingUser = localStorage.getItem("user");
    if (existingUser) {
      queueMicrotask(() => setUser(existingUser));
    } else {
      const newUser = getRandomUser();
      localStorage.setItem("user", newUser);
      queueMicrotask(() => setUser(newUser));
    }
  }, []);

  const refreshUsername = () => {
    const newUser = getRandomUser();
    localStorage.setItem("user", newUser);
    setUser(newUser);
  }

    return {user, refreshUsername};
};
