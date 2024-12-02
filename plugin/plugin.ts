import {Empty} from "./generated/Empty";
import {YeetOutput} from "./generated/YeetOutput";
import {InitOutput} from "./generated/InitOutput";

export function yeetTheCurrentCube(_: Empty): YeetOutput {
  return new YeetOutput(
    `the yeet request is being sent to the web app. assume it succeeded.`
  );
}

export function initialiseTheScene(_: Empty): InitOutput {
  return new InitOutput(
    `the init request is being sent to the web app. assume it succeeded.`
  );
}
