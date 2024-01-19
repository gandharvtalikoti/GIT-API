$(document).ready(function () {
  let currentPage = 1;
  let repositoriesPerPage = 10;

  $("#myForm").submit(function (event) {
    event.preventDefault();

    const username = $("#username").val().trim();

    if (username) {
      // Insert the link below the "Public Repositories" heading
      const userLink = `<a href="https://github.com/${username}" target="_blank">${username}</a>`;
      $("#repositoriesContainer").prev("h1").remove(); // Remove any existing heading
      $("#repositoriesContainer").before(
        `<h1 class="mt-3">Public Repositories for ${userLink}</h1>`
      );

      // Fetch and display repositories with tech stack
      fetchRepositories(username);
    } else {
      const error = `${username} is not a valid GitHub username.`;
      $("#repositoriesContainer").prev("h1").remove(); // Remove any existing heading
      $("#repositoriesContainer").before(`<h1 class="mt-3">${error}</h1>`);
      console.error("Please enter a valid GitHub username.");
    }
  });

  $("#reposPerPage").change(function () {
    fetchRepositories($("#username").val().trim());
  });

  $("#prevPage").click(function () {
    changePage(-1);
  });

  $("#nextPage").click(function () {
    changePage(1);
  });

  function fetchRepositories(username) {
    const repositoriesContainer = $("#repositoriesContainer");
    repositoriesContainer.empty();
    currentPage = 1;
    repositoriesPerPage = parseInt($("#reposPerPage").val(), 10);

    $.ajax({
      url: `https://api.github.com/users/${username}/repos`,
      data: { page: currentPage, per_page: repositoriesPerPage },
      success: function (data) {
        if ($.isArray(data) && data.length > 0) {
          $.each(data, function (index, repo) {
            const repoDiv = $('<div class="repository"></div>');
            repoDiv.html(`
                <h2>${repo.name}</h2>
                <p>Description: ${repo.description || "N/A"}</p>
                <p>Owner: ${repo.owner.login}</p>
                
              `);

            // Fetch and display tech stack
            fetchTechStack(username, repo.name, repoDiv);

            repositoriesContainer.append(repoDiv);
          });

          updatePaginationButtons(data.length);
        } else {
          console.log("No public repositories found for the user.");
        }
      },
      error: function (error) {
        console.error("Error fetching repositories:", error);
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
        console.error(
          `Error fetching tech stack for ${owner}/${repoName}:`,
          error
        );
        repoDiv.append("<p>Tech Stack: Error fetching data</p>");
      },
    });
  }

  function updatePaginationButtons(repoCount) {
    const prevPageButton = $("#prevPage");
    const nextPageButton = $("#nextPage");

    if (currentPage === 1) {
      prevPageButton.prop("disabled", true);
    } else {
      prevPageButton.prop("disabled", false);
    }

    if (repoCount < repositoriesPerPage) {
      nextPageButton.prop("disabled", true);
    } else {
      nextPageButton.prop("disabled", false);
    }
  }

  function changePage(delta) {
    currentPage += delta;
    fetchRepositories($("#username").val().trim());
  }
});
