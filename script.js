// This script can be used for any JavaScript functionality you need.
document.addEventListener("DOMContentLoaded", function() {
    console.log("Page loaded and ready!");
});

/* scripts.js */
document.getElementById('post-comment').addEventListener('click', function() {
    const commentBox = document.getElementById('comment-box');
    const commentText = commentBox.value;

    if (commentText.trim() !== '') {
        const comment = document.createElement('div');
        comment.classList.add('comment', 'card-panel');
        comment.innerHTML = `
            <p>${commentText}</p>
            <div class="vote">
                <button class="upvote btn-small waves-effect waves-light">👍</button>
                <button class="downvote btn-small waves-effect waves-light">👎</button>
            </div>
        `;

        document.querySelector('.comments').appendChild(comment);
        commentBox.value = '';

        // Adding event listeners to vote buttons
        comment.querySelector('.upvote').addEventListener('click', function() {
            alert('Upvoted!');
        });

        comment.querySelector('.downvote').addEventListener('click', function() {
            alert('Downvoted!');
        });
    }
});

document.getElementById('prev-article').addEventListener('click', function() {
    alert('Going to the previous article...');
    // Implement logic to go to the previous article
});

document.getElementById('next-article').addEventListener('click', function() {
    alert('Going to the next article...');
    // Implement logic to go to the next article
});
