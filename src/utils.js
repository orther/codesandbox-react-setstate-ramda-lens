import * as R from "ramda";
import prettier from "prettier";
import beautifyJs from "js-beautify";

export const fnToPrettySource = (fn) => {
  const src = fn.toString();

  const cleanedSrc = src
    .split("return ")[1]
    .split(/\}$/u)[0]
    .replace(/_ramda.default/g, "R")
    .replace(/_this/, "this")
    .replace(/\(.+updateConverge\)/g, "(updateConverge")
    //.replace(/this\.setState\(/, `\rthis.setState(\n  `);
    .trim();

  return prettySource(cleanedSrc);
};

export const prettySource = (src) => {
  return R.compose(
    (srcInput) =>
      prettier.format(srcInput, {
        semi: false,
        parser: "babylon"
      }),
    (srcInput) =>
      beautifyJs(srcInput, {
        indent_size: "2",
        indent_char: " ",
        max_preserve_newlines: "5",
        preserve_newlines: false,
        keep_array_indentation: false,
        break_chained_methods: true,
        indent_scripts: "normal",
        //brace_style: 'collapse',
        space_before_conditional: true,
        unescape_strings: true,
        jslint_happy: true,
        //end_with_newline: true,
        wrap_line_length: "20",
        indent_inner_html: false,
        comma_first: false,
        e4x: false
      })
  )(src);
};
