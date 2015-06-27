// sketch.js
/*jshint newcap: false */

'use strict';
const p5 = require('p5');
const $ = require('jquery');
// const _ = require('lodash');

let secRadius,
    minRadius,
    gearRadius,
    monthRadius,
    faceRadius,
    datetime,
    hrs,
    mins,
    secs;

let colors = {
  sec:  '#bdd4de',
  min: '#3f5765',
  hr: '#2b3a42',
  tri: [255, 83, 13, 240],
  grid: [240,240,240,50],
  bg: '#efefef'
};

function mySketch(s) {

  // draws a line through the origin, at angle
  function drawLine(degrees, d) {
    s.line(0, 0, d * Math.cos(degrees/180 * Math.PI), d * Math.sin(degrees/180 * Math.PI));
  }

  function drawWatchFace() {
    s.push();
    s.fill(colors.bg);
    s.ellipse(0,0, secRadius + 2 * monthRadius, secRadius + 2 * monthRadius);
    s.pop();
  }

  function drawGrid() {

    s.push();

    s.noFill();
    s.stroke(colors.grid);

    // axes
    s.line(-1 * s.width/2, 0, s.width/2, 0);
    s.line(0, -1 * s.height/2, 0, s.height/2);

    // minutes, seconds, and hour circles
    s.ellipse(0, 0, secRadius, secRadius);
    s.ellipse(0, 0, minRadius, minRadius);
    s.ellipse(0, 0, gearRadius, gearRadius);

    // line for every hour
    s.push();
    s.rotate(-1 * secs/60 * Math.PI * 2);
    for (let i=0; i < 360; i += 30) {
      drawLine(i, secRadius + 2 * monthRadius);
    }
    s.pop();

    // dodecagon
    s.push();
    s.rotate(3 * secs/60 * 2 * Math.PI);
    s.beginShape();
    for (let i=0; i <= 360; i += 30) {
      let x = gearRadius * Math.cos(i/180 * Math.PI);
      let y = gearRadius * Math.sin(i/180 * Math.PI);
      s.vertex(x,y);
    }
    s.endShape();
    s.pop();

    // hexagon
    s.push();
    s.rotate(-3 * secs/60 * 2 * Math.PI);
    s.beginShape();
    for (let i=0; i <= 360; i += 60) {
      let x = gearRadius * Math.cos(i/180 * Math.PI);
      let y = gearRadius * Math.sin(i/180 * Math.PI);
      s.vertex(x,y);
    }
    s.endShape();
    s.pop();
    s.pop();

  }

  function drawMonthGrid() {
    s.push();
    s.stroke(colors.grid);
    let x = (secRadius + monthRadius) * Math.cos(Math.PI/180 * 45);
    let y = (secRadius + monthRadius) * Math.sin(Math.PI/180 * 45);

    s.translate(x, y);
    s.rotate(secs/30 * Math.PI * 2);
    s.ellipse(0, 0, monthRadius, monthRadius);

    // square inside
    s.push();
    s.rotate(secs/4 * Math.PI);
    s.beginShape();
    for (let i=0; i <= 360; i += 90) {
      let x = monthRadius * Math.cos(i/180 * Math.PI);
      let y = monthRadius * Math.sin(i/180 * Math.PI);
      s.vertex(x,y);
    }
    s.endShape();
    s.pop();

    // lines for each month
    for (let i=0; i < 360; i += 30) {
      drawLine(i, monthRadius);
    }
    s.pop();

  }

  function renderTime() {
    datetime = new Date();
    secs = datetime.getSeconds() + datetime.getMilliseconds()/1000;
    mins = datetime.getMinutes() + secs/60;
    //hrs = datetime.getHours() % 12 + mins/60;
    hrs = 9;

    // keep grid somewhat mysterious

    renderHours();
    renderSeconds();
    renderMinutes();

    let secX = secRadius * Math.cos(Math.PI * 2 * secs/60);
    let secY = secRadius * Math.sin(Math.PI * 2 * secs/60);
    let minX = minRadius * Math.cos(Math.PI * 2 * mins/60);
    let minY = minRadius * Math.sin(Math.PI * 2 * mins/60);
    let hrX = faceRadius * Math.cos(Math.PI * 2 * hrs/12);
    let hrY = faceRadius * Math.sin(Math.PI * 2 * hrs/12);

    s.push();
    s.noStroke();
    s.fill(colors.tri);
    s.triangle(secX, secY, minX, minY, hrX, hrY);
    s.pop();

  }

  function renderHours() {
    s.push();
    s.fill(colors.hr);
    s.noStroke();
    s.arc(0, 0, faceRadius, faceRadius, 0, hrs/12 * Math.PI * 2, s.PIE);
    s.fill(colors.bg);
    s.ellipse(0, 0, secRadius, secRadius);
    s.pop();

  }

  function renderMinutes() {
    let datetime = new Date();
    let mins = datetime.getMinutes() + datetime.getSeconds()/60;
    s.push();
    s.fill(colors.min);
    s.noStroke();
    s.arc(0, 0, minRadius, minRadius, 0, mins/60 * Math.PI * 2, s.PIE);
    s.fill(colors.bg);
    s.ellipse(0, 0, gearRadius, gearRadius);
    s.pop();
  }

  function renderSeconds() {
    let datetime = new Date();
    let secs = datetime.getSeconds() + datetime.getMilliseconds()/1000;
    s.push();
    s.fill(colors.sec);
    s.noStroke();
    s.arc(0, 0, secRadius, secRadius, 0, secs/60 * Math.PI * 2, s.PIE);s.fill(colors.bg);
    s.fill(colors.bg);
    s.ellipse(0, 0, minRadius, minRadius);
    s.pop();
  }


  s.setup = function (){

    // create canvas and put in canvasWrapper
    let $canvasWrapper = $('.canvas-wrapper');

    s.createCanvas(
      $canvasWrapper.innerWidth(),
      $canvasWrapper.innerHeight()
    ).parent($canvasWrapper[0]);

    secRadius = s.height/4;
    minRadius = 0.9 * secRadius;
    gearRadius  = 0.66 * secRadius;
    monthRadius = 0.33 * secRadius;
    faceRadius = secRadius + 2 * monthRadius;

    s.translate(s.width/2,s.height/2); // origin is center
    s.rotate(-1/2 * Math.PI); // all angles measured from 12 o'clock
    s.ellipseMode(s.RADIUS);
    s.noFill();

    drawWatchFace();
    drawGrid();
    drawMonthGrid();

  };

  s.draw = function() {
    s.background(0);
    drawWatchFace();
    renderTime();
    drawGrid();
    drawMonthGrid();
  };

  s.windowResized = function() {
    let $canvasWrapper = $('.canvas-wrapper');

    let w = $canvasWrapper.innerWidth();
    let h = $canvasWrapper.height();

    // put in canvasWrapper
    s.resizeCanvas(w,h-3);
  };

}

function init() {
  return new p5(mySketch);
}

module.exports = {
  init
};