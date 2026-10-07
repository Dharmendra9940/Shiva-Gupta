/* =========================
   CREATE NEW POST
========================= */

function createPost() {

    const input = document.getElementById("postInput");

    const text = input.value.trim();

    if (text === "") {
        alert("Please write something before publishing.");
        return;
    }

    const postsContainer =
        document.getElementById("postsContainer");


    const post = document.createElement("article");

    post.className = "post";


    post.innerHTML = `

        <div class="post-header">

            <img
                src="https://i.pravatar.cc/100?img=12"
                alt="Profile">

            <div>

                <h3>Shiva Gupta</h3>

                <p>
                    Web Developer | Python | AI
                </p>

                <small>Just now • 🌎</small>

            </div>

        </div>


        <div class="post-content">

            <p>${escapeHTML(text)}</p>

            <strong>
                #WebDevelopment #Technology #Learning
            </strong>

        </div>


        <div class="post-stats">

            <span>👍 0</span>

            <span>0 comments</span>

        </div>


        <div class="post-actions">

            <button onclick="likePost(this)">

                <i class="fa-regular fa-thumbs-up"></i>

                Like

            </button>


            <button onclick="focusComment(this)">

                <i class="fa-regular fa-comment"></i>

                Comment

            </button>


            <button onclick="sharePost()">

                <i class="fa-solid fa-share"></i>

                Share

            </button>


            <button>

                <i class="fa-solid fa-paper-plane"></i>

                Send

            </button>

        </div>


        <div class="comment-section">

            <input
                type="text"
                placeholder="Write a comment..."
                onkeypress="addComment(event, this)">

        </div>

    `;


    postsContainer.prepend(post);

    input.value = "";

}


/* =========================
   LIKE POST
========================= */

function likePost(button) {

    button.classList.toggle("liked");


    const icon = button.querySelector("i");


    if (button.classList.contains("liked")) {

        icon.classList.remove("fa-regular");

        icon.classList.add("fa-solid");

        button.innerHTML =
            '<i class="fa-solid fa-thumbs-up"></i> Liked';

    } else {

        icon.classList.remove("fa-solid");

        icon.classList.add("fa-regular");

        button.innerHTML =
            '<i class="fa-regular fa-thumbs-up"></i> Like';

    }

}


/* =========================
   COMMENT
========================= */

function focusComment(button) {

    const post = button.closest(".post");

    const input =
        post.querySelector(".comment-section input");

    input.focus();

}


/* =========================
   ADD COMMENT
========================= */

function addComment(event, input) {

    if (event.key !== "Enter") {
        return;
    }


    const comment = input.value.trim();


    if (comment === "") {
        return;
    }


    const post = input.closest(".post");


    const commentBox =
        document.createElement("div");


    commentBox.className = "user-comment";


    commentBox.innerHTML = `
        <strong>Shiva Gupta</strong>
        <br>
        ${escapeHTML(comment)}
    `;


    input.parentElement.appendChild(commentBox);


    input.value = "";


    updateCommentCount(post);

}


/* =========================
   UPDATE COMMENT COUNT
========================= */

function updateCommentCount(post) {

    const comments =
        post.querySelectorAll(".user-comment").length;


    const countElement =
        post.querySelector(".comment-count");


    if (countElement) {

        countElement.textContent =
            `${comments} comments`;

    }

}


/* =========================
   SHARE POST
========================= */

function sharePost() {

    if (navigator.share) {

        navigator.share({

            title: "LinkedIn Clone",

            text: "Check out this post!"

        });

    } else {

        navigator.clipboard.writeText(
            window.location.href
        );

        alert("Post link copied!");

    }

}


/* =========================
   SEARCH
========================= */

const searchInput =
    document.getElementById("searchInput");


searchInput.addEventListener("keyup", function () {

    const searchText =
        this.value.toLowerCase();


    const posts =
        document.querySelectorAll(".post");


    posts.forEach(function (post) {

        const content =
            post.innerText.toLowerCase();


        if (content.includes(searchText)) {

            post.style.display = "";

        } else {

            post.style.display = "none";

        }

    });

});


/* =========================
   NAVIGATION
========================= */

const navItems =
    document.querySelectorAll(".nav-item");


navItems.forEach(function (item) {

    item.addEventListener("click", function () {

        navItems.forEach(function (nav) {

            nav.classList.remove("active");

        });


        this.classList.add("active");


        const section =
            this.dataset.section;


        if (section === "home") {

            showHome();

        } else {

            showSection(section);

        }

    });

});


/* =========================
   SHOW HOME
========================= */

function showHome() {

    location.reload();

}


/* =========================
   SHOW OTHER SECTIONS
========================= */

function showSection(section) {

    const content =
        document.getElementById("mainContent");


    let title = "";

    let icon = "";


    if (section === "network") {

        title = "My Network";

        icon = "fa-user-group";

    }

    if (section === "jobs") {

        title = "Jobs";

        icon = "fa-briefcase";

    }

    if (section === "messaging") {

        title = "Messaging";

        icon = "fa-comment-dots";

    }

    if (section === "notifications") {

        title = "Notifications";

        icon = "fa-bell";

    }


    content.innerHTML = `

        <div class="post"
             style="text-align:center;padding:80px 20px;">

            <i
                class="fa-solid ${icon}"
                style="
                    font-size:50px;
                    color:#0a66c2;
                    margin-bottom:20px;
                ">
            </i>

            <h2>${title}</h2>

            <p style="margin-top:10px;color:#666;">

                This is the ${title} section
                of your LinkedIn clone.

            </p>

        </div>

    `;

}


/* =========================
   SECURITY
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
