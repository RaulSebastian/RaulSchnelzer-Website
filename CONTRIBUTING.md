# Contributing

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing. These are mostly guidelines, not rules. Feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## I don't want to read this whole thing I just have a question

Feel free to create an [Issue](https://github.com/RaulSebastian/RaulSchnelzer-Website/issues) in form of a question or drop me an e-mail to [mail@raulschnelzer.de](mailto:mail@raulschnelzer.de).

## What should I know before I get started?

I keep this source code open for anyone looking for inspiration or willing to contribute.

### Design Decisions

Most of the code here was created for pragmatic reasons (and because of lack of time). Feel free to suggest different design / architectural approaches.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report.

Before creating bug reports, please check if the **bug** might already be reported.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). After you think you've found a bug, create an issue and provide the following information by filling in [the template]().

Explain the problem and include additional details to help reproduce the problem:

* Use a clear and descriptive title for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible. For example, start by explaining how you started and what steps you took.
* Mention the browser and OS you used.
* Explain which behavior you observed and which you expected to see instead.
* Include screenshots and animated GIFs which show you following the described steps and clearly demonstrate the problem. 

### Suggesting Enhancements

Before creating enhancement suggestions, please check if a similar **Issue** already exists.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/). After you've determined [which repository](#atom-and-packages) your enhancement suggestion is related to, create an issue on that repository and provide the following information:

* Use a clear and descriptive title for the issue to identify the suggestion.
* Provide a step-by-step description of the suggested enhancement.
* Provide specific examples to demonstrate the steps. 
* Include screenshots or a mockup

### Your First Code Contribution

Unsure where to begin contributing to Atom? You can start by looking through these `beginner` and `help-wanted` issues:

* [good first issue][good-first-issue] - issues which should only require a few lines of code, and a test or two.
* [Help wanted issues][help-wanted] - issues which should be a bit more involved than `beginner` issues.

#### Local development

The project can be developed locally.

### Pull Requests

The process described here has several goals:

* Maintain quality
* Fix problems that are important
* Enable a sustainable system to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing <details><summary>What if the status checks are failing?</summary>If a status check is failing, and you believe that the failure is unrelated to your change, please leave a comment on the pull request explaining why you believe the failure is unrelated.</details>

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* When only changing documentation, include `[ci skip]` in the commit title
* Consider starting the commit message with an applicable emoji:
  * :art: `:art:` when improving the format/structure of the code
  * :racehorse: `:racehorse:` when improving performance
  * :non-potable_water: `:non-potable_water:` when plugging memory leaks
  * :memo: `:memo:` when writing docs
  * :penguin: `:penguin:` when fixing something on Linux
  * :apple: `:apple:` when fixing something on macOS
  * :checkered_flag: `:checkered_flag:` when fixing something on Windows
  * :bug: `:bug:` when fixing a bug
  * :fire: `:fire:` when removing code or files
  * :green_heart: `:green_heart:` when fixing the CI build
  * :white_check_mark: `:white_check_mark:` when adding tests
  * :lock: `:lock:` when dealing with security
  * :arrow_up: `:arrow_up:` when upgrading dependencies
  * :arrow_down: `:arrow_down:` when downgrading dependencies
  * :shirt: `:shirt:` when removing linter warnings

### JavaScript Styleguide

All JavaScript must adhere to [JavaScript Standard Style](https://standardjs.com/).

* Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
* Inline `export`s with expressions whenever possible

```js
  // Use this:
  export default class ClassName {

  }

  // Instead of:
  class ClassName {

  }
  export default ClassName
  ```

* Place requires in the following order:
  * Built in Node Modules (such as `path`)
  * Built in Atom and Electron Modules (such as `atom`, `remote`)
  * Local Modules (using relative paths)
* Place class properties in the following order:
  * Class methods and properties (methods starting with `static`)
  * Instance methods and properties

### Specs Styleguide

* Include thoughtfully-worded, well-structured [Jasmine](https://jasmine.github.io/) specs in the `./spec` folder.
* Treat `describe` as a noun or situation.
* Treat `it` as a statement about state or how an operation changes state.

#### Example

```coffee
describe 'a dog', ->
 it 'barks', ->
 # spec here
 describe 'when the dog is happy', ->
  it 'wags its tail', ->
  # spec here
```

### Documentation Styleguide

* Use [Markdown](https://daringfireball.net/projects/markdown).
* Reference methods and classes in markdown with the custom `{}` notation:
  * Reference classes with `{ClassName}`
  * Reference instance methods with `{ClassName::methodName}`
  * Reference class methods with `{ClassName.methodName}`

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

#### Type of Issue and Issue State

Labels starting with `closed:` describe the reason for closing an issue.
Labels starting with `size:` describe the estimated effort in T-Shirt sizes.

| Label name | Description |
| --- | --- |
| `enhancement` |  Feature requests. |
| `bug` |  Confirmed bugs or reports that are very likely to be bugs. |
| `question` |  Questions more than bug reports or feature requests (e.g. how do I do X). |
| `feedback` |  General feedback more than bug reports or feature requests. |
| `help-wanted` |  I would appreciate help from anyone in resolving these issues. |
| `good first issue` |  Less complex issues which would be good first issues to work on for users who want to contribute. |
| `refactor` | Redesign or existing features. |
| `closed: resolved` | Issue has been solved. |
| `closed: duplicate` |  Issues which are duplicates of other issues, i.e. they have been reported before. |
| `closed: wontfix` |  I decided not to fix these issues for now, either because they're working as intended or for some other reason. |
| `closed: invalid` |  Issues which aren't valid (e.g. user errors). |
