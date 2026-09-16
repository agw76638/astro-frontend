---
title: 'oh-my-opencode-slim, a lite agent orchestration plugin'
description: 'review of oh-my-opencode slim'
pubDate: 2026-09-16
---

Hi this is my first post and I will talk about oh-my-opencode-slim. I was looking for a way to make a multi agent setup and found this plugin.

## What is oh-my-opencode-slim?

[oh-my-opencode-slim](https://github.com/alvinunreal/oh-my-opencode-slim) is an agent orchestration plugin for OpenCode made by [alvinunreal](https://github.com/alvinunreal). It includes a built-in team of specialized agents that can scout a codebase, look up fresh documentation, review architecture, handle UI work, and execute well-scoped implementation tasks under one orchestrator.

There are seven specialized agents and you can choose models for the agents considering intelligence and cost.

## The agents

There is Orchestrator, Explorer, Oracle, Council, Librarian, Designer, and Fixer.

### Orchestrator

Orchestrator will be the one who you will interact with. It will make plans and delegate tasks to spcialized agents.

You would want a strong model capable of orchestration.

### Explorer

Explorer searches codebases.

A fast, low-cost model would be a good fit.

### Oracle

Oracle is the Strategic advisor and debugger of last resort.

Choose your strongest model.

### Librarian

Librarian handles research and documentation lookups. Speed and efficiency matters.

### Designer

Implements UI/UX. Choose a model that is strong at UI/UX judgment, frontend implementation, and visual polish.

### Fixer

Handels scoped implementation work. Choose a model that excecuts plans well

## Best models?

The plugin does have presets but besides the OpenAI preset it is a bit outdated. Here are my custom presets that I have been trying out.

### $30 Preset

```json
{
  "presets": {
    "thirtydollars": {
      "orchestrator": {
        "model": "openai/gpt-5.6-terra",
        "skills": ["*"],
        "mcps": ["*", "!context7"]
      },
      "oracle": {
        "model": "openai/gpt-5.6-sol",
        "skills": ["simplify"],
        "mcps": []
      },
      "explorer": {
        "model": "openai/gpt-5.6-luna",
        "skills": [],
        "mcps": []
      },
      "librarian": {
        "model": "opencode-go/mimo-v2.5",
        "skills": [],
        "mcps": ["context7", "gh_grep"]
      },
      "designer": {
        "model": "opencode-go/muse-spark-1.3-contributor",
        "skills": [],
        "mcps": []
      },
      "fixer": {
        "model": "opencode-go/glm-5.3-flash",
        "skills": [],
        "mcps": []
      }
    }
  }
}
```

So a “strong brain + inexpensive workforce” setup. It would help reducing ChatGPT plus usage.

Also I changed Github Copilot pro that the current $30 preset uses to OpenCode Go.

You could also fit Astra with low reasoning for Oracle.

### opencode-go

```json
"opencode-go": {
      "orchestrator": {
        "model": "opencode-go/glm-5.3-flash",
        "variant": "high",
        "skills": ["*"],
        "mcps": ["*", "!context7"]
      },
      "oracle": {
        "model": "opencode-go/glm-5.3-flash",
        "variant": "max",
        "skills": ["simplify"],
        "mcps": []
      },
      "explorer": {
        "model": "opencode-go/mimo-v2.5",
        "skills": [],
        "mcps": []
      },
      "librarian": {
        "model": "opencode-go/mimo-v2.5",
        "skills": [],
        "mcps": ["context7", "gh_grep"]
      },
      "designer": {
        "model": "opencode-go/muse-spark-1.3-contributor",
        "variant": "max",
        "skills": [],
        "mcps": []
      },
      "fixer": {
        "model": "opencode-go/muse-spark-1.3-contributor",
        "skills": [],
        "mcps": []
      }
}
```

This one is an OpenCode Go only config. This set up is GLM 5.3 flash for reasoning, Muse Spark 1.3 for implementing, Mimo v2.5 for searching.

Currently I think these 3 models have the best value for price in OpenCode Go plan.

## Final Thoughts

I think it is a solid option for people who want to try agent orchestration like me.

Also watching agents talking to each other is kind of fun!
