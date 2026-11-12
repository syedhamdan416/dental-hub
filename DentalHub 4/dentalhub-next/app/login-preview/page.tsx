
"use client";

import { useState } from "react";
import LoginScreen from "../../components/LoginScreen";

export default function LoginPreview() {
  const [loggedInEmail, setLoggedInEmail] = useState("");

  if (loggedInEmail) {
    return <h2>React login working. Signed in as: {loggedInEmail}</h2>;
  }

  return <LoginScreen onLogin={setLoggedInEmail} />;
}
