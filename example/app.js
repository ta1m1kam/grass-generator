import { drawGrassCanvas, drawGrassSvg } from '../lib';
import mockData from "./mock.json";

drawGrassCanvas(document.getElementById("canvas"), { data: mockData });
drawGrassSvg(document.getElementById("svg"), { data: mockData });
