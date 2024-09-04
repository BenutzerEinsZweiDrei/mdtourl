document.addEventListener("DOMContentLoaded", function () {
  // Use DOMPurify to sanitize the HTML
  marked.use({
    renderer: {
      html: false // Disable rendering of raw HTML
    },
    breaks: true // Preserve line breaks
  });

  function renderMarkdownFromString(markdownContent) {
    // Limit the content length to prevent DoS attacks
    const maxLength = 5000; // Set a reasonable maximum length
    if (markdownContent.length > maxLength) {
      console.error("Markdown content too long");
      document.getElementById("content").innerText = "Content is too long to display.";
      return;
    }

    const sanitizedHTML = DOMPurify.sanitize(marked.parse(decodeURIComponent(markdownContent)));
    document.getElementById("content").innerHTML = sanitizedHTML;

    executeInlineScripts(); // Execute any inline scripts that were sanitized
    setLinksToOpenInNewTab(); // Make sure all links open in a new tab
  }

  function executeInlineScripts() {
    const scriptTags = document.querySelectorAll("#content script");
    scriptTags.forEach(function (scriptTag) {
      if (scriptTag.src) {
        const externalScript = document.createElement("script");
        externalScript.src = scriptTag.src;
        document.getElementById("content").removeChild(scriptTag);
        document.getElementById("content").appendChild(externalScript);
      } else {
        try {
          eval(scriptTag.innerText);
        } catch (error) {
          console.log("Error executing script:", error);
        }
      }
    });
  }

  function setLinksToOpenInNewTab() {
    const links = document.querySelectorAll("a");
    links.forEach(link => link.setAttribute("target", "_blank"));
  }

  // Get the markdown content directly from the query parameter 'content'
  const urlParams = new URLSearchParams(window.location.search);
  const markdownContent = urlParams.get("content");

  if (markdownContent) {
    renderMarkdownFromString(markdownContent);
  } else {
    console.log("No markdown content provided.");
  }
});

// Additional utility functions remain unchanged
var findBlocks = function (data, variableNames) {
  const matches = [];
  variableNames.forEach(function (variable) {
    const regexPattern = `#region(?<variableName> ${variable})(?<content>[\\s\\S]*?)(#endregion)`;
    let regex = new RegExp(regexPattern, "g");
    for (const match of data.matchAll(regex)) {
      const variableName = match.groups.variableName.trim();
      if (variableNames.includes(variableName)) {
        const content = match.groups.content.trim();

        matches.push({
          variableName,
          content,
        });
      }
    }
  });
  return matches;
};

function showBlocks(data, variableNames) {
  var blocks = findBlocks(data, variableNames);
  blocks.forEach(function (item, index) {
    let variableNameBlock = document.getElementById(item.variableName);
    let codeBlock = document.getElementById("code" + index);
    if (codeBlock !== null) {
      codeBlock.textContent = item.content;
      hljs.highlightElement(codeBlock);
    }
    if (variableNameBlock !== null) {
      variableNameBlock.textContent = item.variableName);
    }
  });
}

function handleDocumentWrite(content) {
  var contentPlaceholder = document.getElementById("content");
  contentPlaceholder.innerHTML += content;
}
window.document.write = handleDocumentWrite;
