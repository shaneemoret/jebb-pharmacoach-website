import assert from "node:assert/strict";
import test from "node:test";
import { canonicalYouTubeUrl, findDuplicatePostByVideo, normalizeYouTubeVideoId, youtubeEmbedUrl } from "../src/videoEmbeds.js";

test("normalizes supported YouTube URL forms", () => {
  for (const value of [
    "I1djsooyhvA",
    "https://www.youtube.com/watch?v=I1djsooyhvA",
    "https://www.youtube.com/shorts/I1djsooyhvA",
    "https://youtu.be/I1djsooyhvA",
    "https://www.youtube.com/embed/I1djsooyhvA",
  ]) assert.equal(normalizeYouTubeVideoId(value), "I1djsooyhvA");
});

test("fails safely for missing or malformed YouTube IDs", () => {
  for (const value of ["", "too-short", "https://example.com/watch?v=I1djsooyhvA", "javascript:alert(1)"]) {
    assert.equal(normalizeYouTubeVideoId(value), null);
    assert.equal(youtubeEmbedUrl(value), null);
  }
});

test("uses canonical and privacy-enhanced YouTube URLs", () => {
  assert.equal(canonicalYouTubeUrl("https://www.youtube.com/shorts/I1djsooyhvA"), "https://www.youtube.com/watch?v=I1djsooyhvA");
  assert.equal(youtubeEmbedUrl("I1djsooyhvA"), "https://www.youtube-nocookie.com/embed/I1djsooyhvA");
});

test("detects duplicate videos across source and video fields", () => {
  const posts = [
    { slug: "existing", source: { url: "https://www.youtube.com/watch?v=I1djsooyhvA" } },
    { slug: "tiktok", video: { platform: "tiktok", id: "7655066833107668238" } },
  ];
  assert.equal(findDuplicatePostByVideo(posts, "https://youtu.be/I1djsooyhvA")?.slug, "existing");
  assert.equal(findDuplicatePostByVideo(posts, "https://youtu.be/AAAAAAAAAAA"), null);
});
