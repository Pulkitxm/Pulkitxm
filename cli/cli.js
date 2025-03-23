#!/usr/bin/env node

const https = require("https");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const API_URL = "https://pulkitxm.com/api/profile";

console.clear();

console.log("\n=== Pulkit's Profile ===");
console.log("Data source: " + API_URL + "\n");

function formatDate(dateString) {
  if (!dateString) return "Present";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function fetchProfileData() {
  return new Promise((resolve, reject) => {
    console.log("Fetching profile data...");

    https
      .get(API_URL, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const profileData = JSON.parse(data);
            console.log("Data loaded successfully!\n");
            resolve(profileData);
          } catch (error) {
            reject(new Error("Error parsing profile data"));
          }
        });
      })
      .on("error", (err) => {
        reject(new Error(`Error fetching profile data: ${err.message}`));
      });
  });
}

function displayBasicInfo(profile) {
  console.clear();
  console.log("\n=== Basic Information ===\n");
  console.log(`Name: ${profile.name}`);
  console.log(`Title: ${profile.caption}`);
  console.log(`Email: ${profile.email}`);
  console.log(`\nLinks:`);
  console.log(`Resume: ${profile.resumeLink}`);
  console.log(`GitHub: ${profile.links.github}`);
  console.log(`LinkedIn: ${profile.links.linkedin}`);
  console.log(`Twitter: ${profile.links.twitter}`);
  if (profile.links.blogs) {
    console.log(`Blog: ${profile.links.blogs}`);
  }
  return showMainMenu(profile);
}

function displayExperience(profile) {
  console.clear();
  console.log("\n=== Experience ===\n");

  profile.experience.forEach((exp, index) => {
    console.log(`${index + 1}. ${exp.position} at ${exp.companyName}`);
    console.log(
      `   ${formatDate(exp.startDate)} - ${formatDate(exp.endDate)} | ${
        exp.type
      } | ${exp.location}`
    );
    if (exp.desc) {
      console.log(`   ${exp.desc}`);
    }
    console.log("");
  });

  return showMainMenu(profile);
}

function displayProjects(profile) {
  console.clear();
  console.log("\n=== Projects ===\n");

  profile.projects.forEach((project, index) => {
    console.log(`${index + 1}. ${project.name}`);
    console.log(`   Description: ${project.tagline || "No description"}`);
    console.log(`   URL: ${project.url}`);
    console.log("");
  });

  return showMainMenu(profile);
}

function displaySkills(profile) {
  console.clear();
  console.log("\n=== Skills ===\n");

  Object.entries(profile.skills).forEach(([category, skillList]) => {
    console.log(`${category}:`);
    console.log(`   ${skillList.join(", ")}`);
    console.log("");
  });

  return showMainMenu(profile);
}

function displayCertifications(profile) {
  console.clear();
  console.log("\n=== Certifications ===\n");

  profile.certifications.forEach((cert, index) => {
    console.log(`${index + 1}. ${cert.name}`);
    console.log(
      `   Issued by: ${cert.issuedBy.name} (${formatDate(cert.issuedAt)})`
    );
    console.log(`   Verify: ${cert.verifyLink}`);
    console.log("");
  });

  return showMainMenu(profile);
}

function displayContributions(profile) {
  console.clear();
  console.log("\n=== GitHub Contributions ===\n");

  const recentYears = profile.contributions.slice(-2);

  recentYears.forEach((yearData) => {
    console.log(
      `${yearData.year}: ${yearData.contributions.totalContributions} contributions`
    );

    const months = yearData.contributions.months;
    months.forEach((month) => {
      const totalInMonth = month.days.reduce(
        (sum, day) => sum + day.contributionCount,
        0
      );
      if (totalInMonth > 0) {
        const barLength = Math.min(Math.floor(totalInMonth / 5), 30);
        console.log(
          `  ${month.month}: ${"#".repeat(barLength)} (${totalInMonth})`
        );
      }
    });
    console.log("");
  });

  return showMainMenu(profile);
}

function showMainMenu(profile) {
  console.log("\nWhat would you like to see?");
  console.log("1. Basic Information");
  console.log("2. Experience");
  console.log("3. Projects");
  console.log("4. Skills");
  console.log("5. Certifications");
  console.log("6. GitHub Contributions");
  console.log("7. Exit");

  rl.question("\nEnter your choice (1-7): ", (choice) => {
    switch (choice) {
      case "1":
        return displayBasicInfo(profile);
      case "2":
        return displayExperience(profile);
      case "3":
        return displayProjects(profile);
      case "4":
        return displaySkills(profile);
      case "5":
        return displayCertifications(profile);
      case "6":
        return displayContributions(profile);
      case "7":
        console.log("\nThanks for checking out my profile! Goodbye!");
        rl.close();
        return;
      default:
        console.log("\nInvalid choice. Please enter a number between 1 and 7.");
        return showMainMenu(profile);
    }
  });
}

async function main() {
  try {
    const profile = await fetchProfileData();
    showMainMenu(profile);
  } catch (error) {
    console.error(`\nError: ${error.message}`);
    rl.close();
  }
}

main();
