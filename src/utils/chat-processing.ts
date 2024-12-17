/**
 * Processes a chat message to create appropriate title and summary.
 * @param {string} userMessage - The user's message content.
 * @param {string} aiResponse - The AI's response to the user's message.
 * @returns {Object} - An object containing the title and summary.
 */
export function processFirstMessage(userMessage: string, aiResponse: string) {
  // For title: Use the first user message
  const title = userMessage;

  // For summary: Take first 150 characters of AI response, truncate at last complete word
  const summaryLimit = 150;
  let summary = aiResponse.slice(0, summaryLimit);
  if (aiResponse.length > summaryLimit) {
    const lastSpace = summary.lastIndexOf(' ');
    summary = summary.slice(0, lastSpace) + '...';
  }

  return {
    title,
    summary
  };
}