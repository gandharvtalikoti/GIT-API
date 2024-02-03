# Git API Project

Design a website that utilizes the GitHub REST API to display the public GitHub repositories of a specific user. The application provides a search feature allowing users to find GitHub repositories by entering a username. The project is hosted on Netlify and can be accessed at [https://git-api-project.netlify.app/](https://git-api-project.netlify.app/).

## Table of Contents

- [Overview](#overview)
- [How to Run Locally](#how-to-run-locally)
- [Usage](#usage)
- [Live Demo](#live-demo)
- [Technologies Used](#technologies-used)
- [API Integration](#api-integration)
- [Search Feature](#search-feature)
- [Responsive Design](#responsive-design)


## Overview

This project aims to provide a user-friendly interface for exploring the public GitHub repositories of any specified user. It uses the GitHub REST API to fetch user details, repository information, and additional data.

## How to Run Locally

To run the project locally on your machine, follow these steps:

1. Download the project to your local machine.
2. Install Visual Studio Code.
3. Install the Live Server extension for Visual Studio Code.
4. Right-click on the `index.html` file in the project directory.
5. Select "Open with Live Server."

## Usage

Once the application is running, you can use the search feature to find public repositories of any GitHub user. Enter the username in the search bar and submit the form to view the repositories.

## Live Demo

Check out the live demo of the project hosted on Netlify: [Git API Project](https://git-api-project.netlify.app/).

## Technologies Used

The project is built using the following technologies:

- HTML
- CSS
- JavaScript
- Bootstrap
- jQuery
- GitHub REST API

## API Integration

The GitHub REST API (base URL: `https://api.github.com/`) is utilized to fetch endpoints and retrieve user details in JSON format. The data is then processed and displayed on the website.

### Fetching User Details

```javascript
function fetchUserDetails(username) {
    $.ajax({
        url: `https://api.github.com/users/${username}`,
        success: function (user) {
            // Code to process and display user details
        },
        error: function (error) {
            // Code to handle errors
        },
    });
}
```

In this function, you use jQuery's `ajax` method to make an asynchronous HTTP request to the GitHub API's user endpoint (`https://api.github.com/users/${username}`). The `success` callback is triggered when the request is successful, and the `error` callback is triggered in case of an error.

### Processing and Displaying User Details

```javascript
const userLink = `<a href="${user.html_url}" target="_blank">${username}</a>`;
const profileImage = `<div style="display: flex; flex-direction: column; align-items: center; margin-top: 20px;"><img src="${user.avatar_url}" alt="Profile Image" class="mb-3 profile-image"><div style="margin-left: 40px;"><h6>Name: ${user.name}</h6><h6>Bio: ${user.bio}</h6><h6>Location: ${user.location}</h6><h6>Social: ${user.link}</h6></div></div>`;

repositoriesContainer.prev("h1").remove();
repositoriesContainer.prev(".profile-image").remove(); // Remove previous profile image
repositoriesContainer.before(`<h1 class="mt-3">Public Repositories of ${userLink} ${profileImage}</h1>`);
```

1. **User Link:** You create a hyperlink (`<a>`) to the GitHub profile of the user, linking to `user.html_url`.

2. **Profile Image and User Details:** You dynamically generate HTML for displaying the user's profile image along with additional details such as name, bio, location, and social link. The styling ensures a neat and organized layout.

3. **Displaying User Details:** You remove any previous user details and profile image (if any) to ensure a clean update. Then, you append the newly generated HTML to the container before displaying public repositories.

### Note:

- `${user.html_url}`: This is the URL to the user's GitHub profile.
- `${user.avatar_url}`: This is the URL to the user's avatar (profile image).
- `${user.name}`, `${user.bio}`, `${user.location}`, `${user.link}`: These are various details retrieved from the user's GitHub profile.
This integration allows the application to dynamically fetch and display detailed information about the GitHub user, enhancing the user experience on the website.

## Search Feature

The application features a search bar allowing users to search for GitHub repositories by entering a specific username. Upon submitting the form, the user's public repositories are displayed.

## Responsive Design

The website is designed to be responsive, ensuring a seamless user experience across various devices and screen sizes.


