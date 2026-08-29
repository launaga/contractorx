Self-hosted webfonts go here.

The stylesheet expects:
  Archivo    — headings   ($font-display in assets/scss/_variables.scss)
  Inter      — body text  ($font-sans)

Both fall back to system fonts, so the template renders correctly with
this folder empty. To self-host, add the .woff2 files and declare them
at the top of assets/scss/main.scss:

  @font-face {
    font-family: "Archivo";
    src: url("../fonts/archivo-variable.woff2") format("woff2");
    font-weight: 100 900;
    font-display: swap;
  }
