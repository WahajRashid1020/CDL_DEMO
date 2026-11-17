# Legal content

`terms.json`, `privacy.json` and `ethics.json` were generated from the old site's JSX
(`components/Term/Header`, `components/PrivacyPolicy/Header`, `components/CodeOfEthics/Detail`)
by parsing it with the TypeScript compiler and keeping only the text blocks:

| Old component                         | Block |
| ------------------------------------- | ----- |
| `Title`, `MainHeading`, `HeadingTwo`, `SubHeading` | `h2`  |
| `SubHeadingTwo`                       | `h3`  |
| `Description`, `SmallDescription`    | `p`   |
| `Bullet` (incl. `[...].map(…)` lists) | `li`  |

Bold (`<b>`) runs are kept as `{ text, bold: true }`. The wording is unchanged — edit these
files (or have legal send new copy) rather than retyping text into components.
