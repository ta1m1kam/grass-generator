import { drawGrassCanvas, drawGrassSvg } from '../lib';
import mockData from './mock.json';

drawGrassCanvas(document.getElementById('canvas'), { data: mockData, targetYear: "2022", disableAxisLabel: { vertical: false }});
drawGrassSvg(document.getElementById('svg'), { data: mockData, targetYear: "2022", disableAxisLabel: { vertical: false }});
