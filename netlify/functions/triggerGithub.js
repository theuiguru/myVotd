exports.handler = async () => {
    const GITHUB_REPO = "theuiguru/myVotd"; // Change this
    const WORKFLOW_FILE = "schedule-post.yml"; // Change if different
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Load from environment

    const response = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
        {
            method: "POST",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ref: "main" }),
        }
    );

    if (response.ok) {
        return { statusCode: 200, body: "GitHub Action triggered successfully!" };
    } else {
        return { statusCode: response.status, body: "Failed to trigger GitHub Action" };
    }
};