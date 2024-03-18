const axios = require("axios");

function combinedLink(owner, repName, startDate, endDate) {
  const apiUrl = "https://api.github.com/search/issues?q=repo:";

  const dateLink = {
    details: `${apiUrl}${owner}/${repName}`,
    created: `+is:pr+created:${startDate}..${endDate}&`,
    updated: `+is:pr+updated:${startDate}..${endDate}&`,
    merged: `+is:pr+merged:${startDate}..${endDate}&`,
    closed: `+is:pr+closed:${startDate}..${endDate}`,
  };
  return Object.values(dateLink).join("");
}

function printPullRequestData(response) {
  console.log(
    response.data.items.map((pullRequest) => {
      const { id, user, title, state, created_at } = pullRequest;
      return {
        id,
        user: user.login,
        title,
        state,
        created_at: created_at.substring(0, 10),
      };
    })
  );
}

function repoLinkVerify(owner, repName, startDate, endDate) {
  const singleLink = combinedLink(owner, repName, startDate, endDate);

  axios
    .get(singleLink)
    .then((response) => {
      return printPullRequestData(response);
    })
    .catch((error) => {
      throw new Error(
        `${error.response.status}, Repository ${error.response.statusText}.`
      );
    });
}

function verifyUser(owner, repName, startDate, endDate) {
  const verifyUserLink = `https://api.github.com/users/${owner}`;

  axios
    .get(verifyUserLink)
    .then((response) => {
      if (response.status === 200) {
        repoLinkVerify(owner, repName, startDate, endDate);
      }
    })
    .catch((error) => {
      throw new Error(
        `${error.response.status}, User ${error.response.statusText}.`
      );
    });
}

function getPullRequests(owner, repName, startDate, endDate) {
  verifyUser(owner, repName, startDate, endDate);
}
// getPullRequests("facebook", "react", "2022-05-01", "2023-07-10");
getPullRequests("Umuzi-org", "ACN-syllabus", "2022-03-01", "2022-03-10");
