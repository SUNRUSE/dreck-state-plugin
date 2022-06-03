# Dreck State Plugin [![License](https://img.shields.io/github/license/sunruse/dreck-state-plugin.svg)](https://github.com/sunruse/dreck-state-plugin/blob/master/license) [![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

Adds a library of TypeScript which stores and persists application state.

## Features

- Automatic save and restore of application state on suspend and resume.

## Installation

Run the following in a Bash shell at the root of your project:

```bash
git submodule add https://github.com/sunruse/dreck-state-plugin plugins/state
```

## Example

```typescript
const stateManager = new StateManager<AJsonSerializableTypeDescribingTheState>(
  `a key which uniquely identifies this piece of state in local storage`,
  `a key which is checked when restoring state; if this differs, new state is initialized instead (for breaking changes)`,
  { content: `an initial value for when state is initialized rather than restored` }
);

// "stateManager.state" now contains either the initial value, or a value restored from local storage.
// It will be automatically saved back to local storage when the tab is closed.
```
