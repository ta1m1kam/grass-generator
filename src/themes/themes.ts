import { Options, Theme } from "types";

export const themes = {
  standard: {
    background: '#ffffff',
    text: '#000000',
    meta: '#666666',
    grade4: '#216e39',
    grade3: '#30a14e',
    grade2: '#40c463',
    grade1: '#9be9a8',
    grade0: '#ebedf0',
  },
  githubDark: {
    background: "#101217",
    text: "#ffffff",
    meta: "#dddddd",
    grade4: "#27d545",
    grade3: "#10983d",
    grade2: "#00602d",
    grade1: "#003820",
    grade0: "#161b22"
  },
};


export const getTheme = (options: Options): Theme => {
  const { themeName, customTheme } = options;
  if (customTheme) {
    return {
      background: customTheme.background ?? themes.standard.background,
      text: customTheme.text ?? themes.standard.text,
      meta: customTheme.meta ?? themes.standard.meta,
      grade4: customTheme.grade4 ?? themes.standard.grade4,
      grade3: customTheme.grade3 ?? themes.standard.grade3,
      grade2: customTheme.grade2 ?? themes.standard.grade2,
      grade1: customTheme.grade1 ?? themes.standard.grade1,
      grade0: customTheme.grade0 ?? themes.standard.grade0
    };
  }

  const name = themeName ?? "standard";
  return themes[name]
}
