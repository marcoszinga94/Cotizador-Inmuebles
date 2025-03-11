import Parse from "parse";

// Inicializar Parse
Parse.initialize(
  process.env.BACK4APP_APP_ID || "",
  process.env.BACK4APP_JAVASCRIPT_KEY || ""
);

Parse.serverURL = "https://parseapi.back4app.com/";

export default Parse;
