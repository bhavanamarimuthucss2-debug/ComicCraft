const form = document.querySelector("#comic-form");
const ideaInput = document.querySelector("#idea");
const genreInput = document.querySelector("#genre");
const panelsInput = document.querySelector("#panels");
const generateBtn = document.querySelector("#generate-btn");
const statusEl = document.querySelector("#status");
const resultSection = document.querySelector("#result-section");
const resultEl = document.querySelector("#comic-result");
const downloadBtn = document.querySelector("#download-btn");

let latestStory = null;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const idea = ideaInput.value.trim();
  if (idea.length < 3) {
    showStatus("Please enter a little more detail about your story.", true);
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "Creating your comic…";
  showStatus("Gemini is turning your idea into a story. Please wait.");
  resultSection.classList.add("hidden");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea, genre: genreInput.value, panels: Number(panelsInput.value) })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Something went wrong.");
    latestStory = data;
    renderStory(data);
    resultSection.classList.remove("hidden");
    showStatus("Your comic script is ready!");
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    showStatus(error.message || "Could not generate the story. Please try again.", true);
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<span>✦</span> Generate my comic <span class="arrow">→</span>';
  }
});

function showStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.className = isError ? "status error" : "status";
}

function renderStory(story) {
  resultEl.replaceChildren();
  const title = document.createElement("h3");
  title.className = "comic-title";
  title.textContent = story.title || "Your New Comic";
  resultEl.append(title);

  const summary = document.createElement("p");
  summary.className = "comic-summary";
  summary.textContent = story.summary || "";
  resultEl.append(summary);

  const grid = document.createElement("div");
  grid.className = "panel-grid";
  for (const [index, panel] of story.panels.entries()) {
    const card = document.createElement("article");
    card.className = "panel";

    const top = document.createElement("div");
    top.className = "panel-top";
    const label = document.createElement("span");
    label.textContent = `Panel ${panel.number || index + 1}`;
    const num = document.createElement("span");
    num.className = "panel-number";
    num.textContent = String(index + 1);
    top.append(label, num);

    const scene = document.createElement("div");
    scene.className = "scene";
    scene.textContent = panel.scene || panel.imagePrompt || "Scene description";

    const dialogue = document.createElement("div");
    dialogue.className = "dialogue";
    dialogue.textContent = panel.dialogue || "…";

    card.append(top, scene, dialogue);
    grid.append(card);
  }
  resultEl.append(grid);
}

downloadBtn.addEventListener("click", () => {
  if (!latestStory) return;
  const lines = [latestStory.title || "ComicCraft Story", "", latestStory.summary || "", ""];
  for (const panel of latestStory.panels || []) {
    lines.push(`PANEL ${panel.number}`, `Scene: ${panel.scene || ""}`, `Dialogue: ${panel.dialogue || ""}`, `Illustration prompt: ${panel.imagePrompt || ""}`, "");
  }
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "comiccraft-story.txt";
  link.click();
  URL.revokeObjectURL(url);
});
