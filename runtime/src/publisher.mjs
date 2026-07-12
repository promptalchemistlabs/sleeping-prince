import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SITE_ROOT = path.join(ROOT, "tembusu-circle");

function safeTarget(siteRoot, targetPath) {
  const normalized = targetPath.replaceAll("\\", "/").replace(/^\/+/, "");
  if (!/^content\/(blog|pages)\/[a-z0-9][a-z0-9-]*\.md$/.test(normalized)) {
    throw new Error("Artifact target path is outside the approved Gatsby content directories");
  }
  return path.join(siteRoot, normalized);
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: "pipe" });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(`Gatsby build exited with ${code}: ${output.slice(-1200)}`));
    });
  });
}

export function createPublisher({ siteRoot = SITE_ROOT, build = true } = {}) {
  return {
    async publish(artifact) {
      const target = safeTarget(siteRoot, artifact.targetPath);
      if (!target.startsWith(`${path.resolve(siteRoot)}${path.sep}`)) {
        throw new Error("Resolved artifact path escaped the Gatsby site root");
      }
      await mkdir(path.dirname(target), { recursive: true });
      const markdown = artifact.markdown
        .replace(/^status:\s*["']?draft["']?\s*$/m, 'status: "published"')
        .replace(/^---\n(?!kind:)/, `---\nkind: "${artifact.kind}"\n`);
      await writeFile(target, markdown, "utf8");
      if (build) await run("npm", ["run", "build"], siteRoot);
      return { targetPath: artifact.targetPath, built: build };
    },
  };
}
