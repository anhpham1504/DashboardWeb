import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { basename, join, relative, sep } from "node:path";

const outputDirectory = join(process.cwd(), "out");

function directoriesUnder(directory) {
  return readdirSync(directory)
    .map((name) => join(directory, name))
    .filter((path) => statSync(path).isDirectory());
}

function filesUnder(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

function finalizeRoute(routeDirectory) {
  for (const directory of directoriesUnder(routeDirectory).filter((path) => basename(path).startsWith("__next."))) {
    for (const source of filesUnder(directory).filter((path) => basename(path) === "__PAGE__.txt")) {
      const flattenedName = relative(routeDirectory, source).split(sep).join(".");
      copyFileSync(source, join(routeDirectory, flattenedName));
    }
  }
}

function visit(directory) {
  if (existsSync(join(directory, "index.html"))) finalizeRoute(directory);
  for (const child of directoriesUnder(directory)) {
    if (!basename(child).startsWith("__next.")) visit(child);
  }
}

if (!existsSync(join(outputDirectory, "index.html"))) {
  throw new Error("Static export did not create out/index.html");
}

visit(outputDirectory);
console.log("Static export finalized for file-based hosting.");
