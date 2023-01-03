import type { DrawYearOptions, GraphEntry, Options } from 'types';
import { themes } from 'themes/themes';
import { getDateInfo } from 'utils/data-helper';
import {
  DEFAULT_FONT_FACE,
  DATE_FORMAT,
  BOX_WIDTH,
  BOX_MARGIN,
  TEXT_HEIGHT,
  YEAR_HEIGHT_CANVAS,
  CANVAS_MARGIN,
  CANVAS_MARGIN,
} from 'utils/constants';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);

const drawYear = (ctx: CanvasRenderingContext2D, options: DrawYearOptions) => {
  const {
    year,
    data,
    offsetX = 0,
    offsetY = 0,
  } = options;

  const theme = themes.standard;

  const currentDate = dayjs();
  const thisYear = currentDate.format('YYYY');
  const lastDate = year.year === thisYear ? currentDate : dayjs(year.range.end);
  const firstRealDate = dayjs(`${year.year}-01-01`);
  const firstDate = dayjs(firstRealDate).startOf('week');

  let nextDate = firstDate;
  const firstRowDates: GraphEntry[] = [];
  const graphEntries: GraphEntry[][] = [];

  while (nextDate.isBefore(lastDate)) {
    const date = nextDate.format(DATE_FORMAT);
    firstRowDates.push({
      date,
      info: getDateInfo(data, date),
    });
    nextDate = nextDate.add(1, 'week');
  }

  graphEntries.push(firstRowDates);

  for (let i = 1; i < 7; i += 1) {
    graphEntries.push(
      firstRowDates.map((dateObj) => {
        const date = dayjs(dateObj.date).weekday(i).format(DATE_FORMAT);
        return {
          date,
          info: getDateInfo(data, date),
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
        offsetX + (BOX_WIDTH + BOX_MARGIN) * x,
        offsetY + TEXT_HEIGHT + (BOX_WIDTH + BOX_MARGIN) * y,
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
    if (!options.disableAxisLabel?.horizontal && monthChanged && !firstMonthIsDec) {
      ctx.fillStyle = theme.meta;
      ctx.fillText(
        date.format('MMM'),
        offsetX + (BOX_WIDTH + BOX_MARGIN) * y,
        offsetY
      );
      lastCountedMonth = month;
    }
  }

  // Draw Day Label
  if (!options.disableAxisLabel?.vertical) {
    ["Mon", "Wed", "Fri"].forEach((day, i) => {
      ctx.fillText(
        day,
        CANVAS_MARGIN,
        offsetY + TEXT_HEIGHT + BOX_WIDTH * (i+1)*2 + BOX_MARGIN * i*2
      )
    })
  }
};

export const drawGrassCanvas = (
  canvas: HTMLCanvasElement,
  options: Options
) => {
  const { data } = options;

  const ctx = canvas.getContext('2d');
  const headerOffset = 0;
  let sideOffset = 0;

  if (!ctx) {
    throw new Error('Could not get 2d context from Canvas');
  }

  if (!options.disableAxisLabel?.vertical) {
    sideOffset = TEXT_HEIGHT * 3 + BOX_MARGIN
  }

  const baseHeight = YEAR_HEIGHT_CANVAS + CANVAS_MARGIN + headerOffset + 10;
  const yearsLength = options.targetYear ? 1 : data.years.length;
  const height = yearsLength * baseHeight;
  const width = 53 * (BOX_WIDTH + BOX_MARGIN) + CANVAS_MARGIN * 2 + sideOffset;
  canvas.height = height;
  canvas.width = width;

  if (!options.targetYear) {
    data.years.forEach((year, i) => {
      const offsetY = YEAR_HEIGHT_CANVAS * i + CANVAS_MARGIN + headerOffset;
      const offsetX = CANVAS_MARGIN + sideOffset;
      drawYear(ctx, {
        ...options,
        year,
        offsetX,
        offsetY,
        data,
      });
    });
  } else {
    const year = data.years.filter(year => year.year === options.targetYear)[0];
    const offsetY = CANVAS_MARGIN + headerOffset;
    const offsetX = CANVAS_MARGIN + sideOffset;
    drawYear(ctx, {
      ...options,
      year,
      offsetX,
      offsetY,
      data,
    });
  }
};
