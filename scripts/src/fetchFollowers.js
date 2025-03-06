import dotenv from "dotenv";
dotenv.config();

if (process.env.ACCESS_TOKEN === undefined) {
  console.error("Please provide ACCESS_TOKEN in .env file");
  process.exit(1);
}

import { Octokit } from "@octokit/rest";
import { readFileSync, writeFileSync } from "fs";
import { READMEFILE_PATH } from "./config.js";

const octokit = new Octokit({
  auth: process.env.ACCESS_TOKEN,
});

const getLatestFollowers = async () => {
  const username = "pulkitxm";
  let followers = [];
  let page = 1;
  const perPage = 100;
  let hasMore = true;

  try {
    while (hasMore) {
      const { data } =
        await octokit.rest.users.listFollowersForAuthenticatedUser({
          username: username,
          per_page: perPage,
          page: page,
        });

      followers = followers.concat(data);

      if (data.length < perPage) {
        hasMore = false;
      } else {
        page++;
      }
    }

    const formattedFollowers = followers.map((follower) => ({
      profileUrl: follower.html_url,
      picUrl: follower.avatar_url,
    }));

    formattedFollowers.sort((a, b) => {
      return a.profileUrl.localeCompare(b.profileUrl);
    });

    return formattedFollowers;
  } catch (error) {
    console.error("Error fetching followers:", error.message);
  }
};

export async function handleFetchFollowers() {
  const followers = await getLatestFollowers();
  const followersLength = followers.length;
  let readme = readFileSync(READMEFILE_PATH, "utf-8");

  readme = readme.replace(
    /(?<=<!--START_SECTION:top-followers-heading-->\n)[\s\S]*(?=\n<!--End_SECTION:top-followers-heading-->)/,
    `\n### :sparkles: [My followers (${followersLength})](https://github.com/Pulkitxm?tab=followers)\n`,
  );

  readme = readme.replace(
    /(?<=<!--START_SECTION:top-followers-->\n)[\s\S]*(?=\n<!--END_SECTION:top-followers-->)/,
    `<div style="display: flex; justify-content: center; flex-wrap: wrap;">` +
      followers
        .map(
          (follower) =>
            `<a href="${follower.profileUrl}" target="_blank"><img src="${follower.picUrl.split("?")[0] + "?s=50"}" alt="Follower" width="50"/></a>`,
        )
        .join("\n") +
      `</div>`,
  );

  writeFileSync(READMEFILE_PATH, readme);
  return followers;
}
