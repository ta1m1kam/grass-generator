import { themes } from 'themes/themes';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);
import type { DataStruct, DataStructYear, DataStructContribution } from 'types/data';

interface Options {
  themeName?: keyof typeof themes;
  customTheme: Theme;  
  // skipHeader?: boolean;
  // skipAxisLabel?: boolean;
  username: string;
  data: DataStruct;
  fontFace?: string;
  footerText?: string;
}

interface DrawYearOptions extends Options {
  year: DataStructYear;
  offsetX?: number;
  offsetY?: number;
}

interface GraphEntry {
  date: string;
  info?: DataStructContribution;
}

interface Theme  {
  background: string;
  text: string;
  meta: string;
  grade4: string;
  grade3: string;
  grade2: string;
  grade1: string;
}

const textHeight = 15;
const boxWidth = 10;
const boxMargin = 2;
const canvasMargin = 20;
const yearHeight = textHeight + (boxWidth + boxMargin) * 8 + canvasMargin;

const defaultFontFace = "IBM Plex Mono";

const DATE_FORMAT = "YYYY-MM-DD";


const getDateInfo = (data: DataStruct, date: string) => {
  return data.contributions.find(contrib => contrib.date === date);
}

const drawYear = (ctx: CanvasRenderingContext2D, options: DrawYearOptions) => {
  const {
    year,
    data,
    fontFace = defaultFontFace,
    offsetX = 0,
    offsetY = 0,
  } = options;

  const theme = themes.standard;

  const currentDate = dayjs()
  const thisYear = currentDate.format("YYYY");
  const lastDate = year.year === thisYear ? currentDate : dayjs(year.range.end);
  const firstRealDate = dayjs(`${year.year}-01-01`);
  const firstDate = dayjs(firstRealDate).startOf("week");

  let nextDate = firstDate;
  const firstRowDates: GraphEntry[] = [];
  const graphEntries: GraphEntry[][] = [];

  while (nextDate.isBefore(lastDate)) {
    const date = nextDate.format(DATE_FORMAT);
    firstRowDates.push({
      date,
      info: getDateInfo(data, date)
    });
    nextDate = nextDate.add(1, "week");
  }

  graphEntries.push(firstRowDates);

  for (let i = 1; i < 7; i += 1) {
    graphEntries.push(
      firstRowDates.map(dateObj => {
        const date = dayjs(dateObj.date).weekday(i).format( DATE_FORMAT);
        return {
          date,
          info: getDateInfo(data, date)
        };
      })
    );
  }

  for (let y = 0; y < graphEntries.length; y += 1) {
    for (let x = 0; x < graphEntries[y].length; x += 1) {
      const day = graphEntries[y][x];
      const cellDate = dayjs(day.date);
      if (cellDate.isAfter(lastDate) || !day.info) {
        continue;
      }
      const color = (theme as any)[`grade${day.info.intensity}`];
      ctx.fillStyle = color;
      ctx.fillRect(
        offsetX + (boxWidth + boxMargin) * x,
        offsetY + textHeight + (boxWidth + boxMargin) * y,
        10,
        10
      );
    }
  }

  // Draw Month Label
  let lastCountedMonth = 0;
  for (let y = 0; y < graphEntries[0].length; y += 1) {
    const date = dayjs(graphEntries[0][y].date);
    const month = date.month() + 1;
    const firstMonthIsDec = month === 12 && y === 0;
    const monthChanged = month !== lastCountedMonth;
    if (monthChanged && !firstMonthIsDec) {
      ctx.fillStyle = theme.meta;
      ctx.fillText(
        date.format( "MMM"),
        offsetX + (boxWidth + boxMargin) * y,
        offsetY
      );
      lastCountedMonth = month;
    }
  }
}

export const drawGrass = (canvas: HTMLCanvasElement, options: Options) => {
  const { data } = options;

  const ctx = canvas.getContext("2d");
  let headerOffset= 0;

  if (!ctx) {
    throw new Error("Could not get 2d context from Canvas");
  }

  const height = data.years.length * yearHeight + canvasMargin + headerOffset + 10;
  const width = 53 * (boxWidth + boxMargin) + canvasMargin * 2;
  canvas.height = height;
  canvas.width = width;


  data.years.forEach((year, i) => {
    const offsetY = yearHeight * i + canvasMargin + headerOffset;
    const offsetX = canvasMargin;
    drawYear(ctx, {
      ...options,
      year,
      offsetX,
      offsetY,
      data
    });
  })
}
