## How to contribute to ProjectLab

#### **Did you find a bug?**

- **Ensure the bug was not already reported** by searching on GitHub under [issues](https://github.com/wizeline/project-lab/issues).

- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/wizeline/project-lab/issues/new/choose). Be sure the issue is in the Backlog column, so it can be reviewed and then added to the To do column, also be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

- If possible, use the relevant bug report templates to create the issue.

#### **Did you write a patch that fixes a bug?**

- Open a [new GitHub pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) with the patch.

- Ensure the PR description clearly describes the problem and solution. Include the relevant issue number if applicable.

- Before submitting, please read the [Code of Conduct](https://github.com/wizeline/project-lab/blob/main/CODE_OF_CONDUCT.md) guide to know more about coding conventions and benchmarks.

#### **Did you fix whitespace, format code, or make a purely cosmetic patch?**

Changes that are cosmetic in nature and do not add anything substantial to the stability, functionality, or testability will generally be accepted.

#### **Do you intend to add a new feature or change an existing one?**

- Suggest your change in the [slack channel](https://slack.com/app_redirect?channel=CQCB5MWG6) or add a [new issue](https://github.com/wizeline/project-lab/issues/new/choose) describing the changes with as much details as possible, and start writing code.

- Please open an issue on GitHub and try to attend the meetings so everyone can hear and understand your request. If this is not possible, contact any of the principal stakeholders.

### Branch Naming Conventions

The following rules are a common convention for naming Git branches:

1. Start the branch name with a [_Grouping Token_](#grouping-tokens)
2. Add the [_Issue Tracker Number_](#issue-tracker-number) after the Grouping Token, if available
3. End the branch name with [_Description Tokens_](#description-tokens)
4. Separate branch parts by slashes (`/`)
5. Don't use numbers to start your branch name
6. Use short nouns for Grouping and Description Tokens

```
<grouping-token>/<tracker-number>/<description-tokens>
```

Examples:

```
group1/XXXX/lead-foo
group1/YYYY/lead-baz
group2/lead-bar
group3/lead-foo
```

#### Grouping Tokens

Grouping Tokens are the ones in front of the branch name. Use one of the next defined tokens to group the branches.

- `feat` for creating or improving a feature.
- `bug` for fixing a bug in an existing feature.
- `test` for adding tests or improving test coverage.
- `chore` for updating tasks that have no production code change.
- `doc` for improving READMEs or other Markdown documents.
- `junk` for experimental features not to be merged.

#### Issue Tracker Number

Issue Tracker Number is the one after the Grouping Token, if exists. It is the issue number assigned to the feature or bug in the project's issue tracking tool.

Examples:

```
feat/RSSI-12/order-blueprints
bug/RSEM-10/sticky-navbar
test/RCMY-9/post-model-attributes
junk/RUMS-49/login-bug-test
```

#### Description Tokens

Description Tokens are the ones at the end of the branch name. These tokens must match your flow and are personalized depending of your code addition or subtraction.

Examples:

```
feat/order-blueprints
bug/sticky-navbar
test/post-model-attributes
junk/login-bug-test
```

#### **Do you have questions about the source code?**

- Ask any question about ProjectLab in the [slack channel](https://slack.com/app_redirect?channel=CQCB5MWG6).

Thanks! :heart: :heart: :heart:

Project Lab Team

#### **References**

- Wizeline [contribution guidelines](https://github.com/wizeline/wize-docs/blob/master/development/git-contributing-guidelines.md).
