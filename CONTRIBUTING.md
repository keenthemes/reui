# Contributing to ReUI

Thank you for considering contributing to reui! Your contributions help improve the project for everyone.
Please follow these guidelines to ensure a smooth collaboration. 
If you need any help, feel free to reach out us via [@reui_io](https://x.com/reui_io).

## Getting Started

1. **Fork the Repository**: Click the 'Fork' button on the top right of the repository page.
2. **Clone Your Fork**:
   ```sh
   git clone https://github.com/keenthemes/reui.git
   cd reui
   ```
3. **Set Up Upstream Remote**:
   ```sh
   git remote add upstream https://github.com/keenthemes/reui.git
   ```

## Setting Up the Development Environment

1. Install dependencies:
   ```sh
   npm install
   ```
2. Run format:
   ```sh
   npm run format
   ```
3. Lint your code:
   ```sh
   npm run lint
   ```

## Format and lint your code

Ensure your code is formatted and linted before submitting any changes. Run the following commands:

```sh
npm run format
npm run lint
```

## Commit Convention

Please follow the commit message format below:

- **feat:** All changes that introduce completely new code or new features.
- **fix:** Changes that fix a bug (ideally, reference an issue if present).
- **refactor:** Any code-related change that is not a fix nor a feature.
- **docs:** Changing existing or creating new documentation (e.g., README, usage docs).
- **build:** Changes regarding the build of the software, dependencies, or adding new dependencies.
- **ci:** Changes regarding the configuration of continuous integration (e.g., GitHub Actions, CI systems).
- **chore:** Repository changes that do not fit into any of the above categories.

**Example commit message:**

```sh
feat(components): add new prop to the avatar component
```

## Submitting a Pull Request

1. Create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
2. Make changes and commit:
   ```sh
   git add .
   git commit -m "Add new feature"
   ```
3. Push to your fork:
   ```sh
   git push origin feature-branch
   ```
4. Open a pull request:
   - Go to the [reui GitHub repository](https://github.com/keenthemes/reui.git).
   - Click on 'New Pull Request'.
   - Select your branch and submit the PR.

## Code Review

Code is reviewed under strict terms to make sure it matches reui code standards and design guidelines.

---

Thank you for contributing! 🚀
