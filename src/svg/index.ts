import { getTheme } from './../themes/themes';
import { DrawBaseOptions } from './../types/index.d';
import { getDateInfo } from './../utils/data-helper';
import type { DrawYearOptions, GraphEntry, Options } from 'types';
import { themes } from 'themes/themes';
import {
  DATE_FORMAT,
  BOX_WIDTH,
  BOX_MARGIN,
  TEXT_HEIGHT,
  YEAR_HEIGHT_SVG,
  SVG_MARGIN,
  TEXT_WIDTH,
} from 'utils/constants';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);

const drawBase = (svg: SVGSVGElement, options: DrawBaseOptions) => {
  const theme = getTheme(options);
  svg.setAttribute('style', `background-color: ${theme.background}; color: ${theme.meta}`);
}
const drawYear = (svg: SVGSVGElement, options: DrawYearOptions) => {
  const {
    year,
    data,
    offsetX = 0,
    offsetY = 0,
  } = options;

  const theme = getTheme(options);

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

      const rect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
      );
      rect.setAttribute('x', `${offsetX + (BOX_WIDTH + BOX_MARGIN) * x}`);
      rect.setAttribute(
        'y',
        `${offsetY + TEXT_HEIGHT + (BOX_WIDTH + BOX_MARGIN) * y}`
      );
      rect.setAttribute('width', '10');
      rect.setAttribute('height', '10');
      rect.setAttribute('fill', color);
      rect.setAttribute('data-count', `${day.info.count}`);
      rect.setAttribute('data-date', day.info.date);
      svg.appendChild(rect);
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
      const text = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      );
      text.textContent = date.format('MMM');
      text.setAttribute('x', `${offsetX + (BOX_WIDTH + BOX_MARGIN) * y}`);
      text.setAttribute('y', `${offsetY}`);
      text.setAttribute('style', `fill: ${theme.meta}; font-size: 10px`);
      svg.appendChild(text);
      lastCountedMonth = month;
    }
  }

  // Draw Day Label
  if (!options.disableAxisLabel?.vertical) {
    ["Mon", "Wed", "Fri"].forEach((day, i) => {
      const text = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      );
      text.textContent = day;
      text.setAttribute('x', `${SVG_MARGIN}`);
      text.setAttribute('y', `${offsetY + TEXT_HEIGHT + BOX_WIDTH * (i+1)*2 + BOX_MARGIN * i*2}`);
      text.setAttribute('style', `fill: ${theme.meta}; font-size: 10px`);
      svg.appendChild(text);
    })
  }
};

export const drawGrassSvg = (svgElement: HTMLElement, options: Options) => {
  const { data } = options;

  const headerOffset = 0;
  let sideOffset = 0;


  if (!options.disableAxisLabel?.vertical) {
    sideOffset = TEXT_WIDTH * 4
  }

  const baseHeight = YEAR_HEIGHT_SVG + SVG_MARGIN + headerOffset + 10;
  const yearsLength = options.targetYear ? 1 : data.years.length;
  const height = yearsLength * baseHeight;
  const width = 53 * (BOX_WIDTH + BOX_MARGIN) + SVG_MARGIN * 2 + sideOffset;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', `${width}`);
  svg.setAttribute('height', `${height}`);
  svg.setAttribute('viewbox', `0 0 ${width} ${height}`);

  drawBase(svg, { ...options, width, height });

  if (!options.targetYear) {
    data.years.forEach((year, i) => {
      const offsetY = YEAR_HEIGHT_SVG * i + SVG_MARGIN + headerOffset;
      const offsetX = SVG_MARGIN;
      drawYear(svg, {
        ...options,
        year,
        offsetX,
        offsetY,
        data,
      });
    });
  } else {
    const year = data.years.filter(year => year.year === options.targetYear)[0];
    const offsetY = SVG_MARGIN + headerOffset;
    const offsetX = SVG_MARGIN + sideOffset;
    drawYear(svg, {
      ...options,
      year,
      offsetX,
      offsetY,
      data,
    });
  }
  svgElement.appendChild(svg);
};
