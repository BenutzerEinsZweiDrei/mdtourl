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
    const maxLength = 20000; // Set a reasonable maximum length
    if (markdownContent.length > maxLength) {
      console.error("Markdown content too long");
      document.getElementById("mdhere").innerText = "Content is too long to display.";
      return;
    }

    const sanitizedHTML = marked.parse(DOMPurify.sanitize(decodeURIComponent(markdownContent)));
    document.getElementById("mdhere").innerHTML = sanitizedHTML;

    // executeInlineScripts(); // Execute any inline scripts that were sanitized
    setLinksToOpenInNewTab(); // Make sure all links open in a new tab
  }

  function setLinksToOpenInNewTab() {
  const links = document.querySelectorAll("#mdhere a");
  links.forEach(link => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
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
