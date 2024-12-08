import React from "react";
import { useUser, UserButton } from "@clerk/clerk-react";

const Header = () => {
  const { user } = useUser();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#f5f5f5",
        borderBottom: "1px solid #ddd",
      }}
    >
      <div>
        <h1>Overview</h1>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {user ? (
            <UserButton />
        ) : (
          <span>Loading user info...</span>
        )}
      </div>
    </header>
  );
};

export default Header;
