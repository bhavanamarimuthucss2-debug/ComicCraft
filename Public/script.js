
const form = document.getElementById("comic-form");
const ideaInput = document.getElementById("idea");
const genreInput = document.getElementById("genre");
const panelsInput = document.getElementById("panels");
const generateBtn = document.getElementById("generate-btn");
const status = document.getElementById("status");
const resultSection = document.getElementById("result-section");
const comicResult = document.getElementById("comic-result");
const downloadBtn = document.getElementById("download-btn");

let currentScript = "";

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const idea = ideaInput.value.trim();
  const genre = genreInput.value;
  const panels = Number(panelsInput.value);

  if (!idea) {
    status.textContent = "Please enter your story idea.";
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "Creating your comic...";
  status.textContent = "Generating your comic story...";
  resultSection.classList.add("hidden");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        idea: idea,
        genre: genre,
        panels: panels
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Comic generation failed.");
    }

    const story = data.story || data.text;

    if (!story) {
      throw new Error("No story received. Please try again.");
    }

    currentScript = story;
    comicResult.replaceChildren();

    const storyText = document.createElement("pre");
    storyText.textContent = story;
    storyText.style.whiteSpace = "pre-wrap";
    storyText.style.overflowWrap = "anywhere";

    comicResult.appendChild(storyText);
    resultSection.classList.remove("hidden");
    status.textContent = "Your comic story is ready!";

    resultSection.scrollIntoView({
      behavior: "smooth"
    });

  } catch (error) {
    status.textContent =
      error.message || "Something went wrong. Please try again.";
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML =
      '<span>✦</span> Generate my comic <span class="arrow">→</span>';
  }
});

downloadBtn.addEventListener("click", function () {
  if (!currentScript) {
    status.textContent = "Generate a comic first.";
    return;
  }

  const blob = new Blob([currentScript], {
    type: "text/plain;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "ComicCraft-Story.txt";
  link.click();

  URL.revokeObjectURL(url);
});
  
