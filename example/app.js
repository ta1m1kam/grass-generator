import { drawGrass } from '../lib';
import mockData from "./mock.json";

drawGrass(document.getElementById("canvas"), { data: mockData });
