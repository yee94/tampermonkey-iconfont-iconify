import { isEmptyColor, parseColors } from "@iconify/tools/lib/colors/parse";
import { removeBadAttributes } from "@iconify/tools/lib/svg/cleanup/attribs";
import { checkBadTags } from "@iconify/tools/lib/svg/cleanup/bad-tags";
import { cleanupInlineStyle } from "@iconify/tools/lib/svg/cleanup/inline-style";
import { cleanupRootStyle } from "@iconify/tools/lib/svg/cleanup/root-style";
import { cleanupSVGRoot } from "@iconify/tools/lib/svg/cleanup/root-svg";
import { SVG } from "@iconify/tools/lib/svg/index";
import { parseSVG } from "@iconify/tools/lib/svg/parse";

declare const unsafeWindow: any;
declare const $: any;

async function cleanupSVG(svg) {
  await cleanupInlineStyle(svg);
  cleanupSVGRoot(svg);
  await checkBadTags(svg);
  await removeBadAttributes(svg);
  await cleanupRootStyle(svg);
}

const reactTemplate = (svgName, svgStr) => {
  svgName = toCamelCase(svgName);

  svgStr = svgStr.replace(/^<svg /, `<svg {...props} `);

  // style string to object
  svgStr = svgStr.replace(/style="([^"]+)"/g, (all, style) => {
    const styleObj = style.split(";").reduce((obj, item) => {
      let [key, value] = item.split(":");

      key = key
        .trim()
        .replace(/-([a-z])/g, (all, letter) => letter.toUpperCase());

      if (key && value) {
        obj[key] = value;
      }
      return obj;
    }, {} as any);

    return `style={${JSON.stringify(styleObj).replace(
      /}$/,
      ", ...props.style}"
    )}}`;
  });

  return [
    `import React from "react";`,
    "",
    `export const ${svgName}Icon = (props) => {`,
    `	return ${svgStr};`,
    `};`,
  ].join("\n");
};

// @ts-ignore
window.iconfontRunMain = async () => {
  everytime(
    () =>
      document.querySelector("ul.preview-dropdown") &&
      !document.getElementById("download-iconify"),
    () => {
      const projectId = new URLSearchParams(location.search).get("projectId");
      unsafeWindow.downloadIconifyFile = async function () {
        const res = await fetch(
          `/api/project/detail.json?pid=${projectId}`
        ).then((res) => res.json());
        const { icons, project } = res.data;

        const iconifyJson = makeIconifyJson(
          project.name,
          icons.reduce((obj, item) => {
            const svg = new SVG(item.show_svg);
            return Object.assign(obj, {
              [toKebabCase(item.name)]: {
                body: svg.getBody(),
                ...svg.viewBox,
              },
            });
          }, {})
        );

        console.log("🚀 #### ~ iconifyJson", iconifyJson);

        downloadFile("iconify.json", JSON.stringify(iconifyJson, null, 2));
      };
      $("ul.preview-dropdown").append(
        '<li id="download-iconify" ><span onclick="downloadIconifyFile()" >Iconify JSON</span></li>'
      );
    }
  );

  everytime(
    () =>
      !!document.querySelector(".mp-e2e-content .download-btns") &&
      !document.getElementById("react-download"),
    () => {
      const btns = document.querySelector(".mp-e2e-content .download-btns");
      unsafeWindow.downloadReactFile = async function () {
        const svgStr = $(".stage.J_stage svg")[0].outerHTML;
        const svg = new SVG(svgStr);
        await cleanupSVG(svg);
        await parseColors(svg, {
          defaultColor: "currentColor",
          callback: (attr, colorStr, color) => {
            return !color || isEmptyColor(color) ? colorStr : "currentColor";
          },
        });

        parseSVG(svg, (item) => {
          if (item.tagName === "svg") {
            item.$element.attr("style", "vertical-align: -0.125em");
          }
        });

        const finalSvg = svg.toString();

        const svgName = $(".mp-e2e-body .top-title span")[0].innerText.replace(
          / /g,
          "-"
        );
        const reactStr = reactTemplate(svgName, finalSvg);

        downloadFile(`${svgName}.tsx`, reactStr);
      };
      $(btns).prepend(
        `<span id="react-download" class="btn btn-normal mr20" onclick="downloadReactFile()" >React \u4E0B\u8F7D</span>`
      );
    }
  );
};

function downloadFile(name, content) {
  const aLink = document.createElement("a");
  const blob = new Blob([content]);
  aLink.download = name;
  aLink.href = URL.createObjectURL(blob);

  aLink.click();
}

function wait(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, time);
  });
}

async function everytime(fn, callback) {
  while (true) {
    await wait(500);
    const result = fn();
    if (result) {
      callback(result);
    }
  }
}

function removeBadWords(str) {
  // 中文
  if (/^[\u4e00-\u9fa5]+$/.test(str)) {
    return str;
  }
  return str.replace(/[^\w\d-_ ]/g, "").replace(/[-_ ]{2,}/g, "-");
}

function toKebabCase(str) {
  str = removeBadWords(str);
  return str.toLowerCase().replace(/ /g, "-").replace(/_/g, "-");
}

function toCamelCase(str) {
  str = removeBadWords(str);
  return str
    .replace(/ /g, "-")
    .replace(/_(\w)/g, (all, letter) => letter.toUpperCase())
    .replace(/-(\w)/g, (all, letter) => letter.toUpperCase())
    .replace(/^[a-z]/, (s) => s.toUpperCase());
}

function makeIconifyJson(prefix, icons) {
  return {
    prefix,
    lastModified: 1673023160,
    icons,
    width: 1024,
    height: 1024,
  };
}
