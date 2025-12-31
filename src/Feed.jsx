import React from "react";

export default function Feed({ posts, timeAgo }) {
  return (
    <div className="stack">
      {posts.map((p) => (
        <article className="card" key={p.id}>
          <div className="card-top">
            <div className="badge">{p.type}</div>
            <div className="meta">
              <span className="author">{p.author}</span> • {timeAgo(p.createdAt)}
            </div>
          </div>

          <h2 className="card-title">{p.title}</h2>
          <p className="card-text">{p.text}</p>
        </article>
      ))}
    </div>
  );
}
