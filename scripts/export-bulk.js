const fs = require("fs");
const { execSync } = require("child_process");

const cookie = process.env.UMBRACO_COOKIE;
const xsrfToken = process.env.UMBRACO_XSRF_TOKEN;

if (!cookie) {
  console.error("Missing UMBRACO_COOKIE");
  process.exit(1);
}

const collections = JSON.parse(
  fs.readFileSync("/tmp/collections_to_export.json", "utf8"),
);

console.log(`Starting export of ${collections.length} collections...`);

for (let i = 0; i < collections.length; i++) {
  const c = collections[i];
  console.log(
    `\n[${i + 1}/${collections.length}] Exporting ${c.name} (ID: ${c.id}) for ${c.user}...`,
  );

  const config = JSON.stringify({
    cookie,
    xsrfToken: xsrfToken || "",
    parentId: c.id,
    collectionName: c.name,
    outDir: `/home/user/projects/kiibee/${c.outDir}`,
    includeProperties: [
      "title",
      "orderID",
      "hidden",
      "description",
      "headline",
      "coverImage",
      "access",
      "rentalPrice",
      "purchasePrice",
      "code",
      "period",
    ],
    fetchDetails: true,
  });

  try {
    const output = execSync(`node scripts/export-umbraco-collection.mjs`, {
      input: config,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"], // stdin, stdout, stderr
    });
    console.log(output.trim());
  } catch (err) {
    console.error(`Error exporting ${c.name}:`, err.message);
    if (err.stdout) console.error(err.stdout);
    if (err.stderr) console.error(err.stderr);
  }
}

console.log("\nBulk export finished!");
