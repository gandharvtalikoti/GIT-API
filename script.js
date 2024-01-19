$(document).ready(function () {
    let currentPage = 1;
    let repositoriesPerPage = 10;
    let totalRepositories = 0;

    const repositoriesContainer = $("#repositoriesContainer");

    $("#myForm").submit(function (event) {
        event.preventDefault();
        const username = $("#username").val().trim();
        if (username) {
            const userLink = `<a href="https://github.com/${username}" target="_blank">${username}</a>`;
            repositoriesContainer.prev("h1").remove();
            repositoriesContainer.before(`<h1 class="mt-3">Public Repositories of ${userLink}</h1>`);
            fetchRepositories(username);
        } else {
            const error = "Invalid GitHub username.";
            repositoriesContainer.prev("h1").remove();
            repositoriesContainer.before(`<h1 class="mt-3">${error}</h1>`);
            console.error("Invalid GitHub username.");
        }
    });

    $("#reposPerPage").change(function () {
        fetchRepositories($("#username").val().trim());
    });

    $("#pagination").on("click", ".page-link", function () {
        const pageClicked = parseInt($(this).text(), 10);
        if (!isNaN(pageClicked)) {
            currentPage = pageClicked;
            fetchRepositories($("#username").val().trim());
        }
    });

    function fetchRepositories(username) {
        repositoriesContainer.empty();
        repositoriesPerPage = parseInt($("#reposPerPage").val(), 10);
        $.ajax({
            url: `https://api.github.com/users/${username}/repos`,
            data: { page: currentPage, per_page: repositoriesPerPage },
            success: function (data, textStatus, xhr) {
                if (xhr.status === 404) {
                    const error = "Invalid GitHub username.";
                    repositoriesContainer.prev("h1").remove();
                    repositoriesContainer.before(`<h1 class="mt-3">${error}</h1>`);
                    console.error("Invalid GitHub username.");
                    return;
                }
                totalRepositories = parseInt(xhr.getResponseHeader("x-total-count"), 10);
                if ($.isArray(data) && data.length > 0) {
                    $.each(data, function (index, repo) {
                        const repoDiv = $('<div class="repository"></div>');
                        repoDiv.html(`
                            <h2>${repo.name}</h2>
                            <p>Description: ${repo.description || "N/A"}</p>
                            <p>Owner: ${repo.owner.login}</p>
                        `);
                        fetchTechStack(username, repo.name, repoDiv);
                        repositoriesContainer.append(repoDiv);
                    });
                    updatePaginationButtons();
                } else {
                    console.log("No public repositories found for the user.");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                if (xhr.status === 404) {
                    const error = "Invalid GitHub username.";
                    repositoriesContainer.prev("h1").remove();
                    repositoriesContainer.before(`<h1 class="mt-3">${error}</h1>`);
                    console.error("Invalid GitHub username.");
                } else {
                    console.error("Error fetching repositories:", textStatus, errorThrown);
                }
            },
        });
    }

    function fetchTechStack(owner, repoName, repoDiv) {
        $.ajax({
            url: `https://api.github.com/repos/${owner}/${repoName}/languages`,
            success: function (languages) {
                if ($.isEmptyObject(languages)) {
                    repoDiv.append("<p>Tech Stack: N/A</p>");
                } else {
                    const techStack = Object.keys(languages).join(", ");
                    repoDiv.append(`<p>Tech Stack: ${techStack}</p>`);
                }
            },
            error: function (error) {
                console.error(`Error fetching tech stack for ${owner}/${repoName}:`, error);
                repoDiv.append("<p>Tech Stack: Error fetching data</p>");
            },
        });
    }

    function updatePaginationButtons() {
        const pagination = $("#pagination");
        pagination.empty();
        const totalPages = Math.ceil(totalRepositories / repositoriesPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const liClass = i === currentPage ? "page-item active" : "page-item";
            pagination.append(`<li class="${liClass}"><a class="page-link" href="#">${i}</a></li>`);
        }
    }
});
