Self-hosted webfonts go here.

The stylesheet expects:
  Inter      — body text  ($font-sans in assets/scss/_variables.scss)
  Fraunces   — headings   ($font-display)

Both fall back to system fonts, so the template renders correctly with
this folder empty. To self-host, add the .woff2 files and declare them
at the top of assets/scss/main.scss:

  @font-face {
    font-family: "Inter";
    src: url("../fonts/inter-variable.woff2") format("woff2");
    font-weight: 100 900;
    font-display: swap;
  }
