import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { readFileSync, writeFileSync } from "fs";
import { updateWorkflowNumber } from "./updateWorkflowNumber.js";
import { BlogsResponseSchema, READMEFILE_PATH } from "./config.js";

const fetchLatestBlogs = async () => {
  const query = `
query Publication($id: ObjectId = "66213f8be5371b46eac0e05e") {
  publication(id: $id) {
    posts(first: 4) {
      edges {
        node {
          title
          url
          publishedAt
          coverImage {
            url
          }
        }
      }
    }
  }
}
  `;

  try {
    const response = await axios.post("https://gql.hashnode.com/", { query });
    const validatedResponse = BlogsResponseSchema.parse(response.data);

    const posts = validatedResponse.data.publication.posts.edges.map((edge) => {
      const { title, url, publishedAt, coverImage } = edge.node;
      return {
        title,
        url,
        dateAdded: new Date(publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        coverImage,
      };
    });

    return posts;
  } catch (error) {
    console.error("Validation or API error:", error.message);
    return [];
  }
};

async function main() {
  const blogs = await fetchLatestBlogs();

  let readme = readFileSync(READMEFILE_PATH, "utf-8");
  readme = readme.replace(
    /(?<=<!--START_SECTION:blog-posts-->\n)[\s\S]*(?=\n<!--END_SECTION:blog-posts-->)/,
    `| Title | Date | Image | Read More |\n` +
      `| ----- | ---- | ----- | --------- |\n` +
      blogs
        .map(
          (blog) =>
            `| [${blog.title}](${blog.url}) | ${blog.dateAdded} | <img src="${blog.coverImage.url}" width="200" height="auto" /> | [Read More](${blog.url}) |`
        )
        .join("\n")
  );
  writeFileSync(READMEFILE_PATH, readme);
}

main().then(async () => {
  await updateWorkflowNumber();
});
