import { drawGrassCanvas, drawGrassSvg } from '../lib';
import mockData from './mock.json';

drawGrassCanvas(document.getElementById('canvas-standard'), { data: mockData, targetYear: "2022" });
drawGrassCanvas(document.getElementById('canvas-dark'), { data: mockData, targetYear: "2022", themeName: "githubDark"});
drawGrassSvg(document.getElementById('svg-standard'), { data: mockData, targetYear: "2022", });
drawGrassSvg(document.getElementById('svg-dark'), { data: mockData, targetYear: "2022", themeName: "githubDark" });
