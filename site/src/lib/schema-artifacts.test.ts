import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(import.meta.dirname, "../../..");

function readJson(relativePath: string) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), "utf8"));
}

test("canonical enum catalog exposes active assumption and provenance names", () => {
  const enums = readJson("schema/shared/enums.json");

  assert.deepEqual(enums.$defs.assumption_name.enum, enums.$defs.assumption.enum);
  assert.ok(Array.isArray(enums.$defs.provenance_category.enum));
  assert.ok(enums.$defs.provenance_category.enum.includes("graph_ref"));
});

test("minimal capability card examples target active v0.3.0 schema", () => {
  const level1 = readJson("schema/examples/minimal-level1-capability-card.json");
  const level2 = readJson("schema/examples/minimal-level2-capability-card.json");

  assert.equal(level1.$schema, "https://causalagentprotocol.org/schema/capability-card/v0.3.0.json");
  assert.equal(level1.cap_spec_version, "0.3.0");
  assert.equal(level2.$schema, "https://causalagentprotocol.org/schema/capability-card/v0.3.0.json");
  assert.equal(level2.cap_spec_version, "0.3.0");
});
