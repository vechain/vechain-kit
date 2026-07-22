# VeChain Kit Expert production bundle

This directory contains everything needed to create the production Agent Marketplace agent and later embed it on the VeChain Kit website.

## 1. Build the knowledge documents

From the VeChain Kit repository root:

```bash
node agent-marketplace/vechain-kit-expert/build-knowledge.mjs
```

The command creates eleven generated thematic Markdown documents in [`knowledge/`](knowledge/). Together with the maintained `00-curated-integration-guide.md`, the upload set contains twelve documents. Each stays below Agent Marketplace’s 10 MB upload limit and preserves repository source paths for grounded answers.

The generator expects the canonical `vechain-ai-skills` repository beside this repository (`../vechain-ai-skills`). Override it when needed:

```bash
VECHAIN_AI_SKILLS_DIR=/absolute/path/to/vechain-ai-skills \
node agent-marketplace/vechain-kit-expert/build-knowledge.mjs
```

Re-run it from the release commit whenever VeChain Kit changes. The generated [`manifest.json`](knowledge/manifest.json) records sizes, source counts, and SHA-256 hashes so you can see which documents need replacing.

## 2. Create the production agent

Use [`agent-config.md`](agent-config.md) for every builder field and paste [`system-prompt.md`](system-prompt.md) into the system-prompt section.

Upload all twelve numbered `.md` files from `knowledge/`. Do not upload `manifest.json` as knowledge.

Enable **Search knowledge base**. It is required: uploaded documents are not available to the model unless that tool is selected.

## 3. Create and attach the support skill

Import [`skill/vechain-kit-support/SKILL.md`](skill/vechain-kit-support/SKILL.md) into the Marketplace Skill Library and publish it. Then return to the agent draft and attach the published `vechain-kit-support` skill.

The knowledge documents contain the facts and examples. The skill is deliberately smaller: it defines how the agent searches those documents, resolves conflicts, verifies public APIs, and structures safe implementation answers. Do not split the corpus into one skill per topic or paste the full knowledge documents into the skill body.

After publishing or changing the skill, reset the Test Drive conversation before testing. Marketplace threads pin the published skill version when the thread is created, so an existing test thread will not see a newer version.

## 4. Add the official documentation URLs

[`official-links.txt`](official-links.txt) lists the canonical VeChain Kit pages verified on 17 July 2026. Agent Marketplace ingests each URL independently; adding the docs homepage does not recursively crawl the site.

For the maximum-coverage production agent requested here, add every URL in that file after uploading the twelve local documents. Add them in batches of at most five URLs, matching the Marketplace ingestion limit, and wait until every row reaches `READY`.

The source bundles, AI Skills, examples, and published docs overlap intentionally at the concept level but have different jobs:

-   current code/types decide what API actually exists;
-   playground and examples provide working snippets;
-   VeChain AI Skills provide implementation decisions and pitfalls;
-   published docs provide the public developer explanation and canonical links.

Do not add the same URL twice. If acceptance tests show repeated or contradictory retrieval, remove the stale URL copy rather than removing the current source or AI Skills document.

## 5. Preview and publish

Use [`test-questions.md`](test-questions.md) as the acceptance suite. Test at least one question from every section plus all hallucination/freshness checks. Then submit the agent for review and publish it.

Knowledge is version-scoped in Agent Marketplace. Updating a published agent creates or modifies its draft; confirm the replacement documents are attached to the version you submit.

## 6. Configure the widget

After publication, open the agent’s **Embed** tab:

1. enable embedding;
2. add the exact website origins;
3. set the daily token limit;
4. copy the generated `<script>` snippet;
5. keep it ready for the website change that replaces Kapa AI.

Do not hand-edit the agent id, creator handle, or embed key in that snippet. Agent Marketplace generates and validates them together. Rotating the embed key invalidates every previously copied snippet.

The current widget is anonymous and stateless. It supports plain-text answers but does not preserve a visitor’s conversation memory. Rich Markdown/tool/artifact rendering, optional login, paid licensing, and persistent anonymous history are not part of the current embed.

## Maintenance cadence

For each VeChain Kit release:

1. check out the release commit;
2. run the build command;
3. compare `knowledge/manifest.json` with the prior version;
4. replace changed documents in the production agent draft;
5. update the skill only when the support workflow or guardrails change, publish it, and pin the new version to the draft;
6. update any selected URL documents;
7. reset Test Drive and rerun the acceptance questions;
8. submit and publish the new agent version.

Do not upload `.env` files, credentials, compiled output, `node_modules`, generated translations, or arbitrary repository history. The builder intentionally excludes them.
