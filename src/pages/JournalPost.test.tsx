import { LanguageProvider } from "@/context/LanguageContext";
import { findPost, journalPosts } from "@/data/journal";
import JournalPost from "@/pages/JournalPost";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

/** Mounts the real route so `useParams` resolves the slug the way the app does. */
const renderPost = (slug: string, lang: "en" | "it") =>
  render(
    <MemoryRouter initialEntries={[`/journal/${slug}?lang=${lang}`]}>
      <LanguageProvider>
        <Routes>
          <Route path="/journal/:slug" element={<JournalPost />} />
        </Routes>
      </LanguageProvider>
    </MemoryRouter>
  );

describe("journal post page", () => {
  // Stream-sourced notes carry the quotes, tables and deep links; notes written
  // outside a live have no video and must render without the source card.
  const post = journalPosts.find((p) => p.video)!;
  const detached = journalPosts.find((p) => !p.video);

  it("renders the note's title and body markdown", async () => {
    renderPost(post.slug, "it");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(post.title.it);

    // The body arrives from a lazy chunk, so wait for the markdown to land. GFM
    // tables and blockquotes are the two constructs the notes lean on.
    await waitFor(() => expect(screen.getAllByRole("table").length).toBeGreaterThan(1));
    expect(document.querySelectorAll(".post-body blockquote").length).toBeGreaterThan(0);

    // Quoted moments must survive as real links into the source video.
    const deepLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('.post-body a[href*="youtube.com/watch"]')
    );
    expect(deepLinks.length).toBeGreaterThan(3);
    expect(deepLinks.every((a) => /&t=\d+s$/.test(a.href))).toBe(true);
  });

  it("renders the English body when the language is English", async () => {
    const en = findPost("ho-staccato-tutto")!;
    renderPost(en.slug, "en");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(en.title.en);
    await waitFor(() =>
      expect(document.querySelector(".post-body")?.textContent ?? "").toContain(
        "Managed services"
      )
    );
  });

  it("links back to the journal band and out to the source live", async () => {
    renderPost(post.slug, "it");

    const back = document.querySelector<HTMLAnchorElement>('a[href="/#journal"]');
    expect(back).toBeInTheDocument();

    const source = document.querySelector<HTMLAnchorElement>(
      `a[href="https://www.youtube.com/watch?v=${post.video}"]`
    );
    expect(source).toBeInTheDocument();
  });

  it("renders a note with no source live without the video card", async () => {
    if (!detached) return;
    renderPost(detached.slug, "it");

    await waitFor(() =>
      expect(document.querySelector(".post-body")?.textContent ?? "").not.toBe("")
    );
    expect(document.querySelector('a[href*="youtube.com/watch"]')).toBeNull();
  });

  it("falls back to a 404 view for an unknown slug", () => {
    renderPost("not-a-real-note", "it");
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});
