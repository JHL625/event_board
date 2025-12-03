import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPanel() {
  const { user, loading, error, login, register, logout, setError } = useAuth();
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "visitor",
  });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (mode === "login") {
        await login({ username: form.username, password: form.password });
      } else {
        await register({
          username: form.username,
          password: form.password,
          role: form.role,
        });
      }
      setForm((f) => ({ ...f, password: "" })); // clear password
    } catch (e) {
      setError(e.message || "Auth failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Checking login status...</p>;
  }

  if (user) {
    return (
      <div
        style={{
          border: "1px solid #444",
          borderRadius: "8px",
          padding: "12px",
          marginBottom: "16px",
          background: "#222",
          color: "#eee",
        }}
      >
        <p style={{ margin: "0 0 8px" }}>
          Logged in as <strong>{user.username}</strong> ({user.role})
        </p>
        <button onClick={logout} disabled={submitting}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "16px",
        background: "#222",
        color: "#eee",
      }}
    >
      <div style={{ marginBottom: "8px" }}>
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError("");
          }}
          style={{
            marginRight: "8px",
            fontWeight: mode === "login" ? "bold" : "normal",
          }}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setError("");
          }}
          style={{ fontWeight: mode === "register" ? "bold" : "normal" }}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* USERNAME FIELD */}
        <div style={{ marginBottom: "8px" }}>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
            style={{ width: "100%", padding: "6px" }}
          />
        </div>

        {/* PASSWORD FIELD */}
        <div style={{ marginBottom: "8px" }}>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            style={{ width: "100%", padding: "6px" }}
          />
        </div>

        {/* ROLE ONLY FOR REGISTER */}
        {mode === "register" && (
          <div style={{ marginBottom: "8px" }}>
            <label>
              Role:&nbsp;
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                style={{ padding: "4px" }}
              >
                <option value="visitor">Visitor</option>
                <option value="organizer">Organizer</option>
              </select>
            </label>
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#552222",
              color: "#ffb3b3",
              padding: "6px",
              marginBottom: "8px",
              borderRadius: "4px",
            }}
          >
            {error}
          </div>
        )}

        <button type="submit" disabled={submitting}>
          {submitting
            ? mode === "login"
              ? "Logging in..."
              : "Registering..."
            : mode === "login"
            ? "Login"
            : "Register"}
        </button>
      </form>
    </div>
  );
}
