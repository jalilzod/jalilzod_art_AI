async function askQuestion() {
    const question = document.getElementById('questionInput').value;
    if (!question) {
        document.getElementById('answerOutput').innerText = "Please enter a question!";
        return;
    }

    document.getElementById('answerOutput').innerText = "Fetching answer...";

    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById('answerOutput').innerText = data.answer;
    } catch (error) {
        document.getElementById('answerOutput').innerText = `Error: ${error.message}`;
    }
}